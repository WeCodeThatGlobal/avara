"use client";
import React, { useState, useRef } from "react";
import { 
  HiOutlineUser, 
  HiOutlineHeart, 
  HiOutlineShoppingCart, 
  HiOutlineLocationMarker, 
  HiOutlineSearch, 
  HiOutlineTag, 
  HiOutlineViewGrid, 
  HiOutlineChevronDown,
  HiOutlineChevronRight
} from "react-icons/hi";

// --- DATA FOR MENUS ---
const categoriesMenu = [
  { title: "Classic", items: ["Left Sidebar 3 Column", "Left Sidebar 4 Column", "Right Sidebar 3 Column", "Right Sidebar 4 Column", "Full Width 4 Column"] },
  { title: "Banner", items: ["Left Sidebar 3 Column", "Left Sidebar 4 Column", "Right Sidebar 3 Column", "Right Sidebar 4 Column", "Full Width 4 Column"] },
  { title: "Columns", items: ["3 Columns Full Width", "4 Columns Full Width", "5 Columns Full Width", "6 Columns Full Width", "Banner 3 Columns"] },
  { title: "List", items: ["Shop Left Sidebar", "Shop Right Sidebar", "Banner Left Sidebar", "Banner Right Sidebar", "Full Width 2 Columns"] },
];

const productsMenu = [
  { label: "Product Page", sub: true },
  { label: "Product Accordion", sub: true },
  { label: "Product Full Width", sub: false },
  { label: "Accordion Full Width", sub: false },
];

const pagesMenu = ["About Us", "Contact Us", "Cart", "Checkout", "Compare", "Faq", "Login", "Register"];

const blogMenu = ["Left Sidebar", "Right Sidebar", "Full Width", "Detail Left Sidebar", "Detail Right Sidebar", "Detail Full Width"];


// --- REUSABLE DROPDOWN COMPONENT ---
const SimpleDropdown = ({ items }: { items: any[] }) => (
  <div className="w-60 bg-white rounded-xl shadow-lg border border-gray-100 p-5">
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index}>
          <a href="#" className="flex justify-between items-center text-gray-600 hover:text-blue-500 font-medium transition-colors duration-200">
            {item.label || item}
            {item.sub && <HiOutlineChevronRight className="w-4 h-4" />}
          </a>
        </li>
      ))}
    </ul>
  </div>
);


// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuName: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setOpenMenu(menuName);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setOpenMenu(null);
    }, 200); // 200ms delay
  };

  const renderDropdown = (name: string, trigger: React.ReactNode, content: React.ReactNode) => {
    const isOpen = openMenu === name;
    return (
      <div className="relative" onMouseEnter={() => handleMouseEnter(name)} onMouseLeave={handleMouseLeave}>
        {trigger}
        <div
          className={`
            absolute left-0 top-full pt-3
            transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
          `}
        >
          {content}
        </div>
      </div>
    );
  };

  return (
    <nav className="w-full border-b bg-white relative z-50">
      {/* Top section: Logo, Search, Account, etc. */}
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">
            <span className="text-blue-500">Avara</span>
          </span>
        </div>
        <div className="flex items-center flex-1 max-w-xl mx-8">
          <div className="relative">
            <button className="flex items-center px-4 py-2 border rounded-l-md bg-gray-50 text-gray-700">
              Vegetables
              <HiOutlineChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 border-t border-b border-r rounded-r-md focus:outline-none"
          />
          <button className="-ml-8 p-2">
            <HiOutlineSearch className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <HiOutlineUser className="w-6 h-6 text-blue-400" />
            <span className="text-gray-700">Account</span>
            <span className="font-semibold text-gray-900 ml-1">Login</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <HiOutlineHeart className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-gray-500">3 Items</span>
            <span className="font-semibold text-gray-900 ml-1">Wishlist</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <HiOutlineShoppingCart className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-gray-500">4 Items</span>
            <span className="font-semibold text-gray-900 ml-1">Cart</span>
          </div>
        </div>
        <div className="ml-8">
          <button className="flex items-center px-4 py-2 border rounded-md bg-gray-50 text-gray-700">
            <HiOutlineLocationMarker className="w-5 h-5 mr-1" />
            Surat
            <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Bottom section: Navigation links and dropdowns */}
      <div className="flex items-center gap-10 px-8 py-3 border-t bg-white">
        <button className="p-2 rounded hover:bg-gray-100">
          <HiOutlineViewGrid className="w-6 h-6 text-blue-400" />
        </button>
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500">Home</a>
        
        {/* Categories Dropdown */}
        {renderDropdown(
          'categories',
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center">
            Categories <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,
          <div className="w-[950px] bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex gap-8">
            {categoriesMenu.map((col) => (
              <div key={col.title} className="flex-1 min-w-[200px]">
                <div className="text-lg font-bold text-blue-600 mb-3">{col.title}</div>
                <div className="border-b border-gray-200 mb-4" />
                <ul className="space-y-3">
                  {col.items.map((item, i) => (
                    <li key={i}><a href="#" className="text-gray-600 hover:text-blue-500 font-medium transition-colors">{item}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Products Dropdown */}
        {renderDropdown(
          'products',
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center">
            Products <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,
          <SimpleDropdown items={productsMenu} />
        )}
        
        {/* Pages Dropdown */}
        {renderDropdown(
          'pages',
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center">
            Pages <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,
          <SimpleDropdown items={pagesMenu} />
        )}

        {/* Blog Dropdown */}
        {renderDropdown(
          'blog',
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center">
            Blog <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,
          <SimpleDropdown items={blogMenu} />
        )}

        <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center">
          <HiOutlineTag className="w-5 h-5 mr-1 text-blue-400" />Offers
        </a>
      </div>
    </nav>
  );
};

export default Navbar;