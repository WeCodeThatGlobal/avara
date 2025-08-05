"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@modules/common/components/ProductCard";
import { ROUTES, getApiUrl } from "@lib/api";
import { getApi } from "@lib/api-client";

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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getApi(ROUTES.PRODUCTS + "?type=deal_of_the_day&limit=4")
      .then((res: { ok: any; json: () => any; }) => {
        if (!res.ok) throw new Error("Failed to fetch deal of the day products");
        return res.json();
      })
      .then((data: { products: any; }) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err: { message: any; }) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

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
          {loading && <div className="col-span-4 text-center text-gray-400">Loading deals...</div>}
          {error && <div className="col-span-4 text-center text-red-500">{error}</div>}
          {!loading && !error && products.length === 0 && (
            <div className="col-span-4 text-center text-gray-400">No deals available.</div>
          )}
          {!loading && !error && products.map((product, idx) => (
            <ProductCard key={product.id || idx} id={product.id || `deal-${idx}`} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDaySection;