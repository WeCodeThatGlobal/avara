"use client";
import React from "react";
import { HiOutlineHeart, HiOutlineEye, HiOutlineArrowsRightLeft, HiOutlineShoppingBag } from "react-icons/hi2";
import { useCart } from "../../../lib/context/CartContext";
import { CartItem } from "../../../types/global";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  rating: number;
  packInfo: string;
  stockStatus?: string;
  stockStatusColor?: string;
  badge?: string;
  className?: string;
  description?: string;
}

const icons = [
  <HiOutlineEye key="eye" className="w-6 h-6" />,
  <HiOutlineArrowsRightLeft key="compare" className="w-6 h-6" />,
  <HiOutlineShoppingBag key="cart" className="w-6 h-6" />,
];

const ProductCard: React.FC<ProductCardProps> = ({
  id,
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
  className = "",
  description,
}) => {
  const { addItem } = useCart();
  const isListView = className.includes("flex");

  // Extract numeric price from string (assuming format like "$19.99")
  const extractPrice = (priceStr: string): number => {
    const numericPrice = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(numericPrice) || 0;
  };

  const extractOriginalPrice = (priceStr?: string): number | undefined => {
    if (!priceStr) return undefined;
    const numericPrice = priceStr.replace(/[^0-9.]/g, '');
    return parseFloat(numericPrice) || undefined;
  };

  const handleAddToCart = () => {
    const cartItem: Omit<CartItem, 'quantity'> = {
      id,
      name,
      image,
      price: extractPrice(price),
      originalPrice: extractOriginalPrice(oldPrice),
      category,
      packInfo,
    };
    
    addItem(cartItem);
  };

  return (
    <div className={`relative bg-white rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-lg group
      ${isListView 
        ? 'p-4 w-full flex gap-6' 
        : 'p-6 flex flex-col items-center w-72 mx-auto'}`}>
      
      {/* Badge - Only show in grid view */}
      {!isListView && badge && (
        <div className="absolute left-2 top-6 flex flex-col items-center text-xs font-semibold text-gray-400 tracking-widest select-none" style={{letterSpacing: '0.2em'}}>
          {badge.split("").map((char, idx) => (
            <span key={idx}>{char}</span>
          ))}
        </div>
      )}

      {/* Image Section */}
      <div className={`relative ${isListView ? 'w-48 h-48 flex-shrink-0' : 'w-full'} flex flex-col items-center`}>
        <img
          src={image}
          alt={name}
          className={`object-contain transition-transform duration-300 group-hover:scale-105
            ${isListView ? 'w-full h-full' : 'w-32 h-40 mb-4'}`}
        />
        
        {/* Action Buttons */}
        <div className={`absolute flex gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100
          ${isListView 
            ? 'bottom-0 flex-row justify-center w-full' 
            : 'left-1/2 -translate-x-1/2 bottom-2 translate-y-4 group-hover:translate-y-0'}`}>
          {icons.map((icon, idx) => (
            <button
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-2 shadow hover:bg-gray-100 focus:outline-none"
              tabIndex={-1}
              aria-label={idx === 3 ? "Add to cart" : "Product action"}
              onClick={idx === 3 ? handleAddToCart : undefined}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content Section */}
      <div className={`${isListView ? 'flex-1' : 'w-full text-left mt-2'}`}>
        <div className="text-xs text-gray-400 mb-1">{category}</div>
        
        {/* Rating */}
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
        
        {/* Product Name */}
        <div className="w-full relative flex overflow-x-hidden">
          <div className="flex items-center whitespace-nowrap group-hover:animate-marquee">
            <p className="font-semibold text-base text-gray-800 mr-4">{name}</p>
            <p className="font-semibold text-base text-gray-800 mr-4" aria-hidden="true">{name}</p>
          </div>
          <p className="absolute top-0 left-0 font-semibold text-base text-gray-800 truncate w-full group-hover:invisible">
            {name}
          </p>
        </div>

        {/* Description - Only show in list view */}
        {isListView && description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{description}</p>
        )}
        
        {/* Price and Stock Info */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-800">{price}</span>
            {oldPrice && <span className="text-sm text-gray-400 line-through">{oldPrice}</span>}
            {stockStatus && <span className={`text-xs font-medium ${stockStatusColor}`}>{stockStatus}</span>}
          </div>
          <div className="text-xs text-gray-400">{packInfo}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;