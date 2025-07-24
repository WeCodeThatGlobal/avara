import React from 'react';

const ProductListSkeletonItem = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-6 animate-pulse">
    <div className="w-36 h-36 bg-gray-200 rounded-lg flex-shrink-0"></div>
    <div className="flex-1 space-y-4">
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-7 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default ProductListSkeletonItem;
