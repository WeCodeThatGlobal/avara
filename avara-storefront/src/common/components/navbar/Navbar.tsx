import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full border-b bg-white">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">
            <span className="text-blue-500">Avara</span>
          </span>
        </div>
        {/* Category Dropdown & Search */}
        <div className="flex items-center flex-1 max-w-xl mx-8">
          <div className="relative">
            <button className="flex items-center px-4 py-2 border rounded-l-md bg-gray-50 text-gray-700">
              Vegetables
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border-t border-b border-r rounded-r-md focus:outline-none"
          />
          <button className="-ml-8 p-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          </button>
        </div>
        {/* Account, Wishlist, Cart */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 018 0v2" /></svg>
            <span className="text-gray-700">Account</span>
            <span className="font-semibold text-gray-900 ml-1">Login</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            <span className="text-xs text-gray-500">3 Items</span>
            <span className="font-semibold text-gray-900 ml-1">Wishlist</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
            <span className="text-xs text-gray-500">4 Items</span>
            <span className="font-semibold text-gray-900 ml-1">Cart</span>
          </div>
        </div>
        {/* Location Selector */}
        <div className="ml-8">
          <button className="flex items-center px-4 py-2 border rounded-md bg-gray-50 text-gray-700">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
            Surat
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-8 px-8 py-2 border-t bg-white">
        <button className="p-2 rounded hover:bg-gray-100">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        </button>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500">Home</a>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500">Categories <span className="inline-block align-middle ml-1">&#9679;</span></a>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500">Products <span className="inline-block align-middle ml-1">&#9679;</span></a>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500">Pages <span className="inline-block align-middle ml-1">&#9679;</span></a>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500">Blog <span className="inline-block align-middle ml-1">&#9679;</span></a>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center"><svg className="w-5 h-5 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V17h-2v-.07A8.001 8.001 0 014 12h2a6 6 0 0012 0h2a8.001 8.001 0 01-7 6.93z" /></svg>Offers</a>
      </div>
    </nav>
  );
};

export default Navbar; 