"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, DollarSign, Users, Eye, Check } from "lucide-react"

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
  image?: string
}

interface RoomCardProps {
  room: Room
  onReserve: () => void
}

export function RoomCard({ room, onReserve }: RoomCardProps) {
  // Function to render stars based on classification
  const renderStars = (count = 0) => {
    return Array(count)
      .fill(0)
      .map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
  }

  // Parse amenities if it's a string
  const amenitiesList =
    typeof room.amenities === "string"
      ? room.amenities.split(",").map((item) => item.trim())
      : Array.isArray(room.amenities)
        ? room.amenities
        : []

  return (
    <Card className="overflow-hidden border-none hotel-card-shadow rounded-xl hotel-card-hover">
      <div className="relative">
        <Image
          src={room.image || "/placeholder.svg?height=200&width=400"}
          alt={`Room at ${room.hotel_name || "Hotel"}`}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-hotel-600 hover:bg-hotel-700 text-white border-none">{room.view}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{room.hotel_name || `Room #${room.room_id}`}</CardTitle>
        {room.hotel_classification && <div className="flex mt-1">{renderStars(room.hotel_classification)}</div>}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-hotel-500" />
              <span className="text-sm">
                {room.capacity} {room.capacity === 1 ? "Person" : "People"}
              </span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1 text-hotel-500" />
              <span className="text-sm">{room.view}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-hotel-500" />
              <span className="text-sm">{room.extendable ? "Extendable" : "Not Extendable"}</span>
            </div>
            <div className="flex items-center">
              <Check className="h-4 w-4 mr-1 text-hotel-500" />
              <span className="text-sm">{room.condition}</span>
            </div>
          </div>
          {amenitiesList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {amenitiesList.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {amenitiesList.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{amenitiesList.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="text-2xl font-bold text-hotel-900 flex items-center">
          <DollarSign className="h-5 w-5 text-hotel-600" />
          {(Number(room.price) || 0).toFixed(2)}
        </div>
        <Button
          onClick={onReserve}
          className="bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white"
        >
          Reserve
        </Button>
      </CardFooter>
    </Card>
  )
}

