"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@modules/common/components/ProductCard";
import { ROUTES, getApiUrl } from "@lib/api";
import { getApi } from "@lib/api-client";

const NewArrivalsSection: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    getApi(ROUTES.PRODUCTS + "?type=new_arrivals&limit=4")
      .then((res: { ok: any; json: () => any; }) => {
        if (!res.ok) throw new Error("Failed to fetch new arrivals products");
        return res.json();
      })
      .then((data: { products: any; }) => {
        setProducts(data.products || []);
      })
      .catch((err: { message: any; }) => {
        console.error(err);
      });
  }, []);

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              New <span className="text-blue-500">Arrivals</span>
            </h2>
            <p className="text-gray-400 text-lg">Shop online for new arrivals and get free shipping!</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, idx) => (
            <ProductCard key={product.id || idx} id={product.id || `new-${idx}`} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection; 