'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, SpecialOffer } from '@/types';
import { SPECIAL_OFFERS } from '@/data/mockData';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  appliedOffer: SpecialOffer | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sip_bite_cart_items';
const PROMO_STORAGE_KEY = 'sip_bite_cart_promo';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedOffer, setAppliedOffer] = useState<SpecialOffer | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedPromo = localStorage.getItem(PROMO_STORAGE_KEY);
      if (storedPromo) {
        setAppliedOffer(JSON.parse(storedPromo));
      }
    } catch (e) {
      console.warn('Failed to load cart from storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (appliedOffer) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedOffer));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [items, appliedOffer, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'id' | 'totalPrice'>) => {
    setItems((prev) => {
      // If it's a standard product without custom details, check if it already exists
      if (!newItem.isCustom && newItem.productId) {
        const existingIdx = prev.findIndex((item) => !item.isCustom && item.productId === newItem.productId);
        if (existingIdx >= 0) {
          const updated = [...prev];
          const newQty = updated[existingIdx].quantity + newItem.quantity;
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            totalPrice: newQty * updated[existingIdx].unitPrice,
          };
          return updated;
        }
      }

      // Otherwise add as new line item
      const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const cartItem: CartItem = {
        ...newItem,
        id,
        totalPrice: newItem.unitPrice * newItem.quantity,
      };
      return [...prev, cartItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedOffer(null);
  };

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const offer = SPECIAL_OFFERS.find((o) => o.code.toUpperCase() === cleanCode && o.active);
    
    if (!offer) {
      return { success: false, message: 'Invalid or expired promo code.' };
    }

    if (subtotal < offer.minOrder) {
      return {
        success: false,
        message: `Min. order of ₹${offer.minOrder} required for code ${offer.code}. (Current: ₹${subtotal})`,
      };
    }

    setAppliedOffer(offer);
    return { success: true, message: `Promo code "${offer.code}" applied successfully!` };
  };

  const removePromoCode = () => {
    setAppliedOffer(null);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Delivery charge: ₹40 if subtotal < ₹499 and not FREESHIP, else ₹0
  let deliveryFee = subtotal > 0 && subtotal < 499 ? 40 : 0;
  if (appliedOffer?.code === 'FREESHIP') {
    deliveryFee = 0;
  }

  // Discount
  let discount = 0;
  if (appliedOffer && appliedOffer.discountPercent > 0 && subtotal >= appliedOffer.minOrder) {
    discount = Math.round((subtotal * appliedOffer.discountPercent) / 100);
  }

  const grandTotal = Math.max(0, subtotal - discount + (subtotal > 0 ? deliveryFee : 0));

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        appliedOffer,
        applyPromoCode,
        removePromoCode,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
