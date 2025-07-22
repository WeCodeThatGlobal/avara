import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#f8f9fb] border-t pt-22 pb-6 px-40 md:px-22 pt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-y-10 md:gap-y-0 md:gap-x-8 mt-10">
        <div className="flex-1 min-w-[220px] flex flex-col gap-4 mb-6 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-800">
              <span className="text-blue-500">Avara</span>
            </span>
          </div>
          <p className="text-gray-500 text-base mb-4">
            BlueBerry is the biggest market of grocery products. Get your daily needs from our store.
          </p>
        </div>
        {/* Category */}
        <div className="flex-1 min-w-[150px] mb-6 md:mb-0">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Category</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Dairy & Milk</li>
            <li>Snack & Spice</li>
            <li>Fast Food</li>
            <li>Juice & Drinks</li>
            <li>Bakery</li>
            <li>Seafood</li>
          </ul>
        </div>
        {/* Company */}
        <div className="flex-1 min-w-[150px] mb-6 md:mb-0">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Company</h3>
          <ul className="space-y-2 text-gray-600">
            <li>About us</li>
            <li>Delivery</li>
            <li>Legal Notice</li>
            <li>Terms & conditions</li>
            <li>Secure payment</li>
            <li>Contact us</li>
          </ul>
        </div>
        {/* Account */}
        <div className="flex-1 min-w-[150px] mb-6 md:mb-0">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Account</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Sign In</li>
            <li>View Cart</li>
            <li>Return Policy</li>
            <li>Become a Vendor</li>
            <li>Affiliate Program</li>
            <li>Payments</li>
          </ul>
        </div>
        {/* Contact */}
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-semibold text-lg mb-3 text-gray-800">Contact</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-400 mt-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              971 Address, City, State, India 111111.
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 01-2 2A19.72 19.72 0 013 5a2 2 0 012-2h2.09a2 2 0 012 1.72c.13.81.36 1.6.68 2.36a2 2 0 01-.45 2.11l-.27.27a16 16 0 006.29 6.29l.27-.27a2 2 0 012.11-.45c.76.32 1.55.55 2.36.68A2 2 0 0121 16.91z" /></svg>
              +91 1234567890
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-4.5" /><path d="M16 3.13a4 4 0 01.88 7.76" /></svg>
              example@email.com
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm gap-2 md:gap-0">
        <span className="text-center md:text-left w-full md:w-auto">
          Copyright © 2025 <span className="text-blue-500 font-semibold">Avara</span> all rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer; 