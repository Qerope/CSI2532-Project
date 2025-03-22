import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HotelFeatures } from "@/components/hotel-features"
import { HotelSearch } from "@/components/hotel-search"
import { Building, MapPin, Star, Search, Calendar, CreditCard } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48 relative">
        <div className="absolute inset-0 bg-hotel-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-hotel-600/10 to-hotel-800/10"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                <span className="bg-gradient-to-r from-hotel-600 to-hotel-800 bg-clip-text text-transparent">
                  E
                </span>{" "}
                Hotel
              </h1>
            </div>
            <div className="space-x-4 mt-6">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg h-12 font-medium"
              >
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Search Rooms
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700 rounded-lg h-12 font-medium"
              >
                <Link href="/employee">Employee Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 relative z-10 -mt-24">
        <div className="container px-4 md:px-6">
          <HotelSearch />
        </div>
      </section>

      <HotelFeatures />
    </div>
  )
}

