import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Advay Anand | Full Stack Web Developer",
  description: "Portfolio website of Advay Anand, a Full Stack Web Developer specializing in modern web applications.",
  keywords: "Advay Anand, Full Stack Web Developer, Web Development, Portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}



import './globals.css'
