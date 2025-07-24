import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="w-full min-h-[70vh] bg-[#f8f9fb] flex items-center justify-center px-8 py-12">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex flex-col items-start justify-center gap-6">
          <span className="text-gray-400 text-lg font-medium">Flat 30% Off</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Explore <span className="text-blue-400">Healthy</span>
            <br />& Fresh Fruits
          </h1>
          <Link href="/store">
            <button className="mt-4 px-8 py-3 border-2 border-gray-400 rounded-md text-lg font-medium hover:bg-blue-50 transition">
              Shop Now
            </button>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          {/* Decorative illustration from network */}
          <img
            src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80"
            alt="Healthy & Fresh Fruits"
            className="max-w-full h-auto rounded-3xl shadow-lg"
            style={{ minWidth: 320, maxHeight: 400 }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
