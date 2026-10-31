'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { getOrders, getOrderById } from '@/lib/storage';
import { Order, OrderStatus } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
  { status: 'Placed', label: 'Order Placed', desc: 'Received & sent to shake bar', icon: '📝' },
  { status: 'Preparing', label: 'Master Blending', desc: 'Crafting shakes with fresh ingredients', icon: '🥤' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Partner on the way in thermal pack', icon: '🛵' },
  { status: 'Delivered', label: 'Delivered', desc: 'Chilled & ready to enjoy!', icon: '✨' },
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [searchId, setSearchId] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [allRecentOrders, setAllRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load all recent orders on mount
  useEffect(() => {
    getOrders().then((orders) => {
      setAllRecentOrders(orders);
      if (initialId) {
        handleLookup(initialId, orders);
      } else if (orders.length > 0) {
        // Default to most recent order if available
        setActiveOrder(orders[0]);
        setSearchId(orders[0].id);
        setHasSearched(true);
      }
    });
  }, [initialId]);

  const handleLookup = (idToSearch: string, ordersPool = allRecentOrders) => {
    const query = idToSearch.trim();
    if (!query) {
      setErrorMessage('Please enter an Order ID or Phone number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setHasSearched(true);

    const match = ordersPool.find(
      (o) =>
        o.id.toLowerCase() === query.toLowerCase() ||
        o.customer.phone.includes(query)
    );

    if (match) {
      setActiveOrder(match);
      setSearchId(match.id);
    } else {
      setActiveOrder(null);
      setErrorMessage(`No order found matching "${query}". Please check your Order ID (e.g. SB-12345) or phone number.`);
    }

    setLoading(false);
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return 0;
      case 'Preparing':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = activeOrder ? getStepIndex(activeOrder.orderStatus) : 0;

  return (
    <div className="min-h-screen bg-[#FCFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#FFCCD8] text-[#FF4B72] text-xs font-extrabold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Shake Dispatch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#2D1810]">
            TRACK YOUR SIPS
          </h1>
          <p className="text-sm text-[#7C4A3A] font-medium max-w-md mx-auto">
            Check the real-time preparation and delivery progress of your handcrafted shakes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DE] shadow-sm space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(searchId);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. SB-25929) or Phone Number"
                className="w-full pl-12 pr-4 py-3 bg-[#F8F5F0] border border-[#EFE7DE] rounded-2xl text-xs sm:text-sm font-semibold text-[#2D1810] focus:outline-none focus:border-[#FF4B72] focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#FF4B72] hover:bg-[#E6395D] text-white px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Locating...' : 'Track Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Order Selection Chips */}
          {allRecentOrders.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400">Recent orders:</span>
              {allRecentOrders.slice(0, 4).map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => {
                    setSearchId(ord.id);
                    handleLookup(ord.id);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-bold border transition-colors cursor-pointer ${
                    activeOrder?.id === ord.id
                      ? 'bg-[#FF4B72] text-white border-[#FF4B72]'
                      : 'bg-[#F8F5F0] text-[#7C4A3A] border-[#EFE7DE] hover:border-[#FF4B72]'
                  }`}
                >
                  {ord.id} ({ord.orderStatus})
                </button>
              ))}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Active Order Card */}
        {activeOrder && (
          <div className="bg-white rounded-3xl border border-[#EFE7DE] shadow-xl overflow-hidden space-y-6">
            {/* Status Header Banner */}
            <div className="bg-gradient-to-r from-[#2D1810] to-[#4A2E2B] text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#FFCCD8] font-bold uppercase tracking-wider mb-1">
                  <span>Order Reference</span>
                  <span>•</span>
                  <span>{new Date(activeOrder.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black">{activeOrder.id}</h2>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] uppercase tracking-wider text-gray-300 font-bold block">
                  Current Status
                </span>
                <span className="inline-block bg-[#FF4B72] text-white font-extrabold px-3 py-1 rounded-full text-xs shadow-sm mt-1">
                  {activeOrder.orderStatus.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="px-6 sm:px-8 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.status}
                      className={`relative p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#FFF0F4] border-[#FF4B72] shadow-sm'
                          : isDone
                          ? 'bg-[#F2FAF6] border-[#00B894]/30'
                          : 'bg-gray-50 border-gray-100 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{step.icon}</span>
                        {isDone && (
                          <span className="ml-auto w-5 h-5 rounded-full bg-[#00B894] text-white text-[10px] font-bold flex items-center justify-center">
                            ✓
                          </span>
                        )}
                        {isCurrent && !isDone && (
                          <span className="ml-auto w-2 h-2 rounded-full bg-[#FF4B72] animate-ping" />
                        )}
                      </div>
                      <h4 className={`text-xs font-extrabold ${isCurrent ? 'text-[#FF4B72]' : 'text-[#2D1810]'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Destination & Meta Info */}
            <div className="px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#F8F5F0] p-4 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] block">
                  Delivery Destination
                </span>
                <p className="font-extrabold text-[#2D1810] text-sm">{activeOrder.customer.name}</p>
                <p className="text-[#7C4A3A]">
                  {activeOrder.customer.address}, {activeOrder.customer.city} - {activeOrder.customer.pincode}
                </p>
                <p className="text-[#7C4A3A]">Contact: {activeOrder.customer.phone}</p>
              </div>

              <div className="bg-[#F8F5F0] p-4 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px] block">
                  Payment & Delivery Estimate
                </span>
                <p className="font-extrabold text-[#2D1810]">
                  Method: {activeOrder.paymentMethod.toUpperCase()} ({activeOrder.paymentStatus})
                </p>
                <p className="text-[#7C4A3A]">
                  Estimated Dispatch: {activeOrder.estimatedDelivery || '25-35 minutes'}
                </p>
                <p className="text-[#00B894] font-bold">
                  ✓ Freshly packed in insulated thermal chill-box
                </p>
              </div>
            </div>

            {/* Itemized Order Items */}
            <div className="px-6 sm:px-8 space-y-3">
              <h3 className="text-sm font-extrabold text-[#2D1810] border-b border-gray-100 pb-2">
                Order Items ({activeOrder.items.length})
              </h3>
              <div className="divide-y divide-gray-100">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-[#2D1810]">
                        {item.quantity}x {item.name}
                      </div>
                      {item.isCustom && item.customDetails && (
                        <p className="text-[11px] text-gray-500">
                          {item.customDetails.base} • {item.customDetails.flavor} •{' '}
                          {item.customDetails.size} • {item.customDetails.sweetness}
                          {item.customDetails.toppings.length > 0 && (
                            <span className="block text-[#FF4B72]">
                              + {item.customDetails.toppings.map((t) => t.name).join(', ')}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <span className="font-extrabold text-[#2D1810]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="px-6 sm:px-8 pb-6 border-t border-gray-100 pt-4">
              <div className="max-w-xs ml-auto space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7C4A3A]">
                  <span>Subtotal</span>
                  <span>₹{activeOrder.subtotal}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-[#00B894] font-bold">
                    <span>Discount ({activeOrder.promoCode})</span>
                    <span>-₹{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#7C4A3A]">
                  <span>Delivery Fee</span>
                  <span>{activeOrder.deliveryFee === 0 ? 'FREE' : `₹${activeOrder.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#2D1810] pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span className="text-[#FF4B72]">₹{activeOrder.grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Support Action Buttons */}
            <div className="bg-[#F8F5F0] px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EFE7DE]">
              <a
                href={`https://wa.me/919876543210?text=Hi%20Sip%20%26%20Bite!%20I%20am%20checking%20the%20status%20of%20my%20order%20${activeOrder.id}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00B894] hover:bg-[#009E7E] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Store Support</span>
              </a>

              <Link
                href="/#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#2D1810] hover:bg-[#4A2E2B] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order More Shakes</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCFBF7] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-[#FF4B72] border-t-transparent animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
