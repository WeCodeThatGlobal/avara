import React from 'react';

const ProductGridSkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default ProductGridSkeletonCard; 