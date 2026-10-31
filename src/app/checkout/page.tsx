'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Banknote,
  CheckCircle2,
  Lock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { saveOrder } from '@/lib/storage';
import { Order, PaymentMethod } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    appliedOffer,
    clearCart,
  } = useCart();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mumbai',
    pincode: '',
    instructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto my-auto text-center px-4 py-20">
          <div className="w-20 h-20 bg-[#FFF0F4] rounded-full mx-auto flex items-center justify-center text-4xl mb-4">
            🥤
          </div>
          <h2 className="text-2xl font-black text-[#2D1810]">Your bag is currently empty</h2>
          <p className="text-xs text-[#7C4A3A] mt-2 mb-6">
            Please add some delicious shakes to your bag before proceeding to checkout.
          </p>
          <Link
            href="/#menu"
            className="inline-flex items-center gap-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white px-6 py-3 rounded-full font-bold text-xs shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore Shakes Menu</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const validateForm = () => {
    if (!customer.name.trim()) return 'Please enter your name.';
    if (!customer.phone.trim() || customer.phone.length < 10)
      return 'Please enter a valid 10-digit mobile number.';
    if (!customer.email.trim() || !customer.email.includes('@'))
      return 'Please enter a valid email address.';
    if (!customer.address.trim()) return 'Please enter your delivery street address.';
    if (!customer.pincode.trim() || customer.pincode.length < 6)
      return 'Please enter a valid 6-digit PIN code.';
    return null;
  };

  const handleOrderSubmission = async (method: PaymentMethod, payStatus: 'paid' | 'pending' | 'cod') => {
    const orderId = `SB-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      customer,
      items,
      subtotal,
      deliveryFee,
      discount,
      promoCode: appliedOffer?.code,
      grandTotal,
      paymentMethod: method,
      paymentStatus: payStatus,
      orderStatus: 'Placed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: '30-40 mins',
    };

    await saveOrder(newOrder);

    // If WhatsApp method selected, open WhatsApp with order specs
    if (method === 'whatsapp') {
      let waMsg = `*🥤 SIP & BITE ORDER #${orderId}*\n\n`;
      waMsg += `*Customer:* ${customer.name} (${customer.phone})\n`;
      waMsg += `*Delivery Address:* ${customer.address}, ${customer.city} - ${customer.pincode}\n\n`;
      waMsg += `*Items Ordered:*\n`;
      items.forEach((item, idx) => {
        waMsg += `${idx + 1}. *${item.name}* x${item.quantity} (₹${item.totalPrice})\n`;
        if (item.isCustom && item.customDetails) {
          const c = item.customDetails;
          waMsg += `   [Base: ${c.base} | Flavor: ${c.flavor} | Size: ${c.size} | Sweetness: ${c.sweetness}]\n`;
          if (c.toppings.length > 0) {
            waMsg += `   Toppings: ${c.toppings.map((t) => t.name).join(', ')}\n`;
          }
        }
      });
      waMsg += `\n*Grand Total:* ₹${grandTotal} (Pay on Delivery or UPI)`;
      const waUrl = `https://wa.me/919876543210?text=${encodeURIComponent(waMsg)}`;
      window.open(waUrl, '_blank');
    }

    clearCart();
    router.push(`/order-success?id=${orderId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg('');

    if (paymentMethod === 'online') {
      setRazorpayModalOpen(true);
    } else {
      setIsProcessing(true);
      await handleOrderSubmission(
        paymentMethod,
        paymentMethod === 'cod' ? 'cod' : 'pending'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/#menu"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#7C4A3A] hover:text-[#FF4B72] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Ordering</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2D1810] mt-2">
            CHECKOUT & DELIVERY
          </h1>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: Customer Address & Payment Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DE] shadow-xs space-y-5">
              <h2 className="text-lg font-black text-[#2D1810] flex items-center gap-2">
                <span>1. Delivery Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="font-extrabold text-[#2D1810] block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Garvit Patel"
                    className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-[#2D1810] block mb-1">Mobile Number (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  />
                </div>
              </div>

              <div className="text-xs sm:text-sm">
                <label className="font-extrabold text-[#2D1810] block mb-1">Email Address (for Receipt) *</label>
                <input
                  type="email"
                  required
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div className="text-xs sm:text-sm">
                <label className="font-extrabold text-[#2D1810] block mb-1">Complete Street Address *</label>
                <textarea
                  required
                  rows={2}
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Flat/House number, building name, street, landmark"
                  className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="font-extrabold text-[#2D1810] block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-[#2D1810] block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={customer.pincode}
                    onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                    placeholder="e.g. 400076"
                    className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                  />
                </div>
              </div>

              <div className="text-xs sm:text-sm">
                <label className="font-extrabold text-[#2D1810] block mb-1">Delivery Instructions (Optional)</label>
                <input
                  type="text"
                  value={customer.instructions}
                  onChange={(e) => setCustomer({ ...customer, instructions: e.target.value })}
                  placeholder="e.g. Leave with security, extra cold, etc."
                  className="w-full px-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DE] shadow-xs space-y-4">
              <h2 className="text-lg font-black text-[#2D1810]">2. Select Payment Method</h2>

              <div className="space-y-3">
                {/* 1. Online Payment */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-[#FF4B72] bg-[#FFF8FA]'
                      : 'border-[#EFE7DE] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="text-[#FF4B72] focus:ring-[#FF4B72]"
                    />
                    <div>
                      <div className="text-sm font-extrabold text-[#2D1810] flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#FF4B72]" />
                        <span>Online Payment (UPI, Cards, Netbanking)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Secured via Razorpay gateway. Instant payment confirmation.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#00B894] bg-[#E8F8F5] px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </label>

                {/* 2. WhatsApp Instant Order */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'whatsapp'
                      ? 'border-[#00B894] bg-[#E8F8F5]'
                      : 'border-[#EFE7DE] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'whatsapp'}
                      onChange={() => setPaymentMethod('whatsapp')}
                      className="text-[#00B894] focus:ring-[#00B894]"
                    />
                    <div>
                      <div className="text-sm font-extrabold text-[#2D1810] flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-[#00B894]" />
                        <span>Order via WhatsApp Direct</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Generates order code & sends itemized recipe directly to our kitchen chat.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase text-[#00B894] bg-white px-2 py-0.5 rounded-full border border-[#00B894]/30">
                    Instant
                  </span>
                </label>

                {/* 3. Cash on Delivery */}
                <label
                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#2D1810] bg-gray-50'
                      : 'border-[#EFE7DE] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-[#2D1810] focus:ring-[#2D1810]"
                    />
                    <div>
                      <div className="text-sm font-extrabold text-[#2D1810] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#7C4A3A]" />
                        <span>Cash / UPI on Delivery</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Pay cash or scan QR when your chilled shake arrives.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DE] shadow-xs space-y-5">
              <h2 className="text-lg font-black text-[#2D1810] pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-bold text-[#FF4B72]">
                  {items.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border">
                      <Image
                        src={item.image || '/images/shakes/hero_shake.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between font-extrabold text-[#2D1810]">
                        <span className="truncate">{item.name}</span>
                        <span>₹{item.totalPrice}</span>
                      </div>
                      <div className="text-gray-400">
                        Qty: {item.quantity} × ₹{item.unitPrice}
                      </div>

                      {item.isCustom && item.customDetails && (
                        <div className="mt-1 text-[10px] text-[#7C4A3A] bg-[#FFFDF7] p-1.5 rounded-lg border border-[#F0E6D8]">
                          {item.customDetails.base} • {item.customDetails.flavor} •{' '}
                          {item.customDetails.size} • {item.customDetails.sweetness}
                          {item.customDetails.toppings.length > 0 && (
                            <div className="text-gray-500">
                              + {item.customDetails.toppings.map((t) => t.name).join(', ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-gray-100 space-y-2 text-xs sm:text-sm text-[#7C4A3A]">
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
                  <span>Delivery Charges</span>
                  {deliveryFee === 0 ? (
                    <span className="font-bold text-green-600">FREE</span>
                  ) : (
                    <span className="font-bold text-[#2D1810]">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-lg font-black text-[#2D1810] pt-2 border-t border-[#EFE7DE]">
                  <span>Total Payable</span>
                  <span className="text-[#FF4B72]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#FF4B72]/25 text-sm transition-all active:scale-98 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? 'Processing...'
                    : paymentMethod === 'whatsapp'
                    ? `Place WhatsApp Order (₹${grandTotal})`
                    : `Confirm & Pay ₹${grandTotal}`}
                </span>
              </button>

              <div className="text-center text-[11px] text-gray-400 font-medium">
                🔒 256-Bit SSL Encrypted & Food Grade Hygienic Delivery Guarantee
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Razorpay Gateway Simulation Modal */}
      {razorpayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-bold text-blue-300">
                  Razorpay Checkout
                </span>
                <h3 className="text-base font-extrabold text-white">Sip & Bite Beverages</h3>
              </div>
              <span className="text-lg font-black text-blue-400">₹{grandTotal}</span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                <span className="font-extrabold block">Secure Payment Gateway</span>
                <p className="text-[11px] text-blue-800">
                  Select your test payment outcome below to verify complete end-to-end database recording.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={async () => {
                    setRazorpayModalOpen(false);
                    setIsProcessing(true);
                    await handleOrderSubmission('online', 'paid');
                  }}
                  className="w-full py-3 bg-[#0C2340] hover:bg-[#183B6B] text-white font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span>Simulate Successful Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRazorpayModalOpen(false)}
                  className="w-full py-2.5 text-gray-500 hover:bg-gray-100 font-bold rounded-xl transition-colors"
                >
                  Cancel Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
