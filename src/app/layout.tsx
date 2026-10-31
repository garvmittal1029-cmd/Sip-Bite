import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SipBiteAssistant } from '@/components/ai/SipBiteAssistant';

export const metadata: Metadata = {
  title: 'Sip & Bite — Your Cravings, Your Shake | Artisan Custom Milkshakes',
  description:
    'Discover Sip & Bite: Indulge in artisanal chocolate overloads, Oreo blasts, fresh Alphonso mango blends, or build your own custom shake with real dairy & plant bases.',
  keywords: [
    'Sip & Bite',
    'milkshake brand',
    'custom shake',
    'chocolate overload',
    'oreo shake',
    'mango shake',
    'thick shakes',
    'online shake delivery',
  ],
  authors: [{ name: 'Sip & Bite' }],
  openGraph: {
    title: 'Sip & Bite — Your Cravings, Your Shake',
    description:
      'From rich chocolate cravings to refreshing fruity blends, discover shakes made to match your taste.',
    url: 'https://sipandbite.in',
    siteName: 'Sip & Bite',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#FCFBF7] text-[#2D1810] antialiased selection:bg-[#FFE0E8] selection:text-[#FF4B72]">
        <CartProvider>
          {children}
          <CartDrawer />
          <SipBiteAssistant />
        </CartProvider>
      </body>
    </html>
  );
}
