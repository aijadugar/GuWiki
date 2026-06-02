import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ગુજરાતી વિકિપીડિયા - 60M+ Speakers. One Knowledge Base.",
  description: "60M+ Speakers. One Knowledge Base.",
  icons: {
    icon: [
      {
        url: "/gu_wiki.jpg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/gu_wiki.jpg",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/gu_wiki.jpg",
        type: "image/svg+xml",
      },
    ],
    apple: "/gu_wiki.jpg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
