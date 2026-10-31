'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Star, ShieldCheck, Heart, Flame } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden bg-gradient-to-b from-[#FFFDF7] via-[#FFF8EE] to-[#FCFBF7]">
      {/* Decorative background glows */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#FFE0E8]/50 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FFF5CC]/60 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Bold Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EFE7DE] shadow-xs text-xs font-black uppercase tracking-wider text-[#FF4B72]">
              <span className="w-2 h-2 rounded-full bg-[#FF4B72] animate-ping" />
              <span>India&apos;s Favourite Custom Shake Bar</span>
              <span className="text-[#FFD93D]">★ 4.9</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-[#2D1810] tracking-tight leading-[1.08]">
                SIP. SHAKE.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B72] via-[#FF85A1] to-[#FF4B72]">
                  REPEAT.
                </span>
              </h1>
              <p className="text-xs sm:text-sm uppercase font-extrabold tracking-widest text-[#7C4A3A]">
                Your Cravings, Your Shake.
              </p>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#7C4A3A] font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              From rich chocolate cravings to refreshing fruity blends, discover shakes made to match your taste. Handcrafted daily with 100% natural pulps & pure cream.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#FF4B72] hover:bg-[#E6395D] text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-[#FF4B72]/25 hover:shadow-2xl hover:shadow-[#FF4B72]/40 transition-all duration-300 text-sm active:scale-95 cursor-pointer"
              >
                <span>Explore Our Shakes</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#customiser"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FFF0F4] text-[#2D1810] hover:text-[#FF4B72] font-extrabold px-8 py-4 rounded-2xl border-2 border-[#EFE7DE] hover:border-[#FF4B72]/40 transition-all duration-300 text-sm shadow-xs active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF4B72]" />
                <span>Customise Your Shake</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#EFE7DE] flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#7C4A3A] font-bold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#00B894]" />
                <span>100% Real Dairy & Plant Bases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FF4B72]" />
                <span>No Artificial Syrups</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#FF85A1]" />
                <span>50,000+ Shakes Blended</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Glass Card */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
              {/* Outer decorative halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFCCD8] to-[#FFF0B3] rounded-[48px] transform rotate-3 shadow-2xl opacity-70 animate-pulse-slow" />

              {/* Main Card with Hero Photography */}
              <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-white border-4 border-white shadow-2xl transform hover:-rotate-1 transition-transform duration-500">
                <Image
                  src="/images/shakes/hero_shake.jpg"
                  alt="Sip & Bite Artisan Milkshake"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />

                {/* Glass Floating Stat Badges */}
                {/* 1. Customer Rating Top Right */}
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/60 flex items-center gap-2 animate-float">
                  <div className="w-8 h-8 rounded-full bg-[#FFF5CC] flex items-center justify-center text-[#B8860B] font-black text-sm">
                    ★
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#2D1810]">4.9 / 5.0</div>
                    <div className="text-[10px] text-gray-500 font-bold">3,500+ Reviews</div>
                  </div>
                </div>

                {/* 2. Chef's Daily Special Floating Bottom Left */}
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-[#2D1810]/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/10 text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF4B72] flex items-center justify-center text-xl shrink-0">
                    🍓
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase text-[#FF85A1] tracking-wider">
                      Signature Creation
                    </div>
                    <div className="text-sm font-black truncate text-white">
                      Triple Berry Choco Swirl
                    </div>
                    <div className="text-[11px] text-[#FFD93D] font-bold">₹249 only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
