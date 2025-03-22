import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingForm } from "@/components/booking-form"
import { RoomAmenities } from "@/components/room-amenities"
import { Star, MapPin } from "lucide-react"

export const metadata: Metadata = {
  title: "Room Details - Hotel Booking App",
  description: "View details and book a hotel room.",
}

// Mock function to get room details
async function getRoomDetails(id: string) {
  // In a real application, this would fetch from your database
  return {
    id: Number.parseInt(id),
    hotel_id: 1,
    hotel_name: "Marriott Downtown",
    chain_name: "Marriott International",
    classification: 5,
    price: 299.99,
    capacity: 2,
    view: "Sea View",
    extendable: true,
    condition: "Good Condition",
    amenities: "TV, Air Conditioning, Refrigerator, WiFi, Mini Bar",
    location: "123 Main St, New York, NY 10001",
    description:
      "Luxurious room with a beautiful sea view. This spacious accommodation features modern amenities and elegant decor, perfect for both business and leisure travelers. Enjoy the comfort of premium bedding, a work desk, and a seating area.",
    image: "/placeholder.svg?height=400&width=800",
  }
}

export default async function RoomPage({ params }: { params: { id: string } }) {
  const room = await getRoomDetails(params.id)

  // Render stars based on classification
  const renderStars = (classification: number) => {
    return Array(classification)
      .fill(0)
      .map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{room.hotel_name}</h1>
            <div className="flex items-center mt-2 space-x-2">
              <div className="flex">{renderStars(room.classification)}</div>
              <span className="text-gray-500">|</span>
              <div className="flex items-center text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {room.location}
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <Image
              src={room.image || "/placeholder.svg"}
              alt={`Room at ${room.hotel_name}`}
              width={800}
              height={400}
              className="w-full h-auto"
            />
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Room Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 border rounded-lg mt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="mt-2">{room.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Room Capacity</h4>
                    <p>
                      {room.capacity} {room.capacity === 1 ? "Person" : "People"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">View</h4>
                    <p>{room.view}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Extendable</h4>
                    <p>{room.extendable ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Condition</h4>
                    <p>{room.condition}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="amenities" className="p-4 border rounded-lg mt-2">
              <RoomAmenities amenities={room.amenities} />
            </TabsContent>
            <TabsContent value="policies" className="p-4 border rounded-lg mt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Check-in & Check-out</h3>
                  <p className="mt-1">Check-in: 3:00 PM</p>
                  <p>Check-out: 11:00 AM</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Cancellation Policy</h3>
                  <p className="mt-1">
                    Free cancellation up to 24 hours before check-in. Cancellations made less than 24 hours before
                    check-in are subject to a one-night charge.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Additional Policies</h3>
                  <ul className="list-disc pl-5 mt-1">
                    <li>No smoking</li>
                    <li>No pets allowed</li>
                    <li>Quiet hours from 10:00 PM to 7:00 AM</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold">${room.price.toFixed(2)}</h2>
                  <span className="text-gray-500">per night</span>
                </div>
                <div className="flex items-center">
                  <div className="flex">{renderStars(room.classification)}</div>
                  <span className="ml-2 text-gray-500">{room.chain_name}</span>
                </div>
              </div>

              <BookingForm roomId={room.id} price={room.price} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

