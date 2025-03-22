"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bed, Check, Star } from "lucide-react"

interface RoomProps {
  room: {
    room_id: number
    hotel_id: number
    price: number
    capacity: number
    view: string
    extendable: boolean
    condition: string
    amenities: string
    hotel_name?: string
    hotel_classification?: number
    chain_name?: string
  }
  onReserve: () => void
}

export function RoomCard({ room, onReserve }: RoomProps) {
  const amenitiesList = room.amenities.split(",").map((item) => item.trim())

  const getCapacityText = (capacity: number) => {
    switch (capacity) {
      case 1:
        return "Single Room"
      case 2:
        return "Double Room"
      case 3:
        return "Triple Room"
      default:
        return `${capacity} Person Room`
    }
  }

  const renderStars = (classification?: number) => {
    if (!classification) return null

    return (
      <div className="flex items-center">
        {Array.from({ length: classification }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <Bed className="h-16 w-16 text-muted-foreground/50" />
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={room.condition === "Good Condition" ? "default" : "destructive"}>{room.condition}</Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-background/80">
            {room.view}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{getCapacityText(room.capacity)}</CardTitle>
            <CardDescription>
              {room.hotel_name || `Hotel ID: ${room.hotel_id}`}
              {renderStars(room.hotel_classification)}
            </CardDescription>
          </div>
          <div className="text-xl font-bold">${room.price}/night</div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            {room.chain_name && <div>Chain: {room.chain_name}</div>}
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
          </div>
          {room.extendable && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Check className="h-4 w-4 mr-1 text-green-500" />
              Extendable room
            </div>
          )}
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

