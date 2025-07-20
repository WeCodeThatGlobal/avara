import React from "react";

const banners = [
  {
    title: "Tasty Snack & Fast food",
    subtitle: "The flavour of something special",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[#f8ecd7]",
  },
  {
    title: "Fresh Fruits & Vegetables",
    subtitle: "A healthy meal for every one",
    image:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80",
    bg: "bg-[#fbe3e8]",
  },
];

const BannerSection = () => {
  return (
    <section className="w-full py-8 px-4 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row items-center rounded-3xl ${banner.bg} flex-1 p-6 md:p-10 gap-6 shadow-sm`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-40 h-40 object-cover rounded-2xl shadow-md"
            />
            <div className="flex-1 flex flex-col items-start justify-center gap-3">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {banner.title}
              </h3>
              <p className="text-gray-500 text-base mb-2">{banner.subtitle}</p>
              <button className="mt-2 px-6 py-2 border-2 border-gray-400 rounded-md text-base font-medium hover:bg-gray-100 transition">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BannerSection; 