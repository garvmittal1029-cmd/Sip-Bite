'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote, CheckCircle2, Plus } from 'lucide-react';
import { CUSTOMER_REVIEWS } from '@/data/mockData';
import { CustomerReview } from '@/types';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>(CUSTOMER_REVIEWS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // New review form
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [shakeName, setShakeName] = useState('Chocolate Overload');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: name.trim(),
      location: location.trim() || 'Foodie, India',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating,
      shakeName,
      review: comment.trim(),
      date: 'Just now',
      isVerified: true,
    };

    setReviews([newRev, ...reviews]);
    setShowModal(false);
    setName('');
    setLocation('');
    setComment('');
  };

  const current = reviews[currentIndex];

  return (
    <section id="reviews" className="py-24 bg-[#FFFDF7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F8F5] border border-[#B3EBDC] text-[#00B894] text-xs font-black tracking-wider uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Community Love</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2D1810] tracking-tight">
            WHAT OUR SIPPERS SAY
          </h2>
          <p className="text-sm sm:text-base text-[#7C4A3A] font-medium leading-relaxed">
            Real reactions from shake enthusiasts across India.
          </p>
          <div className="text-[11px] font-bold text-gray-400 bg-gray-100 inline-block px-3 py-1 rounded-full">
            * Sample verified reviews until live customer ratings populate.
          </div>
        </div>

        {/* Carousel Showcase */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EFE7DE] shadow-xl relative transition-all duration-300">
            <MessageSquareQuote className="w-12 h-12 text-[#FFCCD8] absolute top-8 right-8 pointer-events-none" />

            <div className="space-y-6">
              {/* Star Rating */}
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < current.rating
                        ? 'text-[#FFD93D] fill-[#FFD93D]'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-black text-[#2D1810] ml-2">
                  {current.rating}.0 Rating
                </span>
              </div>

              {/* Review Text */}
              <p className="text-lg sm:text-xl font-bold text-[#2D1810] leading-relaxed italic">
                &ldquo;{current.review}&rdquo;
              </p>

              {/* Author & Shake Info */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#FF4B72]">
                    <Image
                      src={current.avatar}
                      alt={current.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#2D1810] flex items-center gap-1.5">
                      <span>{current.name}</span>
                      {current.isVerified && (
                        <span title="Verified Sipper" className="inline-flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00B894]" />
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#7C4A3A]">{current.location}</p>
                    <div className="text-[11px] font-bold text-[#FF4B72] mt-0.5">
                      Fav: {current.shakeName}
                    </div>
                  </div>
                </div>

                {/* Slider Navigation Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-full border border-[#EFE7DE] hover:bg-[#FFF0F4] hover:text-[#FF4B72] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-full border border-[#EFE7DE] hover:bg-[#FFF0F4] hover:text-[#FF4B72] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator & Add Review CTA */}
          <div className="flex items-center justify-between mt-6 px-2">
            <div className="flex gap-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-8 bg-[#FF4B72]' : 'w-2.5 bg-gray-200'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4B72] hover:text-[#E6395D] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Leave a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#EFE7DE] space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-[#2D1810]">Write a Review</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Garvit Patel"
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">City / Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bandra, Mumbai"
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Shake You Ordered</label>
                <input
                  type="text"
                  value={shakeName}
                  onChange={(e) => setShakeName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl border text-sm ${
                        rating >= star
                          ? 'border-[#FFD93D] bg-[#FFF5CC] text-[#B8860B]'
                          : 'border-gray-200 text-gray-300'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D1810] block mb-1">Your Feedback</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you loved about your shake..."
                  className="w-full px-3 py-2 bg-[#F8F5F0] border border-[#EFE7DE] rounded-xl focus:outline-none focus:border-[#FF4B72]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF4B72] text-white font-extrabold hover:bg-[#E6395D] shadow-md"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
