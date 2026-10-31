'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Check,
  Plus,
  ShoppingBag,
  RotateCcw,
  Info,
  Flame,
} from 'lucide-react';
import {
  MilkBase,
  ShakeFlavor,
  ShakeSize,
  SweetnessLevel,
  ToppingOption,
  CustomShakeConfig,
} from '@/types';
import {
  MILK_BASES,
  FLAVORS,
  SIZES,
  TOPPINGS,
  SWEETNESS_LEVELS,
} from '@/data/mockData';
import { useCart } from '@/context/CartContext';

export const ShakeCustomiser: React.FC = () => {
  const { addToCart } = useCart();

  // Selection states
  const [selectedBase, setSelectedBase] = useState<MilkBase>('Full Cream Milk');
  const [selectedFlavor, setSelectedFlavor] = useState<ShakeFlavor>('Chocolate');
  const [selectedSize, setSelectedSize] = useState<ShakeSize>('Regular');
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([
    TOPPINGS[0], // Oreo crumbs
    TOPPINGS[2], // Whipped cream
  ]);
  const [selectedSweetness, setSelectedSweetness] = useState<SweetnessLevel>('Medium');
  const [customShakeName, setCustomShakeName] = useState('');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);

  // Lookup data objects
  const baseObj = MILK_BASES.find((b) => b.name === selectedBase) || MILK_BASES[0];
  const flavorObj = FLAVORS.find((f) => f.name === selectedFlavor) || FLAVORS[0];
  const sizeObj = SIZES.find((s) => s.name === selectedSize) || SIZES[0];

  // Price Calculation:
  // Base cost = size base price + milk base add-on + flavor price
  // Toppings = sum of toppings
  // Total = (Base Price + Flavor Price + Toppings Total) * sizeMultiplier or direct formula
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const calculatedPrice = Math.round(
    sizeObj.priceAdd + baseObj.price + flavorObj.price + toppingsTotal
  );

  const toggleTopping = (topping: ToppingOption) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleReset = () => {
    setSelectedBase('Full Cream Milk');
    setSelectedFlavor('Chocolate');
    setSelectedSize('Regular');
    setSelectedToppings([TOPPINGS[0], TOPPINGS[2]]);
    setSelectedSweetness('Medium');
    setCustomShakeName('');
    setActiveStep(1);
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF4B72', '#FFD93D', '#2EC4B6', '#FFFDF7'],
    });

    const config: CustomShakeConfig = {
      base: selectedBase,
      basePrice: baseObj.price,
      flavor: selectedFlavor,
      flavorPrice: flavorObj.price,
      size: selectedSize,
      sizeMultiplier: sizeObj.multiplier,
      toppings: selectedToppings,
      sweetness: selectedSweetness,
      calculatedPrice,
      customName: customShakeName.trim() || `Custom ${selectedFlavor} Creation`,
    };

    addToCart({
      name: config.customName || `Custom ${selectedFlavor} Shake`,
      image:
        selectedFlavor === 'Strawberry'
          ? '/images/shakes/strawberry_dream.jpg'
          : selectedFlavor === 'Mango'
          ? '/images/shakes/mango_madness.jpg'
          : selectedFlavor === 'Oreo'
          ? '/images/shakes/oreo_blast.jpg'
          : selectedFlavor === 'Chocolate'
          ? '/images/shakes/chocolate_overload.jpg'
          : '/images/shakes/hero_shake.jpg',
      price: calculatedPrice,
      quantity: 1,
      isCustom: true,
      customDetails: config,
      unitPrice: calculatedPrice,
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const hasWhippedCream = selectedToppings.some((t) => t.name === 'Whipped Cream');

  return (
    <section id="customiser" className="py-20 bg-gradient-to-b from-[#FFFDF7] to-[#FDF7ED] relative">
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#FFE0E8]/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#FFF5CC]/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF0F4] border border-[#FFCCD8] text-[#FF4B72] text-xs font-extrabold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Shake Lab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2D1810] tracking-tight">
            BUILD YOUR OWN SHAKE
          </h2>
          <p className="text-base text-[#7C4A3A] font-medium leading-relaxed">
            Unleash your inner milkshake artist. Pick your dairy or plant base, blend your favourite flavours, select your size, and crown it with gourmet toppings.
          </p>
        </div>

        {/* Customiser Layout: Left Cup Simulator + Right Step Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Live Interactive Cup Simulator */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE7DE] shadow-xl relative overflow-hidden flex flex-col items-center">
              {/* Reset button top-right */}
              <button
                onClick={handleReset}
                className="absolute top-5 right-5 text-xs text-gray-400 hover:text-[#FF4B72] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                title="Reset to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* Live Cup Canvas Representation */}
              <div className="w-full flex justify-center py-6">
                <div
                  className="relative transition-all duration-500 ease-out flex flex-col items-center"
                  style={{
                    height:
                      selectedSize === 'Regular'
                        ? '300px'
                        : selectedSize === 'Large'
                        ? '330px'
                        : '360px',
                    width: '180px',
                  }}
                >
                  {/* Straw */}
                  <div className="absolute -top-12 right-12 w-4 h-36 bg-gradient-to-b from-[#FF4B72] via-[#FFFDF7] to-[#FF4B72] rounded-full transform rotate-12 shadow-md z-30 border border-white/60" />

                  {/* Whipped Cream Top if selected */}
                  {hasWhippedCream && (
                    <div className="absolute -top-8 w-32 h-14 bg-gradient-to-b from-white to-[#FFF9F2] rounded-t-full shadow-md z-20 flex items-center justify-center border-t-2 border-white animate-in zoom-in-75 duration-300">
                      <div className="w-full text-center text-xs">
                        <span className="text-base">☁️</span>
                        {selectedToppings.some((t) => t.name === 'Chocolate Syrup') && (
                          <div className="absolute inset-x-2 top-2 h-1 bg-[#4A2E2B] rounded-full opacity-70" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cup Body Container */}
                  <div
                    className="w-full h-full rounded-b-[40px] rounded-t-xl overflow-hidden shadow-2xl relative border-4 border-white/80 backdrop-blur-sm flex flex-col justify-end"
                    style={{
                      background: 'rgba(255, 255, 255, 0.4)',
                    }}
                  >
                    {/* Shake Liquid Layer */}
                    <div
                      className="w-full transition-all duration-700 ease-out relative"
                      style={{
                        height:
                          selectedSize === 'Regular'
                            ? '82%'
                            : selectedSize === 'Large'
                            ? '88%'
                            : '94%',
                        backgroundColor: flavorObj.hex,
                      }}
                    >
                      {/* Swirl Effect */}
                      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-black/30 pointer-events-none" />

                      {/* Glass Frost Reflection */}
                      <div className="absolute top-0 bottom-0 left-3 w-3 bg-white/30 rounded-full blur-[1px]" />
                      <div className="absolute top-0 bottom-0 right-4 w-1.5 bg-white/20 rounded-full" />

                      {/* Dynamic Toppings Chips inside liquid */}
                      {selectedToppings.map((top, idx) => (
                        <div
                          key={top.id}
                          className="absolute text-sm animate-pulse"
                          style={{
                            top: `${15 + idx * 12}%`,
                            left: `${20 + (idx * 27) % 60}%`,
                          }}
                        >
                          {top.icon}
                        </div>
                      ))}

                      {/* Sip & Bite Cup Logo Badge */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/60 text-center pointer-events-none">
                        <span className="font-extrabold text-[10px] text-[#2D1810] tracking-tight block">
                          SIP & BITE
                        </span>
                        <span className="text-[8px] font-bold text-[#FF4B72] tracking-widest uppercase">
                          {selectedSize}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Order Summary Specs */}
              <div className="w-full mt-4 p-4 bg-[#FFFDF7] rounded-2xl border border-[#F0E6D8] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#2D1810] font-extrabold pb-2 border-b border-gray-100">
                  <span className="text-sm">Live Recipe Summary</span>
                  <span className="text-[#FF4B72] text-lg font-black">₹{calculatedPrice}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[#4A2E2B] pt-1">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Base</span>
                    <span className="font-semibold">{selectedBase}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Flavour</span>
                    <span className="font-semibold text-[#FF4B72]">{selectedFlavor}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Size</span>
                    <span className="font-semibold">{selectedSize} ({sizeObj.ml})</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Sweetness</span>
                    <span className="font-semibold">{selectedSweetness}</span>
                  </div>
                </div>

                {selectedToppings.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-gray-400 block text-[10px] font-bold uppercase mb-1">
                      Toppings ({selectedToppings.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedToppings.map((t) => (
                        <span
                          key={t.id}
                          className="bg-white border border-[#EFE7DE] px-2 py-0.5 rounded-md font-semibold text-[#2D1810]"
                        >
                          {t.icon} {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Add Custom Shake to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                id="add-custom-shake-btn"
                className="w-full mt-5 bg-[#FF4B72] hover:bg-[#E6395D] text-white py-3.5 px-6 rounded-2xl font-extrabold text-sm shadow-xl shadow-[#FF4B72]/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add This Custom Shake (₹{calculatedPrice})</span>
              </button>
            </div>
          </div>

          {/* RIGHT: 5 Step Customiser Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {[
                { step: 1, label: '1. Base' },
                { step: 2, label: '2. Flavour' },
                { step: 3, label: '3. Size' },
                { step: 4, label: '4. Toppings' },
                { step: 5, label: '5. Sweetness' },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    activeStep === s.step
                      ? 'bg-[#2D1810] text-white shadow-md'
                      : 'bg-white text-[#7C4A3A] hover:bg-[#FFF0F4] border border-[#EFE7DE]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* STEP 1: Choose Your Base */}
            <div
              className={`bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-sm transition-all ${
                activeStep === 1 ? 'ring-2 ring-[#FF4B72]/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <h3 className="text-lg font-black text-[#2D1810]">Choose Your Base</h3>
                </div>
                <span className="text-xs font-bold text-[#7C4A3A]">{selectedBase}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MILK_BASES.map((base) => {
                  const isSelected = selectedBase === base.name;
                  return (
                    <button
                      key={base.name}
                      onClick={() => {
                        setSelectedBase(base.name);
                        setActiveStep(2);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                        isSelected
                          ? 'border-[#FF4B72] bg-[#FFF8FA] shadow-xs'
                          : 'border-[#EFE7DE] bg-white hover:border-[#FF4B72]/40 hover:bg-[#FCFBF7]'
                      }`}
                    >
                      <span className="text-2xl">{base.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-extrabold text-[#2D1810]">{base.name}</h4>
                          <span className="text-xs font-bold text-[#FF4B72]">
                            {base.price === 0 ? 'Included' : `+₹${base.price}`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{base.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#FF4B72] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Choose Your Flavour */}
            <div
              className={`bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-sm transition-all ${
                activeStep === 2 ? 'ring-2 ring-[#FF4B72]/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <h3 className="text-lg font-black text-[#2D1810]">Choose Your Flavour</h3>
                </div>
                <span className="text-xs font-bold text-[#FF4B72]">{selectedFlavor}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FLAVORS.map((flav) => {
                  const isSelected = selectedFlavor === flav.name;
                  return (
                    <button
                      key={flav.name}
                      onClick={() => {
                        setSelectedFlavor(flav.name);
                        setActiveStep(3);
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 relative ${
                        isSelected
                          ? 'border-[#FF4B72] bg-[#FFF8FA] shadow-xs'
                          : 'border-[#EFE7DE] bg-white hover:border-[#FF4B72]/40'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full shadow-inner flex items-center justify-center border-2 border-white"
                        style={{ backgroundColor: flav.hex }}
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-[#2D1810]">{flav.name}</h4>
                        <span className="text-[11px] font-bold text-[#7C4A3A]">₹{flav.price}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF4B72] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: Choose Your Size */}
            <div
              className={`bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-sm transition-all ${
                activeStep === 3 ? 'ring-2 ring-[#FF4B72]/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <h3 className="text-lg font-black text-[#2D1810]">Choose Your Size</h3>
                </div>
                <span className="text-xs font-bold text-[#2D1810]">{selectedSize} ({sizeObj.ml})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size.name;
                  return (
                    <button
                      key={size.name}
                      onClick={() => {
                        setSelectedSize(size.name);
                        setActiveStep(4);
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 relative ${
                        isSelected
                          ? 'border-[#FF4B72] bg-[#FFF8FA] shadow-xs'
                          : 'border-[#EFE7DE] bg-white hover:border-[#FF4B72]/40'
                      }`}
                    >
                      <span className="text-2xl">
                        {size.name === 'Regular' ? '🥤' : size.name === 'Large' ? '🧋' : '👑'}
                      </span>
                      <h4 className="text-sm font-extrabold text-[#2D1810]">{size.name}</h4>
                      <span className="text-xs text-gray-500 font-medium">{size.ml}</span>
                      <span className="text-xs font-black text-[#FF4B72] mt-1">₹{size.priceAdd}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#FF4B72] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: Add Toppings */}
            <div
              className={`bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-sm transition-all ${
                activeStep === 4 ? 'ring-2 ring-[#FF4B72]/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center text-xs font-black">
                    4
                  </span>
                  <h3 className="text-lg font-black text-[#2D1810]">Add Gourmet Toppings</h3>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {selectedToppings.length} selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TOPPINGS.map((top) => {
                  const isSelected = selectedToppings.some((t) => t.id === top.id);
                  return (
                    <button
                      key={top.id}
                      onClick={() => toggleTopping(top)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FF4B72] bg-[#FFF8FA]'
                          : 'border-[#EFE7DE] bg-white hover:border-[#FF4B72]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{top.icon}</span>
                        <div>
                          <div className="text-xs font-extrabold text-[#2D1810]">{top.name}</div>
                          <div className="text-[11px] font-bold text-[#FF4B72]">+₹{top.price}</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          isSelected
                            ? 'bg-[#FF4B72] text-white'
                            : 'border border-gray-300 text-gray-400'
                        }`}
                      >
                        {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: Sweetness Level & Custom Name */}
            <div
              className={`bg-white rounded-3xl p-6 sm:p-7 border border-[#EFE7DE] shadow-sm transition-all ${
                activeStep === 5 ? 'ring-2 ring-[#FF4B72]/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center text-xs font-black">
                    5
                  </span>
                  <h3 className="text-lg font-black text-[#2D1810]">Sweetness & Personal Touch</h3>
                </div>
                <span className="text-xs font-bold text-[#2D1810]">{selectedSweetness}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {SWEETNESS_LEVELS.map((lvl) => {
                  const isSelected = selectedSweetness === lvl.name;
                  return (
                    <button
                      key={lvl.name}
                      onClick={() => setSelectedSweetness(lvl.name)}
                      className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-[#FF4B72] bg-[#FFF8FA]'
                          : 'border-[#EFE7DE] bg-white hover:border-[#FF4B72]/40'
                      }`}
                    >
                      <span className="text-xl">{lvl.icon}</span>
                      <span className="text-xs font-extrabold text-[#2D1810]">{lvl.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Personal Shake Name Input */}
              <div className="pt-3 border-t border-gray-100">
                <label className="text-xs font-bold text-[#2D1810] block mb-1">
                  Name Your Shake Creation (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Garvit's Midnight Fuel or Summer Berry Crush"
                  value={customShakeName}
                  onChange={(e) => setCustomShakeName(e.target.value)}
                  className="w-full text-xs px-4 py-2.5 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
