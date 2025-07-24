import { Button } from "@medusajs/ui"
import { ArrowLeft } from "@medusajs/icons"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Page not found</h1>
      <p className="text-small-regular text-ui-fg-muted">
        The cart you are looking for does not exist.
      </p>
      <div className="flex items-center gap-x-2 text-small-regular text-ui-fg-muted">
        <Link href="/">
          <Button variant="secondary" size="small">
            <ArrowLeft />
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  )
} 