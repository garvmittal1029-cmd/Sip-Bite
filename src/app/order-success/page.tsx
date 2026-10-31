'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  ShoppingBag,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';
import { getOrderById } from '@/lib/storage';
import { Order } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch confetti on page arrival
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4B72', '#FFD93D', '#2EC4B6', '#FFFDF7'],
    });

    if (orderId) {
      getOrderById(orderId).then((res) => {
        setOrder(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-[#FF4B72] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#7C4A3A]">Retrieving your delicious order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        {/* Header Success Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EFE7DE] shadow-xl text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#E8F8F5] text-[#00B894] flex items-center justify-center text-3xl mx-auto shadow-md">
            ✓
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF4B72]">
              Order Successfully Placed!
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#2D1810]">
              THANK YOU FOR SIPPING WITH US!
            </h1>
            <p className="text-xs sm:text-sm text-[#7C4A3A] font-medium max-w-md mx-auto">
              Our master blenders have fired up the churners. Your chilled shake is being crafted with fresh ingredients right now.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#FFF0F4] border border-[#FFCCD8] px-4 py-2 rounded-2xl text-xs font-extrabold text-[#FF4B72]">
            <span>Order Reference ID:</span>
            <span className="font-mono text-sm">{orderId || 'SB-CONFIRMED'}</span>
          </div>

          {/* Timeline tracker */}
          <div className="pt-6 border-t border-gray-100 max-w-xl mx-auto">
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-[#00B894] text-white flex items-center justify-center mx-auto font-bold">
                  ✓
                </div>
                <span className="font-extrabold text-[#2D1810] block">Placed</span>
                <span className="text-gray-400">Just now</span>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-[#FF4B72] text-white flex items-center justify-center mx-auto font-bold animate-pulse">
                  🥤
                </div>
                <span className="font-extrabold text-[#FF4B72] block">Blending</span>
                <span className="text-gray-400">In Progress</span>
              </div>

              <div className="space-y-1 opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto font-bold">
                  🛵
                </div>
                <span className="font-extrabold text-gray-600 block">Out for Delivery</span>
                <span className="text-gray-400">~20 mins</span>
              </div>

              <div className="space-y-1 opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto font-bold">
                  🏠
                </div>
                <span className="font-extrabold text-gray-600 block">Delivered</span>
                <span className="text-gray-400">Estimated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Receipt Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DE] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-lg font-black text-[#2D1810]">Itemized Receipt</h2>
              <button
                onClick={handlePrint}
                className="text-xs font-bold text-[#7C4A3A] hover:text-[#FF4B72] flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Bill</span>
              </button>
            </div>

            {/* Delivery To Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F8F5F0] p-4 rounded-2xl">
              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] block">Customer</span>
                <span className="font-extrabold text-[#2D1810] text-sm">{order.customer.name}</span>
                <span className="block text-[#7C4A3A]">{order.customer.phone}</span>
                <span className="block text-[#7C4A3A]">{order.customer.email}</span>
              </div>

              <div>
                <span className="text-gray-400 uppercase font-bold text-[10px] block">
                  Delivery Destination
                </span>
                <span className="font-semibold text-[#2D1810] block">
                  {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                </span>
                <span className="text-[11px] text-gray-500">
                  Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between text-xs py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-[#2D1810]">
                      {item.quantity}x {item.name}
                    </span>
                    {item.isCustom && item.customDetails && (
                      <p className="text-[10px] text-gray-500">
                        {item.customDetails.base} • {item.customDetails.flavor} •{' '}
                        {item.customDetails.size} • {item.customDetails.sweetness}
                        {item.customDetails.toppings.length > 0 && (
                          <span>
                            {' '}
                            (Toppings: {item.customDetails.toppings.map((t) => t.name).join(', ')})
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <span className="font-black text-[#2D1810]">₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="pt-4 border-t border-gray-100 space-y-1.5 text-xs text-[#7C4A3A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#2D1810]">₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-[#2D1810]">₹{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#2D1810] pt-2 border-t border-gray-100">
                <span>Grand Total Paid</span>
                <span className="text-[#FF4B72]">₹{order.grandTotal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/track?id=${orderId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white px-8 py-3.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all"
          >
            <Clock className="w-4 h-4 text-white" />
            <span>Track Live Dispatch</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2D1810] hover:bg-[#4A2E2B] text-white px-8 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-[#FFD93D]" />
            <span>Back to Sip & Bite Home</span>
          </Link>

          <a
            href={`https://wa.me/919876543210?text=Hi!%20Checking%20status%20for%20order%20%23${orderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00B894] hover:bg-[#00A383] text-white px-8 py-3.5 rounded-2xl font-extrabold text-xs shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Track on WhatsApp</span>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFBF7]" />}>
      <OrderSuccessContent />
    </Suspense>
  );
}
