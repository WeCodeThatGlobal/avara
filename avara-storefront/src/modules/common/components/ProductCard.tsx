import React from "react";
import { HiOutlineHeart, HiOutlineEye, HiOutlineArrowsRightLeft, HiOutlineShoppingBag } from "react-icons/hi2";

interface ProductCardProps {
  image: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  rating: number; // 0-5
  packInfo: string;
  stockStatus?: string;
  stockStatusColor?: string;
  badge?: string;
}

const icons = [
    <HiOutlineHeart key="heart" className="w-6 h-6" />,
    <HiOutlineEye key="eye" className="w-6 h-6" />,
    <HiOutlineArrowsRightLeft key="compare" className="w-6 h-6" />,
    <HiOutlineShoppingBag key="cart" className="w-6 h-6" />,
  ];

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  category,
  price,
  oldPrice,
  rating,
  packInfo,
  stockStatus,
  stockStatusColor = "text-blue-500",
  badge,
}) => {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center min-w-[220px] max-w-xs mx-auto transition hover:shadow-lg group">
      {badge && (
        <div className="absolute left-2 top-6 flex flex-col items-center text-xs font-semibold text-gray-400 tracking-widest select-none" style={{letterSpacing: '0.2em'}}>
          {badge.split("").map((char, idx) => (
            <span key={idx}>{char}</span>
          ))}
        </div>
      )}
      <div className="relative w-full flex flex-col items-center">
        <img
          src={image}
          alt={name}
          className="w-32 h-40 object-contain mb-4 transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {icons.map((icon, idx) => (
            <button
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-2 shadow hover:bg-gray-100 focus:outline-none"
              tabIndex={-1}
              aria-label="Product action"
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full text-left mt-2">
        <div className="text-xs text-gray-400 mb-1">{category}</div>
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < rating ? "text-orange-400" : "text-gray-300"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          ))}
        </div>
        <div className="font-semibold text-base text-gray-800 mb-1 truncate">{name}</div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-gray-800">{price}</span>
          {oldPrice && <span className="text-sm text-gray-400 line-through">{oldPrice}</span>}
          {stockStatus && <span className={`text-xs font-medium ${stockStatusColor}`}>{stockStatus}</span>}
        </div>
        <div className="text-xs text-gray-400">{packInfo}</div>
      </div>
    </div>
  );
};

export default ProductCard; 