'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { INITIAL_PRODUCTS, SPECIAL_OFFERS } from '@/data/mockData';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAction?: {
    type: 'add_product' | 'scroll_customiser' | 'apply_offer';
    productId?: string;
    productName?: string;
    productPrice?: number;
    offerCode?: string;
  };
  time: string;
}

export const SipBiteAssistant: React.FC = () => {
  const { addToCart, applyPromoCode, openCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "👋 Hi! I'm your Sip & Bite Assistant. How can I sweeten your day? Ask me for flavour recommendations, vegan bases, custom shake recipes, or active discount codes!",
      time: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Recommend something chocolatey 🍫',
    'What are your best fruity shakes? 🍓',
    'Any vegan / dairy-free options? 🌱',
    'What promo codes are active? 🏷️',
    'How do I build my own shake? 🥤',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Intelligent Contextual Response Generator
  const generateAssistantResponse = async (userQuery: string): Promise<{ text: string; action?: Message['suggestedAction'] }> => {
    const q = userQuery.toLowerCase();

    // Check if Gemini API key exists
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are the friendly, gourmet AI beverage concierge for "Sip & Bite", a premium modern milkshake brand.
Brand Tagline: Your Cravings, Your Shake.
Menu items: Chocolate Overload (₹299), Oreo Blast (₹279), Strawberry Dream (₹209), Alphonso Mango Madness (₹229), Nutella Delight (₹249), Brownie Fudge Shake (₹289), Lotus Biscoff (₹269).
Custom Shake Steps: 1. Base (Full Cream Milk, Chocolate Milk, Vanilla, Plant-Based Milk), 2. Flavor, 3. Size (Regular, Large, XL), 4. Toppings (Oreo crumbs, Choco chips, Whipped cream, Nuts, Brownie), 5. Sweetness.
Active Offers: SIPBITE20 (20% off above ₹299), FREESHIP (Free delivery above ₹499), STUDENT15 (15% off).
Location: Powai, Mumbai. Hours: 11 AM - 1:30 AM.
Answer the user's question concisely in a warm, mouth-watering tone. Query: "${userQuery}"`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return { text: data.candidates[0].content.parts[0].text };
        }
      } catch (err) {
        console.warn('Gemini API call failed, using built-in engine:', err);
      }
    }

    // Built-in Intelligent Response Engine
    if (q.includes('chocolate') || q.includes('cocoa') || q.includes('choc')) {
      const prod = INITIAL_PRODUCTS.find((p) => p.name.includes('Chocolate Overload')) || INITIAL_PRODUCTS[0];
      return {
        text: "You can't go wrong with our iconic 'Chocolate Overload' (₹299)! It features 70% dark Belgian cocoa, freshly baked brownie bites, chocolate pearls, and cocoa curls. Would you like me to add it to your bag?",
        action: {
          type: 'add_product',
          productId: prod.id,
          productName: prod.name,
          productPrice: prod.price,
        },
      };
    }

    if (q.includes('fruit') || q.includes('mango') || q.includes('strawberry') || q.includes('berry')) {
      const prod = INITIAL_PRODUCTS.find((p) => p.name.includes('Mango Madness')) || INITIAL_PRODUCTS[9];
      return {
        text: "For a refreshing fruity bliss, our 'Alphonso Mango Madness' (₹229) is crafted with 100% natural Ratnagiri Alphonso pulp, topped with fresh mango cubes and saffron. We also have 'Strawberry Dream' (₹209) made with Mahabaleshwar strawberries!",
        action: {
          type: 'add_product',
          productId: prod.id,
          productName: prod.name,
          productPrice: prod.price,
        },
      };
    }

    if (q.includes('vegan') || q.includes('plant') || q.includes('dairy free') || q.includes('lactose')) {
      return {
        text: "We offer Plant-Based Oat & Almond Milk in our 'Build Your Own Shake' lab (+₹35)! You can pair it with our Wild Blueberry, Fresh Strawberry, or Belgian Dark Cocoa with low sweetness.",
        action: {
          type: 'scroll_customiser',
        },
      };
    }

    if (q.includes('offer') || q.includes('coupon') || q.includes('discount') || q.includes('code') || q.includes('promo')) {
      return {
        text: "Here are our hottest perks:\n• 'SIPBITE20' — Flat 20% OFF on first order above ₹299\n• 'FREESHIP' — Free delivery on orders ₹499+\n• 'STUDENT15' — 15% student perk with ID\n\nClick below to apply SIPBITE20 directly!",
        action: {
          type: 'apply_offer',
          offerCode: 'SIPBITE20',
        },
      };
    }

    if (q.includes('custom') || q.includes('build') || q.includes('own shake') || q.includes('how to')) {
      return {
        text: "Creating your own shake takes just 5 easy steps:\n1. Choose your base (Dairy or Plant-based)\n2. Pick your core flavour (Oreo, Mango, Strawberry, etc.)\n3. Select Size (Regular 350ml, Large 500ml, XL 700ml)\n4. Pile on crunchy toppings & whipped cream\n5. Tune your sweetness level\n\nTry it right now on our interactive Shake Lab!",
        action: {
          type: 'scroll_customiser',
        },
      };
    }

    if (q.includes('hours') || q.includes('time') || q.includes('location') || q.includes('where') || q.includes('address')) {
      return {
        text: "📍 We are located at Shop 4 & 5, Galleria Promenade, Central Avenue, Powai, Mumbai. We are open every day from 11:00 AM to 1:30 AM! You can also order online for instant door delivery.",
      };
    }

    // Default friendly answer
    return {
      text: "I'd love to help! You can try our crowd-favourite 'Classic Oreo Crunch' (₹199), dive into our rich 'Nutella Delight' (₹249), or craft a custom blend in our Shake Lab. What flavour profile are you craving today?",
    };
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    // Simulate typing delay for realistic interaction
    setTimeout(async () => {
      const response = await generateAssistantResponse(textToSend);
      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        suggestedAction: response.action,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: Message['suggestedAction']) => {
    if (!action) return;

    if (action.type === 'add_product' && action.productId) {
      const prod = INITIAL_PRODUCTS.find((p) => p.id === action.productId) || INITIAL_PRODUCTS[0];
      addToCart({
        productId: prod.id,
        name: prod.name,
        image: prod.image,
        price: prod.price,
        quantity: 1,
        isCustom: false,
        unitPrice: prod.price,
      });
      openCart();
    } else if (action.type === 'scroll_customiser') {
      const el = document.getElementById('customiser');
      el?.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    } else if (action.type === 'apply_offer' && action.offerCode) {
      applyPromoCode(action.offerCode);
      openCart();
    }
  };

  return (
    <>
      {/* Floating Trigger Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            id="ai-assistant-btn"
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#FF4B72] to-[#FF6B8B] text-white px-5 py-3 rounded-full shadow-2xl shadow-[#FF4B72]/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FFD93D] ring-2 ring-white" />
            </div>
            <span className="text-xs font-black tracking-wide">Sip & Bite AI</span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-[#FFFDF7] rounded-3xl shadow-2xl border border-[#EFE7DE] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#2D1810] to-[#4A2E2B] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FF4B72] flex items-center justify-center text-white shadow-inner">
                <Sparkles className="w-4 h-4 text-[#FFD93D]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                  <span>Sip & Bite Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                </h3>
                <span className="text-[10px] text-[#D6C4B5] font-semibold">
                  AI Beverage Concierge
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#FFF0F4] text-[#FF4B72] flex items-center justify-center shrink-0 border border-[#FFCCD8] text-xs">
                    🥤
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-xs space-y-2 ${
                    m.sender === 'user'
                      ? 'bg-[#FF4B72] text-white rounded-br-none'
                      : 'bg-white text-[#2D1810] border border-[#EFE7DE] rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line font-medium">{m.text}</p>

                  {/* Dynamic Action Button */}
                  {m.suggestedAction && (
                    <button
                      onClick={() => handleActionClick(m.suggestedAction)}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 bg-[#2D1810] hover:bg-[#FF4B72] text-white text-[11px] font-extrabold py-2 px-3 rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      {m.suggestedAction.type === 'add_product' && (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag (₹{m.suggestedAction.productPrice})</span>
                        </>
                      )}
                      {m.suggestedAction.type === 'scroll_customiser' && (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#FFD93D]" />
                          <span>Launch Shake Lab</span>
                        </>
                      )}
                      {m.suggestedAction.type === 'apply_offer' && (
                        <>
                          <span>Apply Code {m.suggestedAction.offerCode}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs italic pl-9">
                <span className="w-2 h-2 rounded-full bg-[#FF4B72] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#FF4B72] animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-[#FF4B72] animate-bounce delay-200" />
                <span>Assistant is crafting an answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-white border-t border-[#EFE7DE] overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[10px] font-bold text-[#4A2E2B] bg-[#F8F5F0] hover:bg-[#FFF0F4] hover:text-[#FF4B72] border border-[#EFE7DE] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-[#EFE7DE] flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about our shakes..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-[#FF4B72] hover:bg-[#E6395D] text-white rounded-xl disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
