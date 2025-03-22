"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Building, DollarSign, Wifi, Coffee } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Updated interface to match database schema
interface Hotel {
  hotel_id: number
  chain_id: number
  name: string
  classification: number
  num_rooms: number
  address: string
  contact_email: string
  telephone: string
  chain_name?: string
  // Additional fields from API response
  rooms_available?: number
  price_from?: number
  amenities?: string[]
  rating?: number
  reviews?: number
  image?: string
}

interface HotelListProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function HotelList({ searchParams }: HotelListProps) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [totalHotels, setTotalHotels] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)

      try {
        // Build query parameters from searchParams
        const queryParams = new URLSearchParams()

        // Add all search parameters to the query
        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v))
          } else if (value) {
            queryParams.append(key, value)
          }
        })

        // Add pagination parameters
        queryParams.append("page", currentPage.toString())
        queryParams.append("limit", itemsPerPage.toString())

        const response = await fetch(`http://localhost:5010/api/hotels?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch hotels")
        }

        const data = await response.json()
        setHotels(data.hotels || data)
        setTotalHotels(data.total || data.length)
      } catch (error) {
        console.error("Error fetching hotels:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [searchParams, currentPage, itemsPerPage])

  // Render stars based on classification
  const renderStars = (classification: number) => {
    return Array(classification)
      .fill(0)
      .map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
  }

  // Render amenity icons
  const renderAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-4 w-4 text-hotel-500" />
      case "Pool":
        return <Coffee className="h-4 w-4 text-hotel-500" />
      case "Gym":
        return <Coffee className="h-4 w-4 text-hotel-500" />
      case "Spa":
        return <Coffee className="h-4 w-4 text-hotel-500" />
      case "Restaurant":
        return <Coffee className="h-4 w-4 text-hotel-500" />
      case "Bar":
        return <Coffee className="h-4 w-4 text-hotel-500" />
      case "Breakfast":
        return <Coffee className="h-4 w-4 text-hotel-500" />
      default:
        return <Coffee className="h-4 w-4 text-hotel-500" />
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    )
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-12 bg-hotel-50 rounded-xl border border-hotel-100">
        <div className="bg-white rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 shadow-md">
          <Building className="h-8 w-8 text-hotel-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-hotel-800">No hotels found</h2>
        <p className="text-hotel-600">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-hotel-50 to-hotel-100 p-4 rounded-xl">
        <h2 className="text-xl font-semibold text-hotel-800 flex items-center">
          <Building className="h-5 w-5 mr-2 text-hotel-600" />
          {totalHotels} hotels found
        </h2>
        <div className="text-sm text-hotel-600">
          Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalHotels)} of{" "}
          {totalHotels}
        </div>
      </div>

      <div className="space-y-6">
        {hotels.map((hotel) => (
          <Card
            key={hotel.hotel_id}
            className="overflow-hidden border-none hotel-card-shadow rounded-xl hotel-card-hover"
          >
            <div className="md:flex">
              <div className="md:w-1/3 relative">
                <Image
                  src={hotel.image || "/placeholder.svg?height=200&width=400"}
                  alt={hotel.name}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 text-hotel-700 border-hotel-200 font-medium">
                    {hotel.chain_name}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-hotel-600 hover:bg-hotel-700 text-white border-none">
                    {hotel.rooms_available || hotel.num_rooms} rooms available
                  </Badge>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-hotel-900">{hotel.name}</h3>
                    <p className="text-hotel-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {hotel.address}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className="flex">{renderStars(hotel.classification)}</div>
                      {hotel.rating && (
                        <span className="text-sm text-hotel-600">
                          {hotel.rating} ({hotel.reviews} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-hotel-600">From</p>
                    <p className="text-2xl font-bold text-hotel-900 flex items-center justify-end">
                      <DollarSign className="h-5 w-5 text-hotel-600" />
                      {(hotel.price_from || 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-hotel-600">per night</p>
                  </div>
                </div>

                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.slice(0, 5).map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-hotel-50 px-2 py-1 rounded-md text-xs text-hotel-700"
                        >
                          {renderAmenityIcon(amenity)}
                          <span className="ml-1">{amenity}</span>
                        </div>
                      ))}
                      {hotel.amenities.length > 5 && (
                        <div className="flex items-center bg-hotel-50 px-2 py-1 rounded-md text-xs text-hotel-700">
                          +{hotel.amenities.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg"
                  >
                    <Link href={`/hotels/${hotel.hotel_id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) setCurrentPage(currentPage - 1)
              }}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: Math.ceil(totalHotels / itemsPerPage) }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentPage(i + 1)
                }}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < Math.ceil(totalHotels / itemsPerPage)) setCurrentPage(currentPage + 1)
              }}
              className={currentPage >= Math.ceil(totalHotels / itemsPerPage) ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

