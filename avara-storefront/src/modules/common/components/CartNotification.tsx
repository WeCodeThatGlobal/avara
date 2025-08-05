"use client";
import React, { useEffect, useState } from 'react';
import { HiOutlineCheck } from 'react-icons/hi2';
import { HiX } from 'react-icons/hi';
import { useCart } from '../../../lib/context/CartContext';

const CartNotification: React.FC = () => {
  const { state: cartState } = useCart();
  const [showNotification, setShowNotification] = useState(false);
  const [lastItemCount, setLastItemCount] = useState(0);

  useEffect(() => {
    if (cartState.totalItems > lastItemCount) {
      setShowNotification(true);
      setLastItemCount(cartState.totalItems);
      
      // Hide notification after 3 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [cartState.totalItems, lastItemCount]);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <HiOutlineCheck className="w-5 h-5" />
        <span className="font-medium">Item added to cart successfully!</span>
        <button
          onClick={() => setShowNotification(false)}
          className="ml-2 hover:bg-green-600 rounded-full p-1 transition-colors"
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartNotification; 