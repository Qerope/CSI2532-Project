"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Check } from "lucide-react"

// Base interface matching the database schema exactly
interface Room {
  room_id: number
  hotel_id: number
  price: number
  capacity: number
  view: string
  extendable: boolean
  condition: string
  amenities: string
}

// Interface for API response which may include joined data
interface RoomWithDetails extends Room {
  hotel_name?: string
  hotel_classification?: number
  chain_name?: string
  image?: string
}

interface RoomCardProps {
  room: RoomWithDetails
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
  const amenitiesList = typeof room.amenities === "string" ? room.amenities.split(",").map((item) => item.trim()) : []

  return (
    <Card className="overflow-hidden border-none hotel-card-shadow rounded-xl hotel-card-hover">
      <div className="h-48 bg-muted relative">
        <div className="absolute top-4 right-4">
          <Badge variant={room.condition === "Good Condition" ? "default" : "destructive"}>{room.condition}</Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <Badge variant="outline" className="bg-background/80">
            {room.view}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {room.capacity === 1 ? "Single Room" : room.capacity === 2 ? "Double Room" : "Triple Room"}
            </CardTitle>
            {room.hotel_name && <div className="text-sm text-muted-foreground">{room.hotel_name}</div>}
            {room.hotel_classification !== undefined && (
              <div className="flex mt-1">{renderStars(room.hotel_classification)}</div>
            )}
          </div>
          <div className="text-xl font-bold">${Number(room.price).toFixed(2)}/night</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {room.chain_name && <div>Chain: {room.chain_name}</div>}
            {amenitiesList.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {amenitiesList.slice(0, 3).map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
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
          <div className="flex items-center text-sm text-muted-foreground">
            <Check className="h-4 w-4 mr-1 text-green-500" />
            {room.extendable ? "Extendable room" : "Not extendable"}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onReserve} className="w-full">
          Reserve Room
        </Button>
      </CardFooter>
    </Card>
  )
}

