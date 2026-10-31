'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, PhoneCall, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SPECIAL_OFFERS } from '@/data/mockData';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    appliedOffer,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) setPromoInput('');
  };

  // WhatsApp formatted order text
  const generateWhatsAppMessage = () => {
    let msg = `*🥤 NEW SIP & BITE SHAKE ORDER*\n\n`;
    items.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name}* x${item.quantity} = ₹${item.totalPrice}\n`;
      if (item.isCustom && item.customDetails) {
        const c = item.customDetails;
        msg += `   • Base: ${c.base}\n`;
        msg += `   • Flavor: ${c.flavor}\n`;
        msg += `   • Size: ${c.size}\n`;
        msg += `   • Sweetness: ${c.sweetness}\n`;
        if (c.toppings.length > 0) {
          msg += `   • Toppings: ${c.toppings.map((t) => t.name).join(', ')}\n`;
        }
      }
    });

    msg += `\n*Subtotal:* ₹${subtotal}`;
    if (discount > 0) msg += `\n*Discount (${appliedOffer?.code}):* -₹${discount}`;
    msg += `\n*Delivery Fee:* ₹${deliveryFee}`;
    msg += `\n*Grand Total:* ₹${grandTotal}`;
    msg += `\n\nPlease confirm my order and share estimated delivery time!`;

    return encodeURIComponent(msg);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF7] shadow-2xl flex flex-col border-l border-[#EFE7DE]">
          {/* Header */}
          <div className="p-5 border-b border-[#EFE7DE] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-extrabold text-[#2D1810]">Your Shake Bag</h2>
              <span className="text-xs font-bold px-2 py-0.5 bg-[#FFF0F4] text-[#FF4B72] rounded-full">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-[#FFF0F4] rounded-full mx-auto flex items-center justify-center text-4xl animate-bounce">
                  🥤
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#2D1810]">Your bag is empty</h3>
                  <p className="text-xs text-[#7C4A3A]">
                    Craving something rich or fruity? Explore our craft shakes or build your dream creation!
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="inline-flex items-center gap-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#EFE7DE] shadow-xs flex flex-col gap-2.5 transition-all hover:border-[#FF4B72]/30"
                >
                  <div className="flex gap-3">
                    {/* Item Image */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FDF0D5] shrink-0 border border-black/5">
                      <Image
                        src={item.image || '/images/shakes/hero_shake.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-sm font-extrabold text-[#2D1810] leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#FF4B72] mt-0.5">
                        ₹{item.unitPrice}{' '}
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-400 font-normal">
                            (₹{item.totalPrice} total)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customisation Details Pill */}
                  {item.isCustom && item.customDetails && (
                    <div className="bg-[#FFFDF7] p-2 rounded-xl border border-[#F5EDE4] text-[11px] space-y-1 text-[#4A2E2B]">
                      <div className="flex flex-wrap gap-1 font-semibold">
                        <span className="bg-[#FFE8EE] text-[#FF4B72] px-1.5 py-0.5 rounded">
                          {item.customDetails.flavor}
                        </span>
                        <span className="bg-[#F0EBE1] text-[#2D1810] px-1.5 py-0.5 rounded">
                          {item.customDetails.base}
                        </span>
                        <span className="bg-[#E8F8F5] text-[#00B894] px-1.5 py-0.5 rounded">
                          {item.customDetails.size}
                        </span>
                        <span className="bg-[#FFF5CC] text-[#B8860B] px-1.5 py-0.5 rounded">
                          {item.customDetails.sweetness}
                        </span>
                      </div>
                      {item.customDetails.toppings.length > 0 && (
                        <div className="text-[10px] text-gray-500 pt-0.5">
                          <span className="font-bold text-[#2D1810]">Toppings:</span>{' '}
                          {item.customDetails.toppings.map((t) => t.name).join(', ')}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                    <span className="text-xs text-gray-400">Qty:</span>
                    <div className="flex items-center gap-2 bg-[#F8F5F0] rounded-full p-1 border border-[#EFE7DE]">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-[#2D1810]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-green-50 hover:text-green-600 transition-colors cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Quick Promo Pills */}
            {items.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#7C4A3A] uppercase tracking-wider block mb-1.5">
                  Available Offers:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SPECIAL_OFFERS.slice(0, 3).map((offer) => (
                    <button
                      key={offer.id}
                      onClick={() => applyPromoCode(offer.code)}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                        appliedOffer?.code === offer.code
                          ? 'bg-[#00B894] text-white border-[#00B894]'
                          : 'bg-white text-[#FF4B72] border-[#FF4B72]/30 hover:bg-[#FFF0F4]'
                      }`}
                    >
                      <Tag className="w-2.5 h-2.5" />
                      <span>{offer.code}</span>
                      {appliedOffer?.code === offer.code && <Check className="w-2.5 h-2.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#EFE7DE] bg-white space-y-3 shadow-lg">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. SIPBITE20)"
                    className="w-full text-xs uppercase px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  />
                  {appliedOffer && (
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="absolute right-2 top-2 text-xs text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-[#2D1810] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#4A2E2B] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] font-bold ${
                    promoMessage.error ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#7C4A3A] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2D1810]">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount ({appliedOffer?.code})</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-green-600">FREE</span>
                  ) : (
                    <span className="font-bold text-[#2D1810]">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#2D1810] pt-2 border-t border-[#EFE7DE]">
                  <span>Grand Total</span>
                  <span className="text-[#FF4B72]">₹{grandTotal}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white font-extrabold py-3 rounded-2xl shadow-lg shadow-[#FF4B72]/25 transition-all text-sm active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={`https://wa.me/919876543210?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#00B894] hover:bg-[#00A383] text-white font-bold py-2.5 rounded-2xl transition-all text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Instant Order on WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
