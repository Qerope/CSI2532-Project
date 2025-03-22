import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingForm } from "@/components/booking-form"
import { RoomAmenities } from "@/components/room-amenities"
import { Star, MapPin, DollarSign, Users, Eye, Check, Clock, AlertCircle, FileText, Ban, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Room Details - LuxStay",
  description: "View details and book a hotel room.",
}

// Updated interface to match database schema
interface Room {
  room_id: number
  hotel_id: number
  price: number
  capacity: number
  view: string
  extendable: boolean
  condition: string
  amenities: string
  // Additional fields from API response
  hotel_name?: string
  hotel_classification?: number
  chain_name?: string
  location?: string
  description?: string
  image?: string
}

// Function to get room details
async function getRoomDetails(id: string): Promise<Room> {
  const response = await fetch(`http://localhost:5010/api/rooms/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch room details for room ${id}`)
  }

  return response.json()
}

export default async function RoomPage({ params }: { params: { id: string } }) {
  const room = await getRoomDetails(params.id)

  // Render stars based on classification
  const renderStars = (classification = 0) => {
    return Array(classification)
      .fill(0)
      .map((_, i) => <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-hotel-900">{room.hotel_name || `Room #${room.room_id}`}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex">{renderStars(room.hotel_classification)}</div>
              {room.chain_name && (
                <Badge variant="outline" className="bg-hotel-50 text-hotel-700 border-hotel-200">
                  {room.chain_name}
                </Badge>
              )}
              {room.location && (
                <div className="flex items-center text-hotel-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {room.location}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden hotel-card-shadow relative">
            <Image
              src={room.image || "/placeholder.svg?height=400&width=800"}
              alt={`Room at ${room.hotel_name || "Hotel"}`}
              width={800}
              height={400}
              className="w-full h-auto"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-hotel-600 hover:bg-hotel-700 text-white border-none">{room.view}</Badge>
            </div>
          </div>

          <Tabs defaultValue="details" className="mt-8">
            <TabsList className="grid w-full grid-cols-3 bg-hotel-50 p-1 rounded-xl">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:text-hotel-700 data-[state=active]:shadow-sm rounded-lg"
              >
                Room Details
              </TabsTrigger>
              <TabsTrigger
                value="amenities"
                className="data-[state=active]:bg-white data-[state=active]:text-hotel-700 data-[state=active]:shadow-sm rounded-lg"
              >
                Amenities
              </TabsTrigger>
              <TabsTrigger
                value="policies"
                className="data-[state=active]:bg-white data-[state=active]:text-hotel-700 data-[state=active]:shadow-sm rounded-lg"
              >
                Policies
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="details"
              className="p-6 border border-hotel-100 rounded-xl mt-4 bg-white hotel-card-shadow"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-hotel-800">Description</h3>
                  <p className="mt-2 text-hotel-700">{room.description || "Luxurious room with modern amenities."}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-hotel-50 p-4 rounded-lg">
                    <h4 className="font-medium text-hotel-700 flex items-center mb-2">
                      <Users className="h-4 w-4 mr-2 text-hotel-500" />
                      Room Capacity
                    </h4>
                    <p className="text-hotel-900">
                      {room.capacity} {room.capacity === 1 ? "Person" : "People"}
                    </p>
                  </div>
                  <div className="bg-hotel-50 p-4 rounded-lg">
                    <h4 className="font-medium text-hotel-700 flex items-center mb-2">
                      <Eye className="h-4 w-4 mr-2 text-hotel-500" />
                      View
                    </h4>
                    <p className="text-hotel-900">{room.view}</p>
                  </div>
                  <div className="bg-hotel-50 p-4 rounded-lg">
                    <h4 className="font-medium text-hotel-700 flex items-center mb-2">
                      <Check className="h-4 w-4 mr-2 text-hotel-500" />
                      Extendable
                    </h4>
                    <p className="text-hotel-900">{room.extendable ? "Yes" : "No"}</p>
                  </div>
                  <div className="bg-hotel-50 p-4 rounded-lg">
                    <h4 className="font-medium text-hotel-700 flex items-center mb-2">
                      <Check className="h-4 w-4 mr-2 text-hotel-500" />
                      Condition
                    </h4>
                    <p className="text-hotel-900">{room.condition}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="amenities"
              className="p-6 border border-hotel-100 rounded-xl mt-4 bg-white hotel-card-shadow"
            >
              <RoomAmenities amenities={room.amenities} />
            </TabsContent>
            <TabsContent
              value="policies"
              className="p-6 border border-hotel-100 rounded-xl mt-4 bg-white hotel-card-shadow"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-hotel-800 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-hotel-500" />
                    Check-in & Check-out
                  </h3>
                  <div className="mt-3 bg-hotel-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-hotel-600">Check-in</p>
                        <p className="font-medium text-hotel-900">3:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm text-hotel-600">Check-out</p>
                        <p className="font-medium text-hotel-900">11:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-hotel-800 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-hotel-500" />
                    Cancellation Policy
                  </h3>
                  <div className="mt-3 bg-hotel-50 p-4 rounded-lg">
                    <p className="text-hotel-700">
                      Free cancellation up to 24 hours before check-in. Cancellations made less than 24 hours before
                      check-in are subject to a one-night charge.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-hotel-800 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-hotel-500" />
                    Additional Policies
                  </h3>
                  <ul className="list-none pl-0 mt-3 space-y-2">
                    <li className="flex items-center bg-hotel-50 p-3 rounded-lg">
                      <Ban className="h-4 w-4 mr-2 text-hotel-500" />
                      <span className="text-hotel-700">No smoking</span>
                    </li>
                    <li className="flex items-center bg-hotel-50 p-3 rounded-lg">
                      <Ban className="h-4 w-4 mr-2 text-hotel-500" />
                      <span className="text-hotel-700">No pets allowed</span>
                    </li>
                    <li className="flex items-center bg-hotel-50 p-3 rounded-lg">
                      <Volume2 className="h-4 w-4 mr-2 text-hotel-500" />
                      <span className="text-hotel-700">Quiet hours from 10:00 PM to 7:00 AM</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-none hotel-card-shadow rounded-xl overflow-hidden sticky top-24">
            <div className="bg-gradient-to-r from-hotel-600 to-hotel-800 p-6 text-white">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold flex items-center">
                  <DollarSign className="h-6 w-6 mr-1" />
                  {Number(room.price).toFixed(2)}
                </h2>
                <span>per night</span>
              </div>
              <div className="flex items-center">
                <div className="flex">{renderStars(room.hotel_classification)}</div>
                {room.chain_name && <span className="ml-2">{room.chain_name}</span>}
              </div>
            </div>
            <CardContent className="p-6">
              <BookingForm roomId={room.room_id} price={Number(room.price)} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

