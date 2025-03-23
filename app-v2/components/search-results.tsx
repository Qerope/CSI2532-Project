"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Tv, Wind, Refrigerator, MapPin, Users, DollarSign, Eye, Search } from "lucide-react"

// Replace the fetchRooms function with:
async function fetchRooms(params: any) {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams()

    // Add all search parameters to the query
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => queryParams.append(key, v))
      } else if (value) {
        queryParams.append(key, value)
      }
    })

    const response = await fetch(`http://localhost:5010/api/rooms?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch rooms")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return []
  }
}

export function SearchResults({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true)
      const results = await fetchRooms(searchParams)
      setRooms(results)
      setLoading(false)
    }

    loadRooms()
  }, [searchParams])

  // Render stars based on classification
  const renderStars = (classification: number) => {
    return Array(classification)
      .fill(0)
      .map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
  }

  // Render amenity icons
  const renderAmenityIcons = (amenities: string) => {
    const amenityList = amenities.split(", ")
    return (
      <div className="flex space-x-2">
        {amenityList.includes("WiFi") && <Wifi className="h-4 w-4 text-hotel-500" />}
        {amenityList.includes("TV") && <Tv className="h-4 w-4 text-hotel-500" />}
        {amenityList.includes("Air Conditioning") && <Wind className="h-4 w-4 text-hotel-500" />}
        {amenityList.includes("Refrigerator") && <Refrigerator className="h-4 w-4 text-hotel-500" />}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-600"></div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 bg-hotel-50 rounded-xl border border-hotel-100">
        <div className="bg-white rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 shadow-md">
          <Search className="h-8 w-8 text-hotel-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-hotel-800">No rooms found</h2>
        <p className="text-hotel-600">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-hotel-50 to-hotel-100 p-4 rounded-xl">
        <h2 className="text-xl font-semibold text-hotel-800 flex items-center">
          <Search className="h-5 w-5 mr-2 text-hotel-600" />
          {rooms.length} rooms found
        </h2>
        <div className="text-sm text-hotel-600">Showing all available rooms</div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden border-none hotel-card-shadow rounded-xl hotel-card-hover">
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <Image
                  src={room.image || "/placeholder.svg"}
                  alt={`Room at ${room.hotel_name}`}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 text-hotel-700 border-hotel-200 font-medium">
                    {room.chain_name}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-hotel-600 hover:bg-hotel-700 text-white border-none">{room.view}</Badge>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-hotel-900">{room.hotel_name}</h3>
                    <p className="text-hotel-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {room.location}
                    </p>
                    <div className="flex mt-1">{renderStars(room.classification)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <p className="text-sm font-medium text-hotel-700 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-hotel-500" />
                      Room Capacity
                    </p>
                    <p className="text-hotel-900">
                      {room.capacity} {room.capacity === 1 ? "Person" : "People"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-hotel-700 flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-hotel-500" />
                      View
                    </p>
                    <p className="text-hotel-900">{room.view}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-hotel-700">Extendable</p>
                    <p className="text-hotel-900">{room.extendable ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-hotel-700">Condition</p>
                    <p className="text-hotel-900">{room.condition}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-hotel-700 mb-1">Amenities</p>
                  <div className="flex items-center space-x-1">
                    {renderAmenityIcons(room.amenities)}
                    <span className="text-sm text-hotel-600 ml-2">{room.amenities}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold text-hotel-900 flex items-center">
                      <DollarSign className="h-5 w-5 text-hotel-600" />
                      {Number(room.price).toFixed(2)}
                    </p>
                    <p className="text-sm text-hotel-600">per night</p>
                  </div>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg"
                  >
                    <Link href={`/rooms/${room.id}`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

