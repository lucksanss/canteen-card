import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CanteenCard - Smart Canteen Billing",
  description: "Modern hostel canteen smart-card billing website",
  keywords: [
    "canteen",
    "billing",
    "smart card",
    "hostel",
    "pos",
    "payment",
  ],
  authors: [{ name: "lucksanss" }],
  creator: "lucksanss",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://canteen-card.vercel.app",
    siteName: "CanteenCard",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="top-right" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
