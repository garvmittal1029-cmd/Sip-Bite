import { ShakeProduct, Order, SpecialOffer, CustomerEnquiry, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, SPECIAL_OFFERS } from '@/data/mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'sip_bite_products',
  ORDERS: 'sip_bite_orders',
  OFFERS: 'sip_bite_offers',
  ENQUIRIES: 'sip_bite_enquiries',
};

// Safe localStorage access
const getLocalItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocalItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

// --- PRODUCTS ---
export async function getProducts(): Promise<ShakeProduct[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        return data as ShakeProduct[];
      }
    } catch (e) {
      console.warn('Supabase product fetch failed, fallback to local:', e);
    }
  }
  return getLocalItem<ShakeProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export async function saveProduct(product: ShakeProduct): Promise<ShakeProduct> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').upsert(product).select().single();
      if (!error && data) return data as ShakeProduct;
    } catch (e) {
      console.warn('Supabase product upsert failed:', e);
    }
  }

  const current = getLocalItem<ShakeProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const existsIdx = current.findIndex((p) => p.id === product.id);
  let updated: ShakeProduct[];
  if (existsIdx >= 0) {
    updated = [...current];
    updated[existsIdx] = product;
  } else {
    updated = [product, ...current];
  }
  setLocalItem(STORAGE_KEYS.PRODUCTS, updated);
  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase product delete failed:', e);
    }
  }
  const current = getLocalItem<ShakeProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  setLocalItem(
    STORAGE_KEYS.PRODUCTS,
    current.filter((p) => p.id !== id)
  );
  return true;
}

// --- ORDERS ---
export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Order[];
      }
    } catch (e) {
      console.warn('Supabase order fetch failed, fallback to local:', e);
    }
  }
  return getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function saveOrder(order: Order): Promise<Order> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').insert(order).select().single();
      if (!error && data) return data as Order;
    } catch (e) {
      console.warn('Supabase order save failed:', e);
    }
  }

  const current = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const updated = [order, ...current];
  setLocalItem(STORAGE_KEYS.ORDERS, updated);
  return order;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').update({ orderStatus: status }).eq('id', orderId);
    } catch (e) {
      console.warn('Supabase order status update failed:', e);
    }
  }

  const current = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status } : ord));
  setLocalItem(STORAGE_KEYS.ORDERS, updated);
  return true;
}

// --- OFFERS ---
export async function getOffers(): Promise<SpecialOffer[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('offers').select('*');
      if (!error && data && data.length > 0) {
        return data as SpecialOffer[];
      }
    } catch (e) {
      console.warn('Supabase offers fetch failed:', e);
    }
  }
  return getLocalItem<SpecialOffer[]>(STORAGE_KEYS.OFFERS, SPECIAL_OFFERS);
}

export async function saveOffer(offer: SpecialOffer): Promise<SpecialOffer> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('offers').upsert(offer).select().single();
      if (!error && data) return data as SpecialOffer;
    } catch (e) {
      console.warn('Supabase offer upsert failed:', e);
    }
  }

  const current = getLocalItem<SpecialOffer[]>(STORAGE_KEYS.OFFERS, SPECIAL_OFFERS);
  const exists = current.findIndex((o) => o.id === offer.id);
  let updated: SpecialOffer[];
  if (exists >= 0) {
    updated = [...current];
    updated[exists] = offer;
  } else {
    updated = [offer, ...current];
  }
  setLocalItem(STORAGE_KEYS.OFFERS, updated);
  return offer;
}

export async function deleteOffer(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('offers').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase offer delete failed:', e);
    }
  }
  const current = getLocalItem<SpecialOffer[]>(STORAGE_KEYS.OFFERS, SPECIAL_OFFERS);
  setLocalItem(
    STORAGE_KEYS.OFFERS,
    current.filter((o) => o.id !== id)
  );
  return true;
}

// --- CUSTOMER ENQUIRIES ---
export async function getEnquiries(): Promise<CustomerEnquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('enquiries').select('*').order('createdAt', { ascending: false });
      if (!error && data && data.length > 0) return data as CustomerEnquiry[];
    } catch (e) {
      console.warn('Supabase enquiries fetch failed:', e);
    }
  }
  return getLocalItem<CustomerEnquiry[]>(STORAGE_KEYS.ENQUIRIES, [
    {
      id: 'enq-1',
      name: 'Priya Chawla',
      email: 'priya.c@example.com',
      phone: '+91 99887 76655',
      subject: 'Bulk order for Birthday Party',
      message: 'Looking for 35 customized mini shakes for a party this Saturday. Do you provide insulated catering boxes?',
      createdAt: '2026-10-30T10:15:00Z',
      status: 'new',
    },
  ]);
}

export async function saveEnquiry(enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>): Promise<CustomerEnquiry> {
  const newEnq: CustomerEnquiry = {
    ...enquiry,
    id: `enq-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'new',
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('enquiries').insert(newEnq).select().single();
      if (!error && data) return data as CustomerEnquiry;
    } catch (e) {
      console.warn('Supabase enquiry save failed:', e);
    }
  }

  const current = getLocalItem<CustomerEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  setLocalItem(STORAGE_KEYS.ENQUIRIES, [newEnq, ...current]);
  return newEnq;
}

export async function updateEnquiryStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase enquiry status update failed:', e);
    }
  }
  const current = getLocalItem<CustomerEnquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  setLocalItem(
    STORAGE_KEYS.ENQUIRIES,
    current.map((enq) => (enq.id === id ? { ...enq, status } : enq))
  );
  return true;
}
