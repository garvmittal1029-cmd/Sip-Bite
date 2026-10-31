'use client';

import React from 'react';
import Image from 'next/image';
import { Crown, Sparkles, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface SignatureItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  ingredients: string[];
}

const SIGNATURE_ITEMS: SignatureItem[] = [
  {
    id: 'sig-1',
    name: 'Chocolate Overload',
    badge: 'Supreme Bestseller',
    description:
      'Molten dark Belgian fudge ganache, baked walnut brownie cubes, and crunchy chocolate pearls churned into thick cocoa cream.',
    price: 299,
    image: '/images/shakes/chocolate_overload.jpg',
    rating: 5.0,
    ingredients: ['70% Dark Belgian Chocolate', 'Baked Brownie Bites', 'Cocoa Ganache', 'Chocolate Pearls'],
  },
  {
    id: 'sig-2',
    name: 'Oreo Blast',
    badge: 'Fan Favourite',
    description:
      'Layers of crushed chocolate cookies and rich vanilla cream swirl, topped with a whipped cream tower and mini Oreos.',
    price: 279,
    image: '/images/shakes/oreo_blast.jpg',
    rating: 4.9,
    ingredients: ['Double Stuf Oreos', 'White Ganache', 'Whipped Cream', 'Cookie Crumble'],
  },
  {
    id: 'sig-3',
    name: 'Strawberry Dream',
    badge: 'Fresh Farm Berry',
    description:
      'Hand-picked Mahabaleshwar strawberries puréed fresh and swirled into chilled creamy milk with delicate white chocolate curls.',
    price: 209,
    image: '/images/shakes/strawberry_dream.jpg',
    rating: 4.9,
    ingredients: ['Fresh Strawberries', 'Pure Dairy Milk', 'Strawberry Coulis', 'White Choco Curls'],
  },
  {
    id: 'sig-4',
    name: 'Alphonso Mango Madness',
    badge: 'Royal Summer King',
    description:
      'Sun-ripened Ratnagiri Alphonso mango pulp whipped into silky vanilla milk, crowned with fresh mango cubes and pistachios.',
    price: 229,
    image: '/images/shakes/mango_madness.jpg',
    rating: 5.0,
    ingredients: ['Ratnagiri Alphonso Pulp', 'Vanilla Sweet Milk', 'Mango Chunks', 'Pistachios & Saffron'],
  },
  {
    id: 'sig-5',
    name: 'Nutella Delight',
    badge: 'Decadent Hazelnut',
    description:
      'Generous swirls of roasted Italian hazelnut Nutella, thick chocolate ganache rim, toasted hazelnuts, and warm brownie topper.',
    price: 289,
    image: '/images/shakes/nutella_delight.jpg',
    rating: 4.9,
    ingredients: ['Pure Nutella', 'Roasted Hazelnuts', 'Fudge Brownie', 'Vanilla Soft Serve'],
  },
  {
    id: 'sig-6',
    name: 'Brownie Fudge Shake',
    badge: 'Warm & Cold Bliss',
    description:
      'Freshly baked gooey chocolate fudge brownie blended with dark cocoa milk and laced with warm hot fudge sauce.',
    price: 289,
    image: '/images/shakes/hero_shake.jpg',
    rating: 4.8,
    ingredients: ['Walnut Brownie', 'Hot Fudge', 'Belgian Cocoa', 'Whipped Frosting'],
  },
];

export const SignatureShakes: React.FC = () => {
  const { addToCart } = useCart();

  return (
    <section id="signatures" className="py-24 bg-[#23120C] text-white relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF4B72]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FFD93D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#FFD93D] text-xs font-black tracking-widest uppercase">
              <Crown className="w-3.5 h-3.5" />
              <span>Chef Specialities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              SIGNATURE CREATIONS
            </h2>
            <p className="text-sm sm:text-base text-[#D6C4B5] font-medium leading-relaxed">
              Our crown jewels. Mastercrafted with premium imported chocolates, fresh farm berries, and signature recipe ratios that define Sip & Bite.
            </p>
          </div>

          <a
            href="#customiser"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#FF85A1] hover:text-white transition-colors"
          >
            <span>Or build your own recipe</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-[#2D1810] rounded-3xl border border-[#4A2E2B] overflow-hidden shadow-2xl hover:border-[#FF4B72]/50 transition-all duration-300 flex flex-col group hover:-translate-y-1.5"
            >
              {/* Product Visual */}
              <div className="relative h-72 w-full overflow-hidden bg-black/20">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1810] via-transparent to-transparent opacity-80" />

                {/* Badge Top Left */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#FF4B72] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                    {item.badge}
                  </span>
                </div>

                {/* Rating Top Right */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[#FFD93D] fill-[#FFD93D]" />
                  <span>{item.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Information */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white group-hover:text-[#FF85A1] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#D6C4B5] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="bg-white/5 text-[#EFE7DE] text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-white/10"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Add to Cart */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-[#B39E8F]">Price</span>
                    <span className="text-2xl font-black text-[#FFD93D]">₹{item.price}</span>
                  </div>

                  <button
                    onClick={() =>
                      addToCart({
                        productId: item.id,
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        quantity: 1,
                        isCustom: false,
                        unitPrice: item.price,
                      })
                    }
                    className="flex items-center gap-2 bg-[#FF4B72] hover:bg-[#E6395D] text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-lg shadow-[#FF4B72]/30 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
