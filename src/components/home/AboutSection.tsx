'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, HeartHandshake, CheckCircle2, ShieldAlert, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      title: 'Real Farm Fruit Pulps',
      desc: 'No artificial powders or syrup shortcuts. We source Ratnagiri Alphonsos and Mahabaleshwar strawberries straight from certified farms.',
      icon: '🍓',
    },
    {
      title: 'Pure Dairy & Plant Bases',
      desc: 'Crafted with premium whole cream dairy, plus silky oat and almond plant milks for our vegan shake aficionados.',
      icon: '🥛',
    },
    {
      title: 'Infinite Customisation',
      desc: 'Your cravings define the recipe. Mix and match bases, sweetness tiers, and bakery-fresh toppings exactly how you like.',
      icon: '✨',
    },
    {
      title: 'Spill-Proof Chilled Transit',
      desc: 'Double-sealed thermo-insulated packaging keeps your shake ice-cold and velvety thick right up to your doorstep.',
      icon: '❄️',
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#FFFDF7] border-y border-[#EFE7DE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Split-screen Imagery Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                  <Image
                    src="/images/shakes/strawberry_dream.jpg"
                    alt="Fresh berries and cream"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 bg-[#2D1810] rounded-3xl text-white shadow-lg space-y-1">
                  <div className="text-3xl font-black text-[#FFD93D]">100%</div>
                  <div className="text-xs font-bold text-[#EFE7DE]">Natural Ingredients & No Synthetic Fillers</div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-6 bg-[#FF4B72] rounded-3xl text-white shadow-lg space-y-1">
                  <div className="text-3xl font-black text-white">4.9 ★</div>
                  <div className="text-xs font-bold text-white/90">Over 50k+ Shakes Served With Love</div>
                </div>
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                  <Image
                    src="/images/shakes/mango_madness.jpg"
                    alt="Alphonso Mango Shake"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Brand Story & Values */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#FFCCD8] text-[#FF4B72] text-xs font-extrabold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Philosophy</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2D1810] tracking-tight leading-tight">
                More Than Just a Shake.{' '}
                <span className="text-[#FF4B72]">It&apos;s Your Kind of Happiness.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#7C4A3A] font-medium leading-relaxed">
                At Sip & Bite, we believe a beverage shouldn&apos;t just quench your thirst—it should feel like a celebration. Born out of an obsession for authentic flavours, we set out to reinvent the traditional milkshake parlour into a vibrant, modern craft experience.
              </p>
            </div>

            {/* 4 Brand Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {pillars.map((p, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-[#EFE7DE] shadow-xs space-y-1.5 hover:border-[#FF4B72]/40 transition-colors"
                >
                  <div className="text-2xl">{p.icon}</div>
                  <h4 className="text-sm font-extrabold text-[#2D1810]">{p.title}</h4>
                  <p className="text-xs text-[#7C4A3A] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
