"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Hotel, LogIn } from "lucide-react"

export function Navbar() {
  const [isEmployeeMode, setIsEmployeeMode] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-medium">
                Home
              </Link>
              <Link href="/search" className="text-lg font-medium">
                Search
              </Link>
              <Link href="/hotels" className="text-lg font-medium">
                Hotels
              </Link>
              {isEmployeeMode ? (
                <>
                  <Link href="/employee/dashboard" className="text-lg font-medium">
                    Dashboard
                  </Link>
                  <Link href="/employee/rentals" className="text-lg font-medium">
                    Manage Rentals
                  </Link>
                </>
              ) : (
                <Link href="/bookings" className="text-lg font-medium">
                  My Bookings
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Hotel className="h-6 w-6" />
          <span className="font-bold text-xl hidden sm:inline-block">Hotel Booking</span>
        </Link>
        <nav className="hidden md:flex gap-6 flex-1">
          <Link href="/" className="text-sm font-medium">
            Home
          </Link>
          <Link href="/search" className="text-sm font-medium">
            Search
          </Link>
          <Link href="/hotels" className="text-sm font-medium">
            Hotels
          </Link>
          {isEmployeeMode ? (
            <>
              <Link href="/employee/dashboard" className="text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/employee/rentals" className="text-sm font-medium">
                Manage Rentals
              </Link>
            </>
          ) : (
            <Link href="/bookings" className="text-sm font-medium">
              My Bookings
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEmployeeMode(!isEmployeeMode)}>
            {isEmployeeMode ? "Customer Mode" : "Employee Mode"}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/login">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
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

