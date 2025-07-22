"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@modules/common/components/ProductCard";

const dummyProducts = [
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    name: "Mixed Fruits Chocolates Pack",
    category: "Chocos",
    price: "$25",
    oldPrice: "$30",
    rating: 4,
    packInfo: "1 Pack",
    badge: "NEW",
  },
  {
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    name: "Organic Apple Juice Pack",
    category: "Juice",
    price: "$15",
    oldPrice: undefined,
    rating: 4,
    packInfo: "100 ml",
    badge: "HOT",
    stockStatus: "3 Left",
    stockStatusColor: "text-blue-500",
  },
  {
    image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    name: "Mixed Almond nuts juice Pack",
    category: "Juice",
    price: "$32",
    oldPrice: "$39",
    rating: 4,
    packInfo: "250 g",
    badge: "",
  },
  {
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    name: "Fresh Mango Slice Juice",
    category: "Fruits",
    price: "$25",
    oldPrice: undefined,
    rating: 4,
    packInfo: "1 Pack",
    badge: "SALE",
    stockStatus: "Out Of Stock",
    stockStatusColor: "text-gray-400",
  },
];

function getTimeLeft(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const DealOfTheDaySection: React.FC = () => {
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 640);
    date.setHours(date.getHours() + 16);
    date.setMinutes(date.getMinutes() + 31);
    date.setSeconds(date.getSeconds() + 3);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Day Of The <span className="text-blue-500">Deal</span>
            </h2>
            <p className="text-gray-400 text-lg">Don't wait. The time will never be just right.</p>
          </div>
          <div className="flex items-center">
            <span className="bg-gray-50 border border-gray-200 rounded-xl px-6 py-2 text-lg font-semibold text-gray-700 tracking-widest">
              {timeLeft.days} Days {String(timeLeft.hours).padStart(2, "0")} : {String(timeLeft.minutes).padStart(2, "0")} : {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {dummyProducts.map((product, idx) => (
            <ProductCard key={idx} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDaySection;