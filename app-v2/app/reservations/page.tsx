"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, X } from "lucide-react"

// Interface matching the database schema exactly
interface Reservation {
  reservation_id: number
  guest_id: number
  room_id: number
  start_date: string
  end_date: string
  status: string
}

// Interface for API response which may include joined data
interface ReservationWithDetails extends Reservation {
  room_details?: {
    price: number
    capacity: number
    view: string
    hotel_name?: string
  }
}

export default function ReservationsPage() {
  const { toast } = useToast()
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // In a real app, you would filter by the logged-in guest's ID
        const response = await fetch("http://localhost:5010/api/reservations")
        if (response.ok) {
          const data = await response.json()
          setReservations(data)
        } else {
          throw new Error("Failed to fetch reservations")
        }
      } catch (error) {
        console.error("Error fetching reservations:", error)
        toast({
          title: "Error",
          description: "Failed to load your reservations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [toast])

  const handleCancelReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/reservation/${reservationId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReservations(reservations.filter((res) => res.reservation_id !== reservationId))
        toast({
          title: "Reservation cancelled",
          description: "Your reservation has been cancelled successfully.",
        })
      } else {
        throw new Error("Failed to cancel reservation")
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error)
      toast({
        title: "Error",
        description: "Failed to cancel your reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your reservations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">You don't have any reservations yet.</p>
          <Button className="mt-4" onClick={() => (window.location.href = "/search")}>
            Search for Rooms
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <Card key={reservation.reservation_id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Reservation #{reservation.reservation_id}</CardTitle>
                    <CardDescription>
                      Room #{reservation.room_id}
                      {reservation.room_details?.hotel_name && <span> at {reservation.room_details.hotel_name}</span>}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      reservation.status === "Booked"
                        ? "default"
                        : reservation.status === "Checked-in"
                          ? "success"
                          : "destructive"
                    }
                  >
                    {reservation.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(new Date(reservation.start_date), "MMM d, yyyy")} -{" "}
                      {format(new Date(reservation.end_date), "MMM d, yyyy")}
                    </span>
                  </div>

                  {reservation.room_details && (
                    <>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {Math.ceil(
                            (new Date(reservation.end_date).getTime() - new Date(reservation.start_date).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          nights
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="font-medium">Room Details:</div>
                        <div className="text-sm text-muted-foreground">
                          <div>Price: ${reservation.room_details.price}/night</div>
                          <div>
                            Capacity: {reservation.room_details.capacity}{" "}
                            {reservation.room_details.capacity === 1 ? "person" : "people"}
                          </div>
                          <div>View: {reservation.room_details.view}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {reservation.status === "Booked" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleCancelReservation(reservation.reservation_id)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Reservation
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

