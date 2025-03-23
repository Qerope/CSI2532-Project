"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Hotel } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export default function BookingsClientPage() {
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([])
  const [pastBookings, setPastBookings] = useState<any[]>([])
  const [cancelledBookings, setCancelledBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Add a useEffect to fetch bookings:
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)

      try {
        const response = await fetch("http://localhost:5010/api/bookings")

        if (!response.ok) {
          throw new Error("Failed to fetch bookings")
        }

        const data = await response.json()

        // Separate bookings by status
        const upcoming = data.filter((booking: any) => booking.status === "Confirmed")
        const past = data.filter((booking: any) => booking.status === "Completed")
        const cancelled = data.filter((booking: any) => booking.status === "Cancelled")

        setUpcomingBookings(upcoming)
        setPastBookings(past)
        setCancelledBookings(cancelled)
      } catch (error) {
        console.error("Error fetching bookings:", error)
        toast({
          title: "Error",
          description: "Failed to load your bookings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [toast])

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.hotelName}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {booking.location}
            </CardDescription>
          </div>
          <Badge
            variant={
              booking.status === "Confirmed" ? "default" : booking.status === "Completed" ? "outline" : "destructive"
            }
          >
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Booking ID</p>
            <p className="font-medium">{booking.id}</p>
          </div>
          <div>
            <p className="text-gray-500">Room Type</p>
            <p className="font-medium">{booking.roomType}</p>
          </div>
          <div className="flex items-start">
            <CalendarDays className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
            <div>
              <p className="text-gray-500">Check-in</p>
              <p className="font-medium">{booking.checkIn}</p>
            </div>
          </div>
          <div className="flex items-start">
            <CalendarDays className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
            <div>
              <p className="text-gray-500">Check-out</p>
              <p className="font-medium">{booking.checkOut}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Guests</p>
            <p className="font-medium">{booking.guests}</p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-medium">${booking.total.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button asChild>
          <Link href="/search">Book New Room</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(renderBookingCard)
          ) : (
            <div className="text-center py-12">
              <Hotel className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
              <p className="text-gray-500 mb-4">You don't have any upcoming hotel reservations.</p>
              <Button asChild>
                <Link href="/search">Book a Room</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastBookings.length > 0 ? (
            pastBookings.map(renderBookingCard)
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No past bookings</h3>
              <p className="text-gray-500">You don't have any past hotel stays.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map(renderBookingCard)
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No cancelled bookings</h3>
              <p className="text-gray-500">You don't have any cancelled reservations.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

