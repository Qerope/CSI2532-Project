"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Check, X, DollarSign, Eye, Tv, Wifi, Wind, Coffee, Refrigerator } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  // Map amenity to icon
  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase()
    if (lowerAmenity.includes("tv")) return <Tv className="h-4 w-4" />
    if (lowerAmenity.includes("wifi")) return <Wifi className="h-4 w-4" />
    if (lowerAmenity.includes("air") || lowerAmenity.includes("ac")) return <Wind className="h-4 w-4" />
    if (lowerAmenity.includes("coffee")) return <Coffee className="h-4 w-4" />
    if (lowerAmenity.includes("fridge") || lowerAmenity.includes("refrigerator"))
      return <Refrigerator className="h-4 w-4" />
    return <Check className="h-4 w-4" />
  }

  // Get condition color
  const getConditionColor = (condition: string) => {
    if (condition === "Good Condition") return "bg-green-100 text-green-800 border-green-200"
    if (condition === "In Repair") return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <Card className="overflow-hidden border-none hotel-card-shadow rounded-xl hotel-card-hover">
      <div className="h-48 bg-muted relative">
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className={getConditionColor(room.condition)}>
            {room.condition}
          </Badge>
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
          <div className="text-xl font-bold flex items-center">
            <DollarSign className="h-5 w-5 text-hotel-600" />
            {Number(room.price).toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground ml-1">/night</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1 text-hotel-500" />
              <span className="text-sm">{room.view}</span>
            </div>
            <div className="flex items-center text-sm">
              {room.extendable ? (
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  Extendable
                </span>
              ) : (
                <span className="flex items-center text-red-600">
                  <X className="h-4 w-4 mr-1" />
                  Not extendable
                </span>
              )}
            </div>
          </div>

          {amenitiesList.length > 0 && (
            <div className="mt-2">
              <div className="text-sm text-muted-foreground mb-1">Amenities:</div>
              <div className="flex flex-wrap gap-1">
                <TooltipProvider>
                  {amenitiesList.slice(0, 4).map((amenity, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="flex items-center gap-1 bg-hotel-50">
                          {getAmenityIcon(amenity)}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{amenity}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  {amenitiesList.length > 4 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="bg-hotel-50">
                          +{amenitiesList.length - 4}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          {amenitiesList.slice(4).map((amenity, index) => (
                            <p key={index}>{amenity}</p>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </TooltipProvider>
              </div>
            </div>
          )}

          {room.chain_name && <div className="text-xs text-muted-foreground mt-2">Part of {room.chain_name}</div>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={onReserve}
          className="w-full bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900"
        >
          Reserve Room
        </Button>
      </CardFooter>
    </Card>
  )
}

