'use client';

import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SPECIAL_OFFERS } from '@/data/mockData';

export const OffersSection: React.FC = () => {
  const { applyPromoCode, openCart } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleApply = (code: string) => {
    applyPromoCode(code);
    setCopiedCode(code);
    openCart();
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-20 bg-[#FCFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5CC] border border-[#FFE680] text-[#B8860B] text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Craving Perks</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2D1810] tracking-tight">
            SPECIAL OFFERS & DEALS
          </h2>
          <p className="text-sm sm:text-base text-[#7C4A3A] font-medium leading-relaxed">
            More sips for less. Grab exclusive welcome codes, party combos, and student perks on your favorite shakes.
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIAL_OFFERS.map((offer) => {
            const isCopied = copiedCode === offer.code;
            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-[#EFE7DE] p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1"
              >
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#FFF0F4] text-[#FF4B72] text-[10px] font-black uppercase tracking-wider rounded-full border border-[#FFCCD8]">
                    {offer.badge}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">{offer.validUntil}</span>
                </div>

                {/* Offer Details */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-lg font-black text-[#2D1810] leading-snug group-hover:text-[#FF4B72] transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-[#7C4A3A] leading-relaxed">
                    {offer.description}
                  </p>
                  <div className="text-[11px] font-bold text-gray-400">
                    Min order: ₹{offer.minOrder}
                  </div>
                </div>

                {/* Promo Code Box & Action */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between bg-[#F8F5F0] px-3 py-2 rounded-xl border border-dashed border-[#FF4B72]/40">
                    <span className="font-mono font-black text-sm text-[#2D1810] tracking-wider">
                      {offer.code}
                    </span>
                    <span className="text-[10px] font-bold text-[#FF4B72] uppercase">
                      {offer.discountPercent > 0 ? `${offer.discountPercent}% OFF` : 'FREE'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleApply(offer.code)}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#2D1810] hover:bg-[#FF4B72] text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-400" />
                        <span>Applied to Bag!</span>
                      </>
                    ) : (
                      <>
                        <Tag className="w-3.5 h-3.5" />
                        <span>Apply & Open Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
