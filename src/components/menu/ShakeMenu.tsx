'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Star,
  Plus,
  SlidersHorizontal,
  Flame,
  Clock,
  Check,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { ShakeProduct, ShakeCategory } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockData';
import { useCart } from '@/context/CartContext';

const CATEGORIES: ('All' | ShakeCategory)[] = [
  'All',
  'Chocolate Shakes',
  'Oreo Shakes',
  'Strawberry Shakes',
  'Vanilla Shakes',
  'Mango Shakes',
  'Fruit Shakes',
  'Premium Thick Shakes',
  'Special Signature Shakes',
];

interface ShakeMenuProps {
  products?: ShakeProduct[];
}

export const ShakeMenu: React.FC<ShakeMenuProps> = ({ products = INITIAL_PRODUCTS }) => {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'All' | ShakeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'All' || prod.category === selectedCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleAddProduct = (product: ShakeProduct) => {
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
      isCustom: false,
      category: product.category,
      unitPrice: product.price,
    });

    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const scrollToCustomiser = () => {
    const el = document.getElementById('customiser');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="menu" className="py-20 bg-[#FCFBF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#FFCCD8] text-[#FF4B72] text-xs font-extrabold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Menu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2D1810] tracking-tight">
            OUR SHAKE COLLECTION
          </h2>
          <p className="text-base text-[#7C4A3A] font-medium leading-relaxed">
            Crafted with real fruit pulps, Belgian cocoa, and velvety dairy cream. Find your perfect chill from our 8 curated craft collections.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4 mb-10">
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by shake name, ingredient (e.g. Nutella, Oreo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#EFE7DE] rounded-full text-xs sm:text-sm text-[#2D1810] placeholder-gray-400 focus:outline-none focus:border-[#FF4B72] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3 text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FF4B72] text-white shadow-md shadow-[#FF4B72]/20'
                    : 'bg-white text-[#4A2E2B] hover:bg-[#FFF0F4] border border-[#EFE7DE]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#EFE7DE] p-8">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-bold text-[#2D1810] mt-3">No shakes found</h3>
            <p className="text-xs text-[#7C4A3A] mt-1">
              Try searching for something else or explore our other categories!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-bold text-[#FF4B72] hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isJustAdded = addedId === product.id;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#EFE7DE] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  {/* Image & Badges */}
                  <div className="relative h-60 w-full bg-[#FAF5EE] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {/* Tags Badge Top Left */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isSignature && (
                        <span className="px-2.5 py-1 bg-[#2D1810]/90 backdrop-blur-md text-[#FFD93D] text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Signature
                        </span>
                      )}
                      {product.isPopular && !product.isSignature && (
                        <span className="px-2.5 py-1 bg-[#FF4B72] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Prep Time & Calories Floating Pill */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#2D1810] shadow-sm flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-[#FF4B72]" />
                        {product.calories} kcal
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Rating & Category */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-bold text-[#FF4B72] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-[#2D1810] font-bold">
                          <Star className="w-3.5 h-3.5 text-[#FFD93D] fill-[#FFD93D]" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-extrabold text-[#2D1810] leading-snug group-hover:text-[#FF4B72] transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#7C4A3A] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Ingredients Preview */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {product.ingredients.slice(0, 3).map((ing, i) => (
                          <span
                            key={i}
                            className="bg-[#FCFBF7] text-[#4A2E2B] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#EFE7DE]"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-400">Price</span>
                        <span className="text-lg font-black text-[#2D1810]">₹{product.price}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Customise trigger */}
                        <button
                          onClick={scrollToCustomiser}
                          className="px-3 py-2 text-xs font-bold text-[#7C4A3A] hover:text-[#FF4B72] hover:bg-[#FFF0F4] rounded-xl transition-colors cursor-pointer"
                          title="Customise this shake"
                        >
                          Customise
                        </button>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => handleAddProduct(product)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                            isJustAdded
                              ? 'bg-green-600 text-white'
                              : 'bg-[#FF4B72] hover:bg-[#E6395D] text-white'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
