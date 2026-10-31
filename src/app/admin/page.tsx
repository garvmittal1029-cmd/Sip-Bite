'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Shield,
  Lock,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingBag,
  Tag,
  Mail,
  Phone,
  Eye,
  LogOut,
  ArrowLeft,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  ShakeProduct,
  Order,
  SpecialOffer,
  CustomerEnquiry,
  OrderStatus,
  ShakeCategory,
} from '@/types';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  getOffers,
  saveOffer,
  deleteOffer,
  getEnquiries,
  updateEnquiryStatus,
} from '@/lib/storage';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'offers' | 'enquiries'>('orders');

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<ShakeProduct[]>([]);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Product modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShakeProduct | null>(null);
  const [productForm, setProductForm] = useState<Partial<ShakeProduct>>({
    name: '',
    category: 'Chocolate Shakes',
    price: 199,
    description: '',
    image: '/images/shakes/chocolate_overload.jpg',
    ingredients: ['Whole Milk', 'Cocoa Ganache'],
    calories: 400,
    prepTime: '4-5 mins',
    inStock: true,
  });

  // Offer modal
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: '',
    code: '',
    discountPercent: 15,
    minOrder: 299,
    description: '',
    badge: 'Special',
  });

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Load initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [o, p, off, enq] = await Promise.all([
        getOrders(),
        getProducts(),
        getOffers(),
        getEnquiries(),
      ]);
      setOrders(o);
      setProducts(p);
      setOffers(off);
      setEnquiries(enq);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: admin123 or sipbite
    if (adminPin === 'admin123' || adminPin === 'sipbite') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid Admin PIN. (Hint: use admin123)');
    }
  };

  // Orders Status Change
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  // Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const prodToSave: ShakeProduct = {
      id: editingProduct ? editingProduct.id : `sb-prod-${Date.now()}`,
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: (productForm.category as ShakeCategory) || 'Chocolate Shakes',
      description: productForm.description || 'Delicious handcrafted shake.',
      price: Number(productForm.price),
      image: productForm.image || '/images/shakes/hero_shake.jpg',
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      calories: Number(productForm.calories) || 380,
      prepTime: productForm.prepTime || '4 mins',
      inStock: productForm.inStock ?? true,
      ingredients: Array.isArray(productForm.ingredients)
        ? productForm.ingredients
        : ['Dairy Milk', 'Flavor Base'],
      tags: ['Fresh', 'Craft'],
    };

    await saveProduct(prodToSave);
    await loadData();
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  // Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this shake from the menu?')) {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Offer Save
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.title || !offerForm.code) return;

    const newOffer: SpecialOffer = {
      id: `off-${Date.now()}`,
      title: offerForm.title,
      code: offerForm.code.toUpperCase().trim(),
      discountPercent: Number(offerForm.discountPercent),
      minOrder: Number(offerForm.minOrder),
      description: offerForm.description,
      badge: offerForm.badge,
      active: true,
      validUntil: 'All Days',
    };

    await saveOffer(newOffer);
    await loadData();
    setOfferModalOpen(false);
    setOfferForm({
      title: '',
      code: '',
      discountPercent: 15,
      minOrder: 299,
      description: '',
      badge: 'Special',
    });
  };

  // Offer Delete
  const handleDeleteOffer = async (id: string) => {
    await deleteOffer(id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  // Enquiry status change
  const handleEnquiryStatus = async (id: string, status: 'read' | 'replied') => {
    await updateEnquiryStatus(id, status);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Placed' || o.orderStatus === 'Preparing').length;

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#EFE7DE] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#2D1810] text-[#FFD93D] flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-[#2D1810]">Admin Portal</h1>
            <p className="text-xs text-[#7C4A3A]">
              Sip & Bite Management & Kitchen Dashboard
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#2D1810] block mb-1">
                Enter Admin Security PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="Enter PIN (admin123)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl text-xs focus:outline-none focus:border-[#FF4B72]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#FF4B72] hover:bg-[#E6395D] text-white font-extrabold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Sign In to Dashboard
            </button>

            <button
              type="button"
              onClick={() => {
                setAdminPin('admin123');
                setIsAuthenticated(true);
              }}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Instant Demo Access (admin123)
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs font-bold text-[#7C4A3A] hover:text-[#FF4B72] inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2D1810]">
      {/* Top Navbar */}
      <header className="bg-[#2D1810] text-white py-4 px-6 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center p-1 shadow-sm">
              <Image
                src="/images/logo-cup.png"
                alt="Sip & Bite"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block">
                SIP & BITE ADMIN
              </span>
              <span className="text-[10px] text-gray-400 font-semibold block -mt-0.5">
                Kitchen Operations & Catalog Manager
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-[#EFE7DE] hover:text-white bg-white/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <span>View Storefront</span>
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs font-bold text-red-300 hover:text-white bg-red-500/20 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#EFE7DE] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold block">Gross Revenue</span>
              <span className="text-2xl font-black text-[#2D1810] mt-1 block">
                ₹{totalRevenue.toLocaleString()}
              </span>
              <span className="text-[10px] text-green-600 font-bold">● Live Orders</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5CC] text-[#B8860B] flex items-center justify-center text-xl font-bold">
              ₹
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EFE7DE] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold block">Total Orders</span>
              <span className="text-2xl font-black text-[#2D1810] mt-1 block">
                {orders.length}
              </span>
              <span className="text-[10px] text-blue-600 font-bold">
                {pendingOrders} Kitchen Active
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center text-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EFE7DE] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold block">Menu Catalog</span>
              <span className="text-2xl font-black text-[#2D1810] mt-1 block">
                {products.length} Shakes
              </span>
              <span className="text-[10px] text-green-600 font-bold">8 Categories</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#E8F8F5] text-[#00B894] flex items-center justify-center text-xl">
              🥤
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EFE7DE] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-gray-400 text-xs font-bold block">Customer Inquiries</span>
              <span className="text-2xl font-black text-[#2D1810] mt-1 block">
                {enquiries.length}
              </span>
              <span className="text-[10px] text-amber-600 font-bold">
                {enquiries.filter((e) => e.status === 'new').length} Unread
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#EFE7DE] gap-2 overflow-x-auto">
          {[
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Shakes Menu (${products.length})`, icon: Sparkles },
            { id: 'offers', label: `Offers & Coupons (${offers.length})`, icon: Tag },
            { id: 'enquiries', label: `Customer Enquiries (${enquiries.length})`, icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-5 border-b-2 font-extrabold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#FF4B72] text-[#FF4B72]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-black text-[#2D1810]">Live Orders Pipeline</h2>
              <div className="text-xs font-bold text-gray-500">
                Click any status badge to instantly update fulfillment stage
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EFE7DE] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-gray-400 font-bold uppercase text-[10px] border-b border-[#EFE7DE]">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items Ordered</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status & Action</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FFFDF7] transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-[#2D1810]">
                          {ord.id}
                          <span className="block text-[10px] text-gray-400 font-sans">
                            {new Date(ord.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-[#2D1810] block">{ord.customer.name}</span>
                          <span className="text-[11px] text-gray-500">{ord.customer.phone}</span>
                          <span className="text-[10px] text-gray-400 block truncate max-w-xs">
                            {ord.customer.address}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-[#2D1810]">
                            {ord.items.length} items (
                            {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')})
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-[#2D1810]">
                          ₹{ord.grandTotal}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              ord.paymentStatus === 'paid'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) =>
                              handleStatusChange(ord.id, e.target.value as OrderStatus)
                            }
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : ord.orderStatus === 'Out for Delivery'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : ord.orderStatus === 'Preparing'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 text-gray-400 hover:text-[#FF4B72] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="View recipe breakdown"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-black text-[#2D1810]">Shakes Catalog</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category: 'Chocolate Shakes',
                    price: 199,
                    description: '',
                    image: '/images/shakes/chocolate_overload.jpg',
                    ingredients: ['Whole Milk', 'Cocoa Ganache'],
                    calories: 400,
                    prepTime: '4-5 mins',
                    inStock: true,
                  });
                  setProductModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 bg-[#FF4B72] hover:bg-[#E6395D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Shake</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#EFE7DE] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-gray-400 font-bold uppercase text-[10px] border-b border-[#EFE7DE]">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (INR)</th>
                      <th className="py-3 px-4">Calories & Prep</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE7DE]">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FFFDF7] transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            <Image
                              src={prod.image || '/images/shakes/hero_shake.jpg'}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-extrabold text-[#2D1810] block">{prod.name}</span>
                            <span className="text-[10px] text-gray-400 line-clamp-1">
                              {prod.description}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#7C4A3A]">
                          {prod.category}
                        </td>
                        <td className="py-3 px-4 font-black text-[#2D1810]">₹{prod.price}</td>
                        <td className="py-3 px-4 text-gray-500">
                          {prod.calories} kcal • {prod.prepTime}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.inStock
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {prod.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setProductForm(prod);
                              setProductModalOpen(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                            title="Edit shake"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                            title="Delete shake"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OFFERS & PROMO CODES */}
        {activeTab === 'offers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-[#2D1810]">Promotions & Coupon Codes</h2>
              <button
                onClick={() => setOfferModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#FF4B72] hover:bg-[#E6395D] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Offer Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offers.map((off) => (
                <div
                  key={off.id}
                  className="bg-white p-5 rounded-3xl border border-[#EFE7DE] shadow-xs space-y-3 relative"
                >
                  <button
                    onClick={() => handleDeleteOffer(off.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFF0F4] text-[#FF4B72]">
                    {off.badge}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#2D1810]">{off.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{off.description}</p>
                  </div>
                  <div className="p-2.5 bg-[#F8F5F0] rounded-xl flex items-center justify-between font-mono font-bold text-xs text-[#2D1810]">
                    <span>{off.code}</span>
                    <span className="text-[#FF4B72]">
                      {off.discountPercent > 0 ? `${off.discountPercent}% OFF` : 'FREE SHIP'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-[#2D1810]">Customer Enquiries & Catering Requests</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="bg-white p-5 rounded-3xl border border-[#EFE7DE] shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#2D1810]">{enq.name}</h3>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {enq.email} • {enq.phone}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.status === 'new'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {enq.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8F5F0] rounded-2xl text-xs text-[#4A2E2B] leading-relaxed">
                    <span className="font-bold block text-[#2D1810] mb-1">{enq.subject}</span>
                    {enq.message}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${enq.email}?subject=Reply to your Sip and Bite Inquiry`}
                        className="text-xs font-bold text-[#FF4B72] hover:underline"
                      >
                        Reply Email
                      </a>
                      {enq.phone && (
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#00B894] hover:underline"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Add / Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#EFE7DE]">
            <h3 className="text-lg font-black text-[#2D1810]">
              {editingProduct ? 'Edit Shake Product' : 'Add New Shake'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Shake Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Belgian Dark Truffle"
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2D1810] block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category: e.target.value as ShakeCategory,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  >
                    <option value="Chocolate Shakes">Chocolate Shakes</option>
                    <option value="Oreo Shakes">Oreo Shakes</option>
                    <option value="Strawberry Shakes">Strawberry Shakes</option>
                    <option value="Vanilla Shakes">Vanilla Shakes</option>
                    <option value="Mango Shakes">Mango Shakes</option>
                    <option value="Fruit Shakes">Fruit Shakes</option>
                    <option value="Premium Thick Shakes">Premium Thick Shakes</option>
                    <option value="Special Signature Shakes">Special Signature Shakes</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#2D1810] block mb-1">Price in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Image URL</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="/images/shakes/chocolate_overload.jpg"
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                  className="text-[#FF4B72] rounded"
                />
                <label htmlFor="inStockCheck" className="font-bold text-[#2D1810]">
                  Available in Stock
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white font-extrabold rounded-xl shadow-md"
                >
                  Save Shake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Offer Create Modal */}
      {offerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-[#EFE7DE]">
            <h3 className="text-lg font-black text-[#2D1810]">Create Promotion Code</h3>

            <form onSubmit={handleSaveOffer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Craving Pass"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2D1810] block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STUDENT20"
                    value={offerForm.code}
                    onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl uppercase font-mono font-bold focus:outline-none focus:border-[#FF4B72]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#2D1810] block mb-1">Discount %</label>
                  <input
                    type="number"
                    value={offerForm.discountPercent}
                    onChange={(e) => setOfferForm({ ...offerForm, discountPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Minimum Order (INR)</label>
                <input
                  type="number"
                  value={offerForm.minOrder}
                  onChange={(e) => setOfferForm({ ...offerForm, minOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOfferModalOpen(false)}
                  className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white font-extrabold rounded-xl shadow-md"
                >
                  Create Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-[#EFE7DE]">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Order Details</span>
                <h3 className="text-lg font-black text-[#2D1810]">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#F8F5F0] p-3 rounded-2xl space-y-1">
                <div className="font-bold text-[#2D1810]">{selectedOrder.customer.name}</div>
                <div className="text-gray-500">{selectedOrder.customer.phone} • {selectedOrder.customer.email}</div>
                <div className="text-[#4A2E2B]">{selectedOrder.customer.address}, {selectedOrder.customer.city}</div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                <span className="font-bold text-[#2D1810] block">Ordered Shakes:</span>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-[#EFE7DE] rounded-xl space-y-1">
                    <div className="flex justify-between font-bold text-[#2D1810]">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.totalPrice}</span>
                    </div>
                    {item.isCustom && item.customDetails && (
                      <div className="text-[11px] text-[#7C4A3A] bg-[#FFF8FA] p-1.5 rounded-lg border border-[#FFCCD8]">
                        <span className="font-bold">Custom Recipe:</span> {item.customDetails.base} |{' '}
                        {item.customDetails.flavor} | {item.customDetails.size} |{' '}
                        {item.customDetails.sweetness}
                        {item.customDetails.toppings.length > 0 && (
                          <div className="text-gray-600 mt-0.5">
                            Toppings: {item.customDetails.toppings.map((t) => t.name).join(', ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-black text-[#2D1810]">
                <span>Grand Total:</span>
                <span className="text-[#FF4B72]">₹{selectedOrder.grandTotal}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#2D1810] text-white font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
