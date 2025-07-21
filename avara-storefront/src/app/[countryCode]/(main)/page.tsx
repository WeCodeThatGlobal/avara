import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import BannerSection from "@modules/home/components/banner-section"
import TestimonialCarousel from "@modules/home/components/TestimonialCarousel"
import FeaturesSection from "@modules/home/components/FeaturesSection"
import DealOfTheDaySection from "@modules/home/components/DealOfTheDaySection"
import NewArrivalsSection from "@modules/home/components/NewArrivalsSection"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import FeatureCard from "@modules/common/components/FeatureCard"

export const metadata: Metadata = {
  title: "Medusa Next.js Starter Template",
  description:
    "A performant frontend ecommerce starter template with Next.js 15 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

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
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
