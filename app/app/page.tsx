import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HotelFeatures } from "@/components/hotel-features"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Book Your Perfect Stay Across North America
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Discover and book rooms in five of the most well-known hotel chains with real-time availability.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/search">
                <Button size="lg">Search Rooms</Button>
              </Link>
              <Link href="/employee">
                <Button variant="outline" size="lg">
                  Employee Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Wide Selection</CardTitle>
                <CardDescription>Choose from five major hotel chains across North America</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access to hotels in more than 14 different locations with various classifications from 1-star to
                  5-star.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/search">
                  <Button variant="outline">Explore Hotels</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Real-time Availability</CardTitle>
                <CardDescription>See up-to-date room availability</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our system provides real-time information on room availability, ensuring you always have the latest
                  information.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/search">
                  <Button variant="outline">Check Availability</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>Simple and secure reservation process</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Book your room with just a few clicks and manage your reservations easily through our user-friendly
                  interface.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/reservations">
                  <Button variant="outline">Manage Reservations</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <HotelFeatures />
    </div>
  )
}

