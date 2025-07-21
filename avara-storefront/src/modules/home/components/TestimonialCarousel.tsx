"use client";
import React, { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Nikki Albart",
    title: "(Team Leader)",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto at sint eligendi possimus perspiciatis asperiores reiciendis hic amet alias aut quaerat maiores blanditiis.",
  },
  {
    name: "Liam Smith",
    title: "(Developer)",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Quisquam, quidem. Doloremque, voluptates. Repellendus, voluptatum. Fugiat, laborum. Quis, voluptates. Eaque perspiciatis asperiores reiciendis.",
  },
  {
    name: "Sophia Brown",
    title: "(Designer)",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "Eaque, voluptates. Quisquam, quidem. Doloremque, voluptates. Repellendus, voluptatum. Architecto at sint eligendi possimus perspiciatis.",
  },
  {
    name: "Noah Johnson",
    title: "(Product Owner)",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    text: "Repellendus, voluptatum. Fugiat, laborum. Quis, voluptates. Eaque, voluptates. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

const TestimonialCard: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const total = testimonials.length;

  const getPrevIndex = (index: number) => (index === 0 ? total - 1 : index - 1);
  const getNextIndex = (index: number) => (index === total - 1 ? 0 : index + 1);

  const goToNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => getNextIndex(prev));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const goToPrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrent((prev) => getPrevIndex(prev));
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const renderTestimonialCard = (testimonial: any, position: 'prev' | 'current' | 'next') => {
    const isActive = position === 'current';
    const isPrev = position === 'prev';
    const isNext = position === 'next';
    
    const baseClasses = "bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 ease-in-out absolute top-0";
    const activeClasses = "opacity-100 scale-100 z-20 transform translate-x-0";
    const inactiveClasses = "opacity-40 scale-90 z-10 pointer-events-none";
    const prevClasses = "transform -translate-x-8 -rotate-2";
    const nextClasses = "transform translate-x-8 rotate-2";

    let positionClasses = "";
    if (isActive) {
      positionClasses = activeClasses;
    } else if (isPrev) {
      positionClasses = `${inactiveClasses} ${prevClasses}`;
    } else {
      positionClasses = `${inactiveClasses} ${nextClasses}`;
    }

    return (
      <div className={`${baseClasses} ${positionClasses} w-full max-w-lg`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-16 h-16 rounded-xl object-cover shadow-md"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {testimonial.name}
            </h3>
            <p className="text-gray-500 text-sm mb-3">
              {testimonial.title}
            </p>
            <blockquote className="text-gray-700 leading-relaxed text-sm">
              "{testimonial.text}"
            </blockquote>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Floating avatars in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 rounded-full bg-gray-300 opacity-30 animate-pulse"></div>
        <div className="absolute top-32 right-32 w-12 h-12 rounded-full bg-blue-200 opacity-40 animate-pulse delay-75"></div>
        <div className="absolute bottom-40 left-40 w-20 h-20 rounded-full bg-pink-200 opacity-30 animate-pulse delay-150"></div>
        <div className="absolute bottom-20 right-20 w-14 h-14 rounded-full bg-yellow-200 opacity-40 animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-16 w-10 h-10 rounded-full bg-purple-200 opacity-35 animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-16 w-18 h-18 rounded-full bg-green-200 opacity-30 animate-pulse delay-700"></div>
      </div>

      {/* Testimonials heading */}
      <div className="text-center mb-2 z-30 relative">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight">
          Testimonials
        </h2>
        <p className="text-gray-500 text-lg">What our clients say about us</p>
      </div>

      {/* Testimonial cards container */}
      <div className="relative w-full max-w-lg mx-auto h-64 z-20">
        {/* Previous card */}
        {renderTestimonialCard(testimonials[getPrevIndex(current)], 'prev')}
        
        {/* Current card */}
        {renderTestimonialCard(testimonials[current], 'current')}
        
        {/* Next card */}
        {renderTestimonialCard(testimonials[getNextIndex(current)], 'next')}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center space-x-6 mt-2 z-30 relative">

        {/* Navigation dots */}
        <div className="flex space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current 
                  ? "bg-gray-800 w-8" 
                  : "bg-gray-400 hover:bg-gray-600 w-2"
              }`}
              onClick={() => {
                if (!isAnimating && idx !== current) {
                  setIsAnimating(true);
                  setCurrent(idx);
                  setTimeout(() => setIsAnimating(false), 300);
                }
              }}
              disabled={isAnimating}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCard;