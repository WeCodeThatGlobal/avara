"use client";
import React from 'react';
import { FaShoppingBag } from 'react-icons/fa';

interface PlaceholderProps {
  text: string;
}

/**
 * @param {string} text - The message to display below the icon.
 */
const Placeholder: React.FC<PlaceholderProps> = ({ text }) => {
  return (
    <div className="col-span-4 flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
      <FaShoppingBag className="h-16 w-16 mb-4 text-gray-400" />
      <p className="text-lg">{text}</p>
    </div>
  );
};

export default Placeholder;
