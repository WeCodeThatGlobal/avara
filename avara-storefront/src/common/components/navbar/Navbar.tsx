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
import { useCart } from "../../../lib/context/CartContext";
import Link from "next/link";

// --- DATA FOR MENUS ---
const categoriesMenu = [
  { title: "Classic", items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"] },
  { title: "Banner", items: ["Item 6", "Item 7", "Item 8", "Item 9", "Item 10"] },
  { title: "List", items: ["Item 11", "Item 12", "Item 13", "Item 14", "Item 15"] },
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
  <div className="w-60 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index}>
          <a href="#" className="justify-between items-center text-gray-600 hover:text-blue-500 font-medium transition-all duration-200 block py-2 px-3 rounded-lg hover:bg-gray-100">
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
  const { state: cartState } = useCart();

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
          <div className="relative flex items-center w-full rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all duration-200">
            <input
              type="text"
              placeholder="I'm searching for..."
              className="flex-1 w-full px-4 py-2.5 text-gray-700 border-none focus:outline-none focus:ring-0"
            />
            <button className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors">
              <HiOutlineSearch className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-1 cursor-pointer">
            <HiOutlineUser className="w-6 h-6 text-blue-400" />
            <span className="text-gray-700">Account</span>
            <span className="font-semibold text-gray-900 ml-1">Login</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <HiOutlineShoppingCart className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-gray-500">4 Items</span>
            <span className="font-semibold text-gray-900 ml-1">Cart</span>
            {cartState.totalItems > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartState.totalItems}
              </div>
            )}
          </Link>
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
      {/* CHANGED: gap-10 to gap-4 for slightly less space between items */}
      <div className="flex items-center gap-4 px-8 py-3 border-t bg-white">
        <button className="p-2 rounded hover:bg-gray-100">
          <HiOutlineViewGrid className="w-6 h-6 text-gray-500" />
        </button>
        
        {/* ADDED: padding, rounded corners, and transition for a better hover effect */}
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">Home</a>
        
        {/* Categories Dropdown */}
        {renderDropdown(
          'categories',
          // ADDED: padding, rounded corners, and transition for a better hover effect
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Categories <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,

          <div className="w-[500px] bg-white rounded-2xl shadow-xl border border-gray-100 p-10 flex gap-12">
            {categoriesMenu.map((col) => (
              <div key={col.title} className="flex-1 min-w-[120px]">
                <div className="text-lg font-bold text-gray-900 mb-4">{col.title}</div>
                <div className="border-b border-gray-200 mb-6" />
                <ul className="space-y-4">
                  {col.items.map((item, i) => {
                    const [label, number] = item.split(' ');
                    return (
                      <li key={i}>
                        <a
                          href="#"
                          className="block px-2 py-1 rounded-lg text-gray-700 hover:text-blue-500 hover:bg-blue-50 font-medium transition-all"
                        >
                          <div className="flex flex-col items-start leading-tight">
                            <span className="text-base">{label}</span>
                            <span className="text-base">{number}</span>
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Products Dropdown */}
        {renderDropdown(
          'products',
          // ADDED: padding, rounded corners, and transition for a better hover effect
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Products <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,
          <SimpleDropdown items={productsMenu} />
        )}
        
        {/* Pages Dropdown */}
        {renderDropdown(
          'pages',
          // ADDED: padding, rounded corners, and transition for a better hover effect
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Pages <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,
          <SimpleDropdown items={pagesMenu} />
        )}

        {/* Blog Dropdown */}
        {renderDropdown(
          'blog',
          // ADDED: padding, rounded corners, and transition for a better hover effect
          <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Blog <HiOutlineChevronDown className="w-4 h-4 ml-1" />
          </a>,
          <SimpleDropdown items={blogMenu} />
        )}

        {/* ADDED: padding, rounded corners, and transition for a better hover effect */}
        <a href="#" className="font-medium text-gray-700 hover:text-blue-500 flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors">
          <HiOutlineTag className="w-5 h-5 mr-1.5 text-gray-500" />Offers
        </a>
      </div>
    </nav>
  );
};

export default Navbar;