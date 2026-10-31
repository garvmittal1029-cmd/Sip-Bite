import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#23120C] text-[#F5EDE4] pt-16 pb-12 border-t border-[#3D251D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group py-1">
              <Image
                src="/images/logo-dark-bg.png"
                alt="Sip & Bite — Your Cravings, Your Shake"
                width={170}
                height={82}
                className="h-12 w-auto object-contain transform group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-sm text-[#D6C4B5] leading-relaxed">
              Crafting happiness in every sip. Specialising in rich, creamy, customisable shakes made with 100% natural fruit pulps, pure dairy & premium chocolates.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-[#FF4B72]/20 border border-[#FF4B72]/40 rounded-full text-xs font-bold text-[#FF85A1]">
                Your Cravings, Your Shake.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white tracking-wider uppercase text-sm">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-sm text-[#D6C4B5]">
              <li>
                <Link href="/#menu" className="hover:text-[#FF4B72] transition-colors">
                  Artisan Menu Collection
                </Link>
              </li>
              <li>
                <Link href="/#customiser" className="hover:text-[#FF4B72] transition-colors font-semibold text-[#FF85A1]">
                  ✨ Build Your Own Shake
                </Link>
              </li>
              <li>
                <Link href="/#signatures" className="hover:text-[#FF4B72] transition-colors">
                  Crown Jewel Signatures
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="hover:text-[#FF4B72] transition-colors">
                  Combo & Student Offers
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#FF4B72] transition-colors font-bold text-[#FFD93D]">
                  🛵 Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours & Outlet */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-white tracking-wider uppercase text-sm">
              Visit & Hours
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D6C4B5]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF4B72] shrink-0 mt-0.5" />
                <span>Shop 4 & 5, Galleria Promenade, Central Avenue, Powai, Mumbai - 400076</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FFD93D] shrink-0" />
                <span>Monday - Sunday: 11:00 AM – 1:30 AM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2EC4B6] shrink-0" />
                <span>+91 98765 43210 / +91 91234 56789</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF85A1] shrink-0" />
                <span>hello@sipandbite.in</span>
              </li>
            </ul>
          </div>

          {/* Socials & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wider uppercase text-sm">
              Join the Craving Club
            </h4>
            <p className="text-xs text-[#D6C4B5]">
              Get secret shake recipes, new flavour alerts and exclusive discount codes directly in your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF4B72] flex-1"
              />
              <button
                type="button"
                className="bg-[#FF4B72] hover:bg-[#E6395D] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF4B72] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF4B72] flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF4B72] flex items-center justify-center text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#B39E8F] gap-4">
          <p>© 2026 Sip & Bite Beverage Co. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-[#FF4B72] fill-[#FF4B72]" /> for shake lovers everywhere
          </p>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:underline">Admin Portal</Link>
            <span>•</span>
            <span>FSSAI Lic. #11522018000492</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
