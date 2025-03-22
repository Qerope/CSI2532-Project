import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import "./globals.css"
import { Hotel } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>EHOTEL - Premium Hotel Booking</title>
        <meta name="description" content="Book luxury rooms across five major hotel chains" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-8 bg-hotel-50">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-hotel-600 to-hotel-800 p-2 rounded-lg">
                    <Hotel className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-xl bg-gradient-to-r from-hotel-600 to-hotel-800 bg-clip-text text-transparent">
                    EHOTEL
                  </span>
                </div>
                <p className="text-center text-sm text-muted-foreground md:text-left">
                  &copy; {new Date().getFullYear()} EHOTEL. All rights reserved.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-hotel-600 hover:text-hotel-800">
                    Terms
                  </a>
                  <a href="#" className="text-hotel-600 hover:text-hotel-800">
                    Privacy
                  </a>
                  <a href="#" className="text-hotel-600 hover:text-hotel-800">
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

