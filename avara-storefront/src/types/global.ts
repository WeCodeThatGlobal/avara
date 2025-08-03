import { StorePrice } from "@medusajs/types"

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

// Cart types
export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  category: string
  packInfo: string
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}
