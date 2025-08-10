"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { BsGrid, BsListUl } from 'react-icons/bs';
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi';
import ProductGridSkeletonCard from '@modules/home/components/ProductGridSkeletonCard';
import ProductListSkeletonItem from '@modules/home/components/ProductListSkeletonItem';
import ScrollToTopButton from '@modules/home/components/ScrollToTopButton';
import { ROUTES } from "@lib/api";
import { getApi } from "@lib/api-client";
import ProductCard from "@modules/common/components/ProductCard";
import Link from 'next/link';
import Placeholder from "../../common/components/placeholders/ProductsNotAvailable";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


export default function StorePage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState('grid');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('Featured');
  const maxPrice = 500;

  // Fetch products on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    getApi(ROUTES.PRODUCTS)
      .then((res: { ok: any; json: () => any; }) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: { products: any; }) => {
        setAllProducts(data.products || []);
        setLoading(false);
      })
      .catch((err: { message: any; }) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
    // Fetch categories in parallel (non-blocking UI)
    getApi(ROUTES.CATEGORIES)
      .then((res: any) => (res.ok ? res.json() : Promise.reject(new Error("Failed to fetch categories"))))
      .then((data: any) => {
        setCategories(data.categories || []);
      })
      .catch(() => {});
  }, []);

  const displayProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => p.category && selectedCategories.includes(p.category));
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => p.tags && p.tags.some((tag: { value: string; }) => selectedTags.includes(tag.value)));
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.tags && p.tags.some((tag: { value: string; }) => selectedSizes.includes(tag.value)));
    }

    // Color filter 
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => p.tags && p.tags.some((tag: { value: string; }) => selectedColors.map(c => `color-${c}`).includes(tag.value)));
    }

    // Price filter
    filtered = filtered.filter((p) => {
      if (!p.price) return true;
      const priceNum = parseFloat(String(p.price).replace(/[^0-9.]/g, "")) || 0;
      return priceNum >= priceRange[0] && priceNum <= priceRange[1];
    });

    // Sorting logic
    switch (sortBy) {
      case 'Price: Low to High': {
        const num = (p: any) => parseFloat(String(p.price || '').replace(/[^0-9.]/g, '')) || 0;
        filtered.sort((a, b) => num(a) - num(b));
        break;
      }
      case 'Price: High to Low': {
        const num = (p: any) => parseFloat(String(p.price || '').replace(/[^0-9.]/g, '')) || 0;
        filtered.sort((a, b) => num(b) - num(a));
        break;
      }
      case 'Newest':
        filtered.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        break;
      case 'Featured':
      default:
        break;
    }

    return filtered;
  }, [allProducts, selectedCategories, selectedTags, selectedSizes, selectedColors, priceRange, sortBy]);


  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 9 : 5;
  const totalItems = displayProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems, itemsPerPage]);

  // Get current page products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = displayProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handlers
  const handleColorToggle = (colorName: string) => setSelectedColors(prev => prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]);
  const handleTagToggle = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const handleCategoryToggle = (category: string) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  const handleSizeToggle = (size: string) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const handlePriceChange = (value: number | number[]) => setPriceRange(value as [number, number]);
  const handleSortChange = (sortOption: string) => setSortBy(sortOption);

  const handleCategoryCardClick = (categoryName: string) => {
    setSelectedCategories(prev =>
      prev.length === 1 && prev[0] === categoryName ? [] : [categoryName]
    );
  };

  const categoryCards = [
    { name: 'Clothes', items: '291 items', icon: '👕', bgColor: '#bff7d2ff' },
    { name: 'Bags', items: '49 items', icon: '🎒', bgColor: '#ebe6feff' },
    { name: 'Shoes', items: '485 items', icon: '👟', bgColor: '#FEEFEA' },
    { name: 'Cosmetics', items: '291 items', icon: '💄', bgColor: '#bff7d2ff' },
    { name: 'Electronics', items: '49 items', icon: '📱', bgColor: '#ebe6feff' },
    { name: 'Bakery', items: '08 items', icon: '🧁', bgColor: '#fbefd1ff' },
  ];

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const colors = [
    { name: 'light-blue', hex: '#A0C4FF' }, { name: 'pink', hex: '#FFADAD' }, { name: 'black', hex: '#000000' },
    { name: 'green', hex: '#45FF73' }, { name: 'orange', hex: '#FFD6A5' }, { name: 'magenta', hex: '#F972F7' },
    { name: 'yellow', hex: '#FFD100' }, { name: 'purple', hex: '#BDB2FF' }, { name: 'cyan', hex: '#9BF6FF' },
    { name: 'teal', hex: '#A9FFCB' },
  ];
  const tags = ['Clothes', 'Fruits', 'Snacks', 'Dairy', 'Seafood', 'Toys', 'Perfume', 'Jewelry', 'Bags'];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Category Cards Section */}
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryCards.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryCardClick(category.name)}
              className={`rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center justify-center ${
                selectedCategories[0] === category.name ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
              }`}
              style={{ backgroundColor: category.bgColor }}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.items}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-screen-xl mx-auto p-4 sm:p-6 lg:px-8 gap-8">
        {/* Sidebar */}
        <aside className="w-80 bg-white rounded-2xl p-8 h-fit hidden lg:block">
          {/* Category Filter */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Category</h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={selectedCategories.includes(category.name)} onChange={() => handleCategoryToggle(category.name)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Size</h3>
            <div className="space-y-4">
              {sizeOptions.map((size) => (
                <label key={size} className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => handleSizeToggle(size)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Color</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button key={color.name} onClick={() => handleColorToggle(color.name)} className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color.name) ? 'border-indigo-500' : 'border-transparent'} flex items-center justify-center transition`} style={{ backgroundColor: color.hex }}>
                  {selectedColors.includes(color.name) && <span className="text-white text-sm">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Price</h3>
            <div className="border rounded-lg p-3 text-center mb-5">
              <span className="font-semibold text-gray-800">${priceRange[0]} - ${priceRange[1]}</span>
            </div>
            <Slider
              range
              min={0}
              max={maxPrice}
              value={priceRange}
              onChange={handlePriceChange}
              allowCross={false}
              trackStyle={[{ backgroundColor: '#4f46e5' }]}
              handleStyle={[{ borderColor: '#4f46e5' }, { borderColor: '#4f46e5' }]}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>${0}</span>
              <span>${maxPrice}</span>
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <button key={tag} onClick={() => handleTagToggle(tag)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Section */}
        <div className="flex-1">
          {/* Header with view options and sort */}
          <div className="bg-white rounded-xl p-3 flex justify-between items-center mb-6">
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-gray-500'}`} aria-label="Grid view"><BsGrid className="w-5 h-5" /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-indigo-500 text-white' : 'text-gray-500'}`} aria-label="List view"><BsListUl className="w-5 h-5" /></button>
            </div>
            <div className="relative group">
              <button className="flex items-center border-0 rounded-lg text-sm text-gray-600 font-medium focus:outline-none bg-transparent cursor-pointer px-3 py-2" type="button">
                {sortBy}<span className="ml-2 text-lg"><HiOutlineChevronDown className="w-4 h-4" /></span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
                <ul className="py-1">
                  {['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'].map(option => (
                    <li key={option}>
                      <button onClick={() => handleSortChange(option)} className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(itemsPerPage)].map((_, index) => <ProductGridSkeletonCard key={index} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {[...Array(itemsPerPage)].map((_, index) => <ProductListSkeletonItem key={index} />)}
              </div>
            )
          ) : error ? (
            <Placeholder text="Error loading products. Please try again later." />
          ) : displayProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center w-full bg-white rounded-2xl py-16 px-4">
              <div className="p-5 bg-gray-100 rounded-full mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-500 max-w-xs">We couldn't find any products matching your filters. Please try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
              {currentProducts.map((product) => (
                <Link key={product.id} href={`/store/${product.handle || product.id}`} className="no-underline">
                  <ProductCard {...product} className={viewMode === 'list' ? 'flex gap-4' : ''} />
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-gray-600">
              {totalItems > 0 ? `Showing ${indexOfFirstProduct + 1}-${Math.min(indexOfLastProduct, totalItems)} of ${totalItems} item(s)` : 'Showing 0 items'}
            </p>
            {totalPages > 1 && (
              <nav className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={`w-10 h-10 rounded-lg text-sm font-medium transition ${currentPage === pageNumber ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                      {pageNumber}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  Next <HiOutlineChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}