import { Metadata } from "next"

export const metadata: Metadata = {}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
