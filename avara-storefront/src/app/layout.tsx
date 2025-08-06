import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import Navbar from "../common/components/navbar/Navbar"
import Footer from "../common/components/footer/Footer"
import { CartProvider } from "../lib/context/CartContext"
import { AuthProvider } from "../lib/context/AuthContext"
import CartNotification from "../modules/common/components/CartNotification"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="relative">{props.children}</main>
            <Footer />
            <CartNotification />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
