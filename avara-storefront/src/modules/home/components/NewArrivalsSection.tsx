import React from "react";
import ProductCard from "@modules/common/components/ProductCard";

const dummyProducts = [
  {
    image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
    name: "Ground Nuts Oil Pack",
    category: "Snacks",
    price: "$15",
    oldPrice: "$22",
    rating: 4,
    packInfo: "500g",
    badge: "NEW",
  },
  {
    image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    name: "Organic Litchi Juice Pack",
    category: "Juice",
    price: "$25",
    oldPrice: "$30",
    rating: 4,
    packInfo: "100ml",
    badge: "TREND",
  },
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    name: "Crunchy Banana Chips",
    category: "Chips",
    price: "$1",
    oldPrice: "$2",
    rating: 4,
    packInfo: "100g",
    badge: "",
  },
  {
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
    name: "Crunchy Potato Chips",
    category: "Chips",
    price: "$25",
    oldPrice: undefined,
    rating: 4,
    packInfo: "50g",
    badge: "",
    stockStatus: "Out Of Stock",
    stockStatusColor: "text-gray-400",
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

const NewArrivalsSection: React.FC = () => {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              New <span className="text-blue-500">Arrivals</span>
            </h2>
            <p className="text-gray-400 text-lg">Shop online for new arrivals and get free shipping!</p>
          </div>
          {/* Example filter navigation, not functional */}
          <div className="flex items-center gap-4 text-base font-semibold">
            <span className="text-gray-400">All</span>
            <span className="text-blue-500">Snack & Spices</span>
            <span className="text-gray-400">Fruits</span>
            <span className="text-gray-400">Vegetables</span>
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

export default NewArrivalsSection; 