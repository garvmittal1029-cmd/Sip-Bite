'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Sparkles, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const Navbar: React.FC = () => {
  const { totalCount, grandTotal, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Menu', href: '/#menu' },
    { name: 'Build Your Own', href: '/#customiser', highlight: true },
    { name: 'Signatures', href: '/#signatures' },
    { name: 'Offers', href: '/#offers' },
    { name: 'Track Order', href: '/track' },
    { name: 'About', href: '/#about' },
    { name: 'Reviews', href: '/#reviews' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-sm py-3 border-b border-[#F0E6D8]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center group py-0.5">
              <div className="relative h-11 sm:h-12 w-auto flex items-center">
                <Image
                  src="/images/logo.png"
                  alt="Sip & Bite — Your Cravings, Your Shake"
                  width={155}
                  height={74}
                  priority
                  className="h-10 sm:h-11 w-auto object-contain transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#EFE7DE] shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
                    link.highlight
                      ? 'bg-[#FF4B72] text-white hover:bg-[#E6395D] shadow-sm'
                      : 'text-[#4A2E2B] hover:text-[#FF4B72] hover:bg-[#FFF0F4]'
                  }`}
                >
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 inline mr-1" />}
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp Quick Order Callout */}
              <a
                href="https://wa.me/919876543210?text=Hi%20Sip%20%26%20Bite!%20I%20would%20like%20to%20order%20shakes."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#00B894] bg-[#E8F8F5] hover:bg-[#D0F2EB] px-3 py-2 rounded-full border border-[#B3EBDC] transition-colors"
                title="Direct WhatsApp Order"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Quick WhatsApp</span>
              </a>

              {/* Admin Portal Link */}
              <Link
                href="/admin"
                className="p-2 text-[#7C4A3A] hover:text-[#2D1810] hover:bg-black/5 rounded-full transition-colors"
                title="Admin Dashboard"
              >
                <Shield className="w-5 h-5" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={openCart}
                id="header-cart-btn"
                className="relative flex items-center gap-2 bg-[#2D1810] hover:bg-[#4A2E2B] text-white px-4 py-2 rounded-full font-bold text-sm shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#FFD93D]" />
                <span className="hidden sm:inline">Cart</span>
                {totalCount > 0 && (
                  <span className="bg-[#FF4B72] text-white text-xs font-extrabold px-2 py-0.5 rounded-full animate-bounce">
                    {totalCount}
                  </span>
                )}
                {grandTotal > 0 && (
                  <span className="hidden md:inline font-bold text-xs text-[#FFF0F4] border-l border-white/20 pl-2">
                    ₹{grandTotal}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#2D1810] hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-[#EFE7DE] shadow-xl px-5 py-6 mt-3 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-between ${
                    link.highlight
                      ? 'bg-[#FF4B72] text-white'
                      : 'text-[#2D1810] hover:bg-[#FFF0F4] hover:text-[#FF4B72]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && <Sparkles className="w-4 h-4" />}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-2 pt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/919876543210?text=Hi%20Sip%20%26%20Bite!%20I%20would%20like%20to%20order."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#00B894] text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  Order on WhatsApp
                </a>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
