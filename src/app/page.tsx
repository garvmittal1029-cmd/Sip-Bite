'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { ShakeMenu } from '@/components/menu/ShakeMenu';
import { ShakeCustomiser } from '@/components/customiser/ShakeCustomiser';
import { SignatureShakes } from '@/components/home/SignatureShakes';
import { AboutSection } from '@/components/home/AboutSection';
import { OffersSection } from '@/components/home/OffersSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { getProducts } from '@/lib/storage';
import { ShakeProduct } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockData';

export default function HomePage() {
  const [products, setProducts] = useState<ShakeProduct[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    getProducts().then((res) => {
      if (res && res.length > 0) {
        setProducts(res);
      }
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF7]">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Interactive Shake Menu Collection */}
      <ShakeMenu products={products} />

      {/* Build Your Own Shake (5-Step Customiser) */}
      <ShakeCustomiser />

      {/* Signature Shakes Showcase */}
      <SignatureShakes />

      {/* Special Offers & Deals */}
      <OffersSection />

      {/* About Sip & Bite */}
      <AboutSection />

      {/* Customer Reviews & Feedback */}
      <ReviewsSection />

      {/* Contact & Location */}
      <ContactSection />

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
