import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import BannerSection from "@modules/home/components/banner-section"
import TestimonialCarousel from "@modules/home/components/TestimonialCarousel"
import FeaturesSection from "@modules/home/components/FeaturesSection"
import DealOfTheDaySection from "@modules/home/components/DealOfTheDaySection"
import NewArrivalsSection from "@modules/home/components/NewArrivalsSection"
import FeatureCard from "@modules/common/components/FeatureCard"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home() {

  return (
    <>
      <Hero />
      <DealOfTheDaySection />
      <BannerSection />
      <div className="flex justify-center py-8">
        <FeatureCard
          title="Fresh & Organic Vegetables"
        />
      </div>
      <NewArrivalsSection />
      <FeaturesSection />
      <TestimonialCarousel />
    </>
  )
} 