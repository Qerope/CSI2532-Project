"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Tv, Wind, Refrigerator } from "lucide-react"

// Mock function to simulate fetching rooms from the database
async function fetchRooms(params: any) {
  // In a real application, this would be an API call to your backend
  // which would query the PostgreSQL database

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data
  const mockRooms = [
    {
      id: 1,
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
      location: "New York, NY",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      hotel_id: 2,
      hotel_name: "Hilton Garden Inn",
      chain_name: "Hilton Hotels & Resorts",
      classification: 4,
      price: 199.99,
      capacity: 2,
      view: "City View",
      extendable: true,
      condition: "Good Condition",
      amenities: "TV, Air Conditioning, WiFi",
      location: "Chicago, IL",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      hotel_id: 3,
      hotel_name: "Hyatt Regency",
      chain_name: "Hyatt Hotels Corporation",
      classification: 5,
      price: 349.99,
      capacity: 3,
      view: "Mountain View",
      extendable: false,
      condition: "Good Condition",
      amenities: "TV, Air Conditioning, Refrigerator, WiFi, Jacuzzi",
      location: "Denver, CO",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      hotel_id: 4,
      hotel_name: "Holiday Inn Express",
      chain_name: "InterContinental Hotels Group",
      classification: 3,
      price: 149.99,
      capacity: 2,
      view: "City View",
      extendable: true,
      condition: "Good Condition",
      amenities: "TV, Air Conditioning, WiFi",
      location: "Miami, FL",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      hotel_id: 5,
      hotel_name: "Days Inn",
      chain_name: "Wyndham Hotels & Resorts",
      classification: 2,
      price: 89.99,
      capacity: 1,
      view: "City View",
      extendable: false,
      condition: "Good Condition",
      amenities: "TV, Air Conditioning",
      location: "Los Angeles, CA",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 6,
      hotel_id: 1,
      hotel_name: "Marriott Resort",
      chain_name: "Marriott International",
      classification: 5,
      price: 399.99,
      capacity: 3,
      view: "Sea View",
      extendable: true,
      condition: "Good Condition",
      amenities: "TV, Air Conditioning, Refrigerator, WiFi, Mini Bar, Jacuzzi",
      location: "Miami, FL",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  // Filter rooms based on search parameters
  let filteredRooms = [...mockRooms]

  // Apply filters
  if (params.location) {
    filteredRooms = filteredRooms.filter((room) => room.location.toLowerCase().includes(params.location.toLowerCase()))
  }

  if (params.guests) {
    filteredRooms = filteredRooms.filter((room) => room.capacity >= Number.parseInt(params.guests))
  }

  if (params.minPrice && params.maxPrice) {
    filteredRooms = filteredRooms.filter(
      (room) => room.price >= Number.parseInt(params.minPrice) && room.price <= Number.parseInt(params.maxPrice),
    )
  }

  if (params.chain) {
    filteredRooms = filteredRooms.filter((room) => room.chain_name.toLowerCase().includes(params.chain.toLowerCase()))
  }

  if (params.stars) {
    filteredRooms = filteredRooms.filter((room) => room.classification === Number.parseInt(params.stars))
  }

  if (params.views && params.views.length > 0) {
    const viewsArray = Array.isArray(params.views) ? params.views : [params.views]
    filteredRooms = filteredRooms.filter((room) => viewsArray.some((view) => room.view === view))
  }

  if (params.amenities && params.amenities.length > 0) {
    const amenitiesArray = Array.isArray(params.amenities) ? params.amenities : [params.amenities]
    filteredRooms = filteredRooms.filter((room) => amenitiesArray.every((amenity) => room.amenities.includes(amenity)))
  }

  return filteredRooms
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
        {amenityList.includes("WiFi") && <Wifi className="h-4 w-4" />}
        {amenityList.includes("TV") && <Tv className="h-4 w-4" />}
        {amenityList.includes("Air Conditioning") && <Wind className="h-4 w-4" />}
        {amenityList.includes("Refrigerator") && <Refrigerator className="h-4 w-4" />}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">No rooms found</h2>
        <p className="text-gray-500">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{rooms.length} rooms found</h2>
        <div className="text-sm text-gray-500">Showing all available rooms</div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3">
                <Image
                  src={room.image || "/placeholder.svg"}
                  alt={`Room at ${room.hotel_name}`}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{room.hotel_name}</h3>
                    <p className="text-gray-500">{room.location}</p>
                    <div className="flex mt-1">{renderStars(room.classification)}</div>
                  </div>
                  <Badge variant="outline">{room.chain_name}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <div>
                    <p className="text-sm font-medium">Room Capacity</p>
                    <p>
                      {room.capacity} {room.capacity === 1 ? "Person" : "People"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">View</p>
                    <p>{room.view}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Extendable</p>
                    <p>{room.extendable ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Condition</p>
                    <p>{room.condition}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-1">Amenities</p>
                  <div className="flex items-center space-x-1">
                    {renderAmenityIcons(room.amenities)}
                    <span className="text-sm text-gray-500 ml-2">{room.amenities}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold">${room.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">per night</p>
                  </div>
                  <Button asChild>
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

