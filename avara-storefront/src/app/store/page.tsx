"use client";
import React, { useState, useEffect } from 'react';
import { BsGrid, BsListUl } from 'react-icons/bs';
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi';
import ProductGridSkeletonCard from '@modules/home/components/ProductGridSkeletonCard';
import ProductListSkeletonItem from '@modules/home/components/ProductListSkeletonItem';
import ScrollToTopButton from '@modules/home/components/ScrollToTopButton';
import { ROUTES, getApiUrl } from "@lib/api";
import { getApi } from "@lib/api-client";
import ProductCard from "@modules/common/components/ProductCard";
import Link from 'next/link';

export default function StorePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState('grid');
  const [selectedColors, setSelectedColors] = useState<string[]>(['light-blue']);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Clothes']);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(250);
  const maxPrice = 500;

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = viewMode === 'grid' ? 9 : 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const categoryCards = [
    { name: 'Clothes', items: '291 items', icon: '👕', bgColor: '#bff7d2ff' },
    { name: 'Bags', items: '49 items', icon: '🎒', bgColor: '#ebe6feff' },
    { name: 'Shoes', items: '485 items', icon: '👟', bgColor: '#FEEFEA' },
    { name: 'Cosmetics', items: '291 items', icon: '💄', bgColor: '#bff7d2ff' },
    { name: 'Electronics', items: '49 items', icon: '📱', bgColor: '#ebe6feff' },
    { name: 'Bakery', items: '08 items', icon: '🧁', bgColor: '#fbefd1ff' },
  ];

  const sidebarCategories = ['Clothes', 'Bags', 'Shoes', 'Cosmetics', 'Electrics', 'Phone', 'Watch'];
  const weightOptions = ['200gm Pack', '500gm Pack', '1kg Pack', '5kg Pack', '10kg Pack'];
  const colors = [
    { name: 'light-blue', hex: '#A0C4FF' }, { name: 'pink', hex: '#FFADAD' }, { name: 'black', hex: '#000000' },
    { name: 'green', hex: '#45FF73' }, { name: 'orange', hex: '#FFD6A5' }, { name: 'magenta', hex: '#F972F7' },
    { name: 'yellow', hex: '#FFD100' }, { name: 'purple', hex: '#BDB2FF' }, { name: 'cyan', hex: '#9BF6FF' },
    { name: 'teal', hex: '#A9FFCB' },
  ];
  const tags = ['Clothes', 'Fruits', 'Snacks', 'Dairy', 'Seafood', 'Toys', 'Perfume', 'Jewelry', 'Bags'];

  const handleColorToggle = (colorName: string) => setSelectedColors(prev => prev.includes(colorName) ? [] : [colorName]);
  const handleTagToggle = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const handleCategoryToggle = (category: string) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  const handleWeightToggle = (weight: string) => setSelectedWeights(prev => prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => setPriceRange(parseInt(e.target.value));

  // Fetch products on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    getApi(ROUTES.PRODUCTS)
      .then((res: { ok: any; json: () => any; }) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data: { products: any; total: number }) => {
        setProducts(data.products || []);
        setLoading(false);
        // Update total items for pagination
        setTotalItems(data.total);
      })
      .catch((err: { message: any; }) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  // Get current page products
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Category Cards Section */}
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          {categoryCards.map((category, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center justify-center`}
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
              {sidebarCategories.map((category) => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer">
                  <div className="flex items-center h-5">
                    <input id={category} name="category" type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryToggle(category)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Weight Filter */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Weight</h3>
            <div className="space-y-4">
              {weightOptions.map((weight) => (
                <label key={weight} className="flex items-center space-x-3 cursor-pointer">
                  <div className="flex items-center h-5">
                    <input id={weight} name="weight" type="checkbox" checked={selectedWeights.includes(weight)} onChange={() => handleWeightToggle(weight)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{weight}</span>
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
            <div className="border rounded-lg p-3 text-center mb-5"><span className="font-semibold text-gray-800">$0 - ${priceRange}</span></div>
            <input type="range" min="0" max={maxPrice} value={priceRange} onChange={handlePriceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-indigo" />
            <div className="flex justify-between mt-2 text-sm text-gray-500"><span>${0}</span><span>${maxPrice}</span></div>
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
              <button className="flex items-center border-0 rounded-lg text-sm text-gray-600 font-medium focus:outline-none bg-transparent cursor-pointer px-3 py-2" type="button">Sort by<span className="ml-2 text-lg"><HiOutlineChevronDown className="w-4 h-4" /></span></button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-10">
                <ul className="py-1">
                  {['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'].map(option => (
                    <li key={option}><button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">{option}</button></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(itemsPerPage)].map((_, index) => (
                  <ProductGridSkeletonCard key={index} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {[...Array(itemsPerPage)].map((_, index) => (
                  <ProductListSkeletonItem key={index} />
                ))}
              </div>
            )
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No products found.</div>
          ) : (
            <div className={viewMode === 'grid' ?
              "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" :
              "flex flex-col gap-6"
            }>
              {currentProducts.map((product) => {
                return (
                  <Link
                    key={product.id}
                    href={`/store/${product.handle || product.id}`} // Add fallback to handle
                    className="no-underline"
                  >
                    <ProductCard
                      key={product.id}
                      {...product}
                      className={viewMode === 'list' ? 'flex gap-4' : ''}
                    />
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-8">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, totalItems)} of {totalItems} item(s)
            </p>
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
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
}