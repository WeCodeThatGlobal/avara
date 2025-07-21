import React from 'react';

interface FullScreenFeatureCardProps {
  backgroundImage?: string;
  discount?: string;
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const FullScreenFeatureCard: React.FC<FullScreenFeatureCardProps> = ({
  backgroundImage = "https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg?_gl=1*1cjg57v*_ga*MTg2MDAyMzMzNC4xNzUzMTA2Mjk1*_ga_8JE65Q40S6*czE3NTMxMDYyOTUkbzEkZzEkdDE3NTMxMDYzNjUkajU5JGwwJGgw",
  discount = "25% Off",
  title = "Fresh & Organic vegetables",
  buttonText = "Shop Now",
}) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>

      {/* Custom shaped container with rounded corners */}
      <div className="absolute bottom-0 right-20 max-w-sm">
        <div className="relative bg-white rounded-t-2xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-6 pb-12">
            <p className="text-indigo-600 font-semibold text-2xl">{discount}</p>
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <button
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg text-lg transition"
            >
              {buttonText}
            </button>
          </div>
          
          {/* Custom bottom corners using pseudo-elements */}
          <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-white rounded-full"></div>
          
          {/* Hide parts of the circles to create inverted curves */}
          <div className="absolute bottom-0 left-0 w-6 h-6 bg-transparent"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-transparent"></div>
        </div>
        
        {/* Alternative approach using border-radius with pseudo-elements for more accurate curves */}
        <div className="hidden">
          <div className="relative bg-white rounded-t-xl shadow-xl">
            <div className="p-8 space-y-6">
              <p className="text-indigo-600 font-semibold text-2xl">{discount}</p>
              <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
              <button
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg text-lg transition"
              >
                {buttonText}
              </button>
            </div>
            
            {/* Custom bottom corners using pseudo-elements */}
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-transparent">
              <div className="w-full h-full bg-white rounded-br-full"></div>
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-transparent">
              <div className="w-full h-full bg-white rounded-bl-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG approach for most accurate custom shape */}
      <div className="hidden absolute bottom-0 right-20 max-w-sm">
        <svg width="320" height="280" viewBox="0 0 320 280" className="drop-shadow-xl">
          <defs>
            <path id="customShape" d="M 20 0 L 300 0 Q 320 0 320 20 L 320 230 Q 320 250 300 250 L 270 250 Q 250 250 250 230 Q 250 210 270 210 L 50 210 Q 30 210 30 230 Q 30 250 50 250 L 20 250 Q 0 250 0 230 L 0 20 Q 0 0 20 0 Z"/>
          </defs>
          <path d="M 20 0 L 300 0 Q 320 0 320 20 L 320 230 Q 320 250 300 250 L 270 250 Q 250 250 250 230 Q 250 210 270 210 L 50 210 Q 30 210 30 230 Q 30 250 50 250 L 20 250 Q 0 250 0 230 L 0 20 Q 0 0 20 0 Z" 
                fill="white"/>
        </svg>
        
        <div className="absolute top-0 left-0 p-8 space-y-6">
          <p className="text-indigo-600 font-semibold text-2xl">{discount}</p>
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <button
            className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-lg text-lg transition"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenFeatureCard;