import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

// Add a function to fetch booking details:
async function getBookingDetails(bookingId: string) {
  try {
    const response = await fetch(`http://localhost:5010/api/bookings/${bookingId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch booking details for booking ${bookingId}`)
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching booking details:", error)
    return null
  }
}

export default function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const roomId = searchParams.roomId as string
  const checkIn = searchParams.checkIn as string
  const checkOut = searchParams.checkOut as string
  const guests = searchParams.guests as string
  const total = searchParams.total as string

  // In a real application, you would fetch the booking details from the database
  // based on a booking ID that would be generated when the booking is created

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
            <CardDescription>Your reservation has been successfully processed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Booking Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Booking ID:</div>
                  <div>
                    BK-
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </div>
                  <div className="text-gray-500">Room ID:</div>
                  <div>{roomId}</div>
                  <div className="text-gray-500">Check-in:</div>
                  <div>{checkIn}</div>
                  <div className="text-gray-500">Check-out:</div>
                  <div>{checkOut}</div>
                  <div className="text-gray-500">Guests:</div>
                  <div>{guests}</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Payment Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Total Amount:</div>
                  <div className="font-bold">${total}</div>
                  <div className="text-gray-500">Payment Status:</div>
                  <div className="text-green-600">Paid</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/bookings">View My Bookings</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

