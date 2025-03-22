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
                  Discover Luxury
                </span>{" "}
                Across North America
              </h1>
              <p className="mx-auto max-w-[700px] text-hotel-700 md:text-xl">
                Book your perfect stay in five of the most prestigious hotel chains with real-time availability and
                exclusive deals.
              </p>
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

      <section className="py-16 bg-hotel-50 rounded-3xl mt-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-hotel-900">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-hotel-600 to-hotel-800 bg-clip-text text-transparent">
                LuxStay
              </span>
            </h2>
            <p className="mx-auto max-w-[700px] text-hotel-700 md:text-lg mt-4">
              Experience the perfect blend of luxury, convenience, and exceptional service
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none hotel-card-shadow rounded-xl hotel-card-hover">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-hotel-100 flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-hotel-600" />
                </div>
                <CardTitle className="text-xl text-hotel-900">Wide Selection</CardTitle>
                <CardDescription className="text-hotel-600">
                  Choose from five major hotel chains across North America
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-hotel-700">
                  Access to hotels in more than 14 different locations with various classifications from 1-star to
                  5-star.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700 rounded-lg"
                >
                  <Link href="/search">
                    <Building className="h-4 w-4 mr-2" />
                    Explore Hotels
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-none hotel-card-shadow rounded-xl hotel-card-hover">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-hotel-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-hotel-600" />
                </div>
                <CardTitle className="text-xl text-hotel-900">Real-time Availability</CardTitle>
                <CardDescription className="text-hotel-600">See up-to-date room availability</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-hotel-700">
                  Our system provides real-time information on room availability, ensuring you always have the latest
                  information.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700 rounded-lg"
                >
                  <Link href="/search">
                    <Calendar className="h-4 w-4 mr-2" />
                    Check Availability
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card className="border-none hotel-card-shadow rounded-xl hotel-card-hover">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-full bg-hotel-100 flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-hotel-600" />
                </div>
                <CardTitle className="text-xl text-hotel-900">Easy Booking</CardTitle>
                <CardDescription className="text-hotel-600">Simple and secure reservation process</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-hotel-700">
                  Book your room with just a few clicks and manage your reservations easily through our user-friendly
                  interface.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  asChild
                  className="w-full border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700 rounded-lg"
                >
                  <Link href="/reservations">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Reservations
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-hotel-900">Featured Hotel Chains</h2>
            <p className="mx-auto max-w-[700px] text-hotel-700 md:text-lg mt-4">
              Explore our collection of premium hotel chains offering exceptional stays
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Marriott International",
                image: "/placeholder.svg?height=200&width=400",
                stars: 5,
                location: "Global",
                description: "Luxury hotels with exceptional service across North America.",
              },
              {
                name: "Hilton Hotels & Resorts",
                image: "/placeholder.svg?height=200&width=400",
                stars: 4,
                location: "Worldwide",
                description: "Upscale accommodations with world-class amenities.",
              },
              {
                name: "Hyatt Hotels Corporation",
                image: "/placeholder.svg?height=200&width=400",
                stars: 5,
                location: "International",
                description: "Modern luxury with a focus on wellness and comfort.",
              },
            ].map((hotel, index) => (
              <Card key={index} className="overflow-hidden border-none hotel-card-shadow rounded-xl hotel-card-hover">
                <div className="relative">
                  <Image
                    src={hotel.image || "/placeholder.svg"}
                    alt={hotel.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-sm">
                    <MapPin className="h-4 w-4" />
                    {hotel.location}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1">
                    {Array(hotel.stars)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold text-hotel-900">{hotel.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{hotel.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg"
                  >
                    <Link href={`/hotels?chain=${index + 1}`}>View Hotels</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HotelFeatures />
    </div>
  )
}

