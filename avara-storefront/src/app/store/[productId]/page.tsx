"use client";

import { getApi } from "@lib/api-client";
import { ROUTES } from "@lib/api";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

type TabType = 'detail' | 'information' | 'reviews';

// Dummy data for tabs to match the UI in the images
const productDetails = {
  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, voluptatum. Vitae dolores alias repellat eligendi, officiis, exercitationem corporis quisquam delectus cum non recusandae numquam dignissimos molestiae magnam hic natus. Cumque. Any Product types that You want - Simple, Configurable. Downloadable/Digital Products, Virtual Products. Inventory Management with Backordered items. Flatlock seams throughout.",
  information: {
    Weight: '500 g',
    Dimensions: '17 × 15 × 3 cm',
    Color: 'black,yellow,red',
    Brand: 'Wonder Fort',
    'Form Factor': 'Whole',
    Quantity: '1',
    'Container Type': 'Pouch',
    'Shelf Life': '12 Months',
    Ingredients: 'Dalchini, Dhaniya, Badi Elaichi, Laung',
    'Other Features': 'Ingredient Type: Vegetarian'
  },
  reviews: [
    {
      id: 1,
      author: "Mariya Lykra",
      rating: 4,
      comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illa, hic expedita asperiores eas neque cumque impedit quam, placeat laudantium soluta repellendus possimus a distinctio voluptate veritatis nostrum perspiciatis est! Commodi!",
    },
    {
      id: 2,
      author: "Saddika Alard",
      rating: 5,
      comment: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illa, hic expedita asperiores eas neque cumque impedit quam, placeat laudantium soluta repellendus possimus a distinctio voluptate veritatis nostrum perspiciatis est! Commodi!",
    }
  ]
};

// SVG Icon Components
const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
  </svg>
);

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);


export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('250g');
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [mainImage, setMainImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    getApi(`${ROUTES.PRODUCTS}/${params.productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data.product);
        setMainImage(data.product.image);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [params.productId]);

  if (loading) return <div className="min-h-[70vh] flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-[70vh] flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return <div className="min-h-[70vh] flex items-center justify-center">Product not found</div>;

  const discountPercentage = product.original_price && product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;
    
  const productStaticDetails = {
    sku: 'WH12',
    inStock: true,
    attributes: {
        'Closure': 'Hook & Loop',
        'Sole': 'Polyvinyl Chloride',
        'Width': 'Medium',
        'Outer Material': 'A-Grade Standard Quality',
    },
    thumbnails: [
        product.image,
        "https://i.ibb.co/6r2m1c3/product-2.png",
        "https://i.ibb.co/b3b6pQR/product-3.png",
        "https://i.ibb.co/JkC2p18/product-4.png",
    ]
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 font-medium transition-colors">
        <BackArrowIcon />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div>
          <div className="border border-gray-200 rounded-xl p-6 mb-4 bg-white">
            <img 
              src={mainImage} 
              alt={product.title}
              className="w-full h-auto object-contain rounded-lg aspect-square"
            />
          </div>
          <div className="flex justify-center gap-4">
            {productStaticDetails.thumbnails.map((thumb, idx) => (
              <div 
                key={idx} 
                onClick={() => setMainImage(thumb)}
                className={`p-1 rounded-lg cursor-pointer bg-white border-2 transition-colors ${mainImage === thumb ? 'border-indigo-500' : 'border-gray-200 hover:border-indigo-400'}`}
              >
                <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-20 h-20 object-contain rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{product.title}</h1>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-xl ${i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
              ))}
            </div>
            <span className="text-gray-500">| {product.rating_count || 992} Ratings</span>
          </div>

          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quas nihil laboriosam voluptatem ab consectetur dolorum id, soluta sunt at culpa commodi totam quod natus qui!
          </p>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">${product.price}</span>
              {discountPercentage > 0 && (
                <span className="text-xl font-semibold text-red-500">-{discountPercentage}%</span>
              )}
            </div>
            {product.original_price && (
              <span className="text-lg text-gray-500">M.R.P: <span className="line-through">${product.original_price}</span></span>
            )}
          </div>
          
          <div className="flex items-center gap-6 text-sm pt-2">
              <p>SKU: <span className="font-medium text-gray-800">{product.sku || productStaticDetails.sku}</span></p>
              <p>Status: <span className="font-medium text-green-600">In Stock</span></p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 space-y-2">
            {Object.entries(productStaticDetails.attributes).map(([key, value]) => (
                <div key={key} className="flex text-sm">
                    <span className="w-1/3 text-gray-500">{key}</span>
                    <span className="w-2/3 text-gray-800 font-medium">{value}</span>
                </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Weight</h3>
            <div className="flex gap-3">
              {['250g', '500g', '1kg', '2kg'].map((weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedWeight(weight)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedWeight === weight
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  {weight}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors">-</button>
                <span className="w-10 text-center text-lg font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors">+</button>
            </div>
            <button className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              View Cart
            </button>
            <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-20">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {['detail', 'information', 'reviews'].map((tab) => (
                <button
                key={tab}
                onClick={() => setActiveTab(tab as TabType)}
                className={`pb-4 text-base font-semibold capitalize transition-colors ${
                    activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                >
                {tab}
                </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'detail' && (
            <div className="prose max-w-none text-gray-600">
              <p>{productDetails.description}</p>
            </div>
          )}

          {activeTab === 'information' && (
            <div className="space-y-4 max-w-2xl">
              {Object.entries(productDetails.information).map(([key, value]) => (
                <div key={key} className="flex border-b border-gray-100 pb-4">
                  <span className="w-1/3 text-gray-500">{key}</span>
                  <span className="w-2/3 text-gray-900 font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl">
              <div className="space-y-8">
                {productDetails.reviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                     <img src="https://via.placeholder.com/48" alt={review.author} className="w-12 h-12 rounded-full"/>
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <h4 className="font-semibold text-gray-900">{review.author}</h4>
                           <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                 <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                              ))}
                           </div>
                        </div>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                     </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add a Review</h3>
                <p className="text-gray-500 mb-6">Your email address will not be published. Required fields are marked *</p>
                <form className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Your rating *</label>
                        <div className="flex items-center gap-1 text-2xl text-gray-300">
                            {[...Array(5)].map((_,i) => <button key={i} type="button" className="hover:text-yellow-400 transition-colors">★</button>)}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-700">Name *</label>
                        <input type="text" id="name" className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">Email *</label>
                        <input type="email" id="email" className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                    </div>
                    <div>
                        <label htmlFor="review" className="block text-sm font-medium mb-1 text-gray-700">Your review *</label>
                        <textarea id="review" rows={4} className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"></textarea>
                    </div>
                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Submit Review
                    </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}