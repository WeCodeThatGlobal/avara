import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import Navbar from "../common/components/navbar/Navbar"
import Footer from "../common/components/footer/Footer"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <Navbar />
        <main className="relative">{props.children}</main>
        <Footer />
      </body>
    </html>
  )
}
