"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Hotel, LogIn, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function Navbar() {
  const [isEmployeeMode, setIsEmployeeMode] = useState(false)
  const { setTheme, theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="border-r border-hotel-200">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-gradient-to-r from-hotel-600 to-hotel-800 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl">E-Hotel</span>
            </div>
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-lg font-medium hover:text-hotel-600 transition-colors">
                Home
              </Link>
              <Link href="/search" className="text-lg font-medium hover:text-hotel-600 transition-colors">
                Search
              </Link>
              <Link href="/hotels" className="text-lg font-medium hover:text-hotel-600 transition-colors">
                Hotels
              </Link>
              {isEmployeeMode ? (
                <>
                  <Link
                    href="/employee/dashboard"
                    className="text-lg font-medium hover:text-hotel-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link href="/employee/rentals" className="text-lg font-medium hover:text-hotel-600 transition-colors">
                    Manage Rentals
                  </Link>
                  <Link
                    href="/employee/archives"
                    className="text-lg font-medium hover:text-hotel-600 transition-colors"
                  >
                    Archives
                  </Link>
                </>
              ) : (
                <Link href="/bookings" className="text-lg font-medium hover:text-hotel-600 transition-colors">
                  My Bookings
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="bg-gradient-to-r from-hotel-600 to-hotel-800 p-2 rounded-lg">
            <Hotel className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block bg-gradient-to-r from-hotel-600 to-hotel-800 bg-clip-text text-transparent">
            E-Hotel
          </span>
        </Link>
        <nav className="hidden md:flex gap-6 flex-1">
          <Link href="/" className="text-sm font-medium hover:text-hotel-600 transition-colors">
            Home
          </Link>
          <Link href="/search" className="text-sm font-medium hover:text-hotel-600 transition-colors">
            Search
          </Link>
          <Link href="/hotels" className="text-sm font-medium hover:text-hotel-600 transition-colors">
            Hotels
          </Link>
          {isEmployeeMode ? (
            <>
              <Link href="/employee/dashboard" className="text-sm font-medium hover:text-hotel-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/employee/rentals" className="text-sm font-medium hover:text-hotel-600 transition-colors">
                Manage Rentals
              </Link>
              <Link href="/employee/archives" className="text-sm font-medium hover:text-hotel-600 transition-colors">
                Archives
              </Link>
            </>
          ) : (
            <Link href="/bookings" className="text-sm font-medium hover:text-hotel-600 transition-colors">
              My Bookings
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEmployeeMode(!isEmployeeMode)}
            className="border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700"
          >
            {isEmployeeMode ? "Customer Mode" : "Employee Mode"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700"
          >
            <Link href="/employee">Employee Portal</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full hover:bg-hotel-100 hover:text-hotel-700"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-hotel-100 hover:text-hotel-700">
            <Link href="/login">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-hotel-100 hover:text-hotel-700">
            <Link href="/profile">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

