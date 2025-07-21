import React from "react";

const features = [
  {
    icon: "🚚",
    title: "Free Shipping",
    description: "Free shipping on all US order or above $200",
  },
  {
    icon: "🎧",
    title: "24x7 Support",
    description: "Contact us 24 hours a day, 7 days a week",
  },
  {
    icon: "📦",
    title: "30 Days Return",
    description: "Simply return it within 30 days for an exchange",
  },
  {
    icon: "💳",
    title: "Payment Secure",
    description: "Contact us 24 hours a day, 7 days a week",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="w-full flex justify-center py-8 bg-white">
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center transition hover:shadow-lg"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <div className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</div>
            <div className="text-gray-500 text-base">{feature.description}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection; 