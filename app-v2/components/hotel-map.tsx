"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Maximize2, Minimize2 } from "lucide-react"

interface HotelMapProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function HotelMap({ searchParams }: HotelMapProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Add a state for hotel locations
  const [hotelLocations, setHotelLocations] = useState([])

  // Update the useEffect to fetch hotel locations
  useEffect(() => {
    const fetchHotelLocations = async () => {
      setIsLoading(true)

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

        const response = await fetch(`http://localhost:5010/api/hotel-locations?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch hotel locations")
        }

        const data = await response.json()
        setHotelLocations(data)
      } catch (error) {
        console.error("Error fetching hotel locations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotelLocations()
  }, [searchParams])

  return (
    <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 p-4 bg-white" : ""}`}>
      <Card className="border-none hotel-card-shadow rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div
              className={`bg-gray-200 ${isFullscreen ? "h-[calc(100vh-8rem)]" : "h-[600px]"} flex items-center justify-center`}
            >
              {isLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hotel-600 mb-4"></div>
                  <p className="text-hotel-600">Loading map...</p>
                </div>
              ) : (
                // Update the map display to use hotelLocations data
                <div className="text-center text-hotel-600">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-hotel-500" />
                  <p>Map view would be displayed here</p>
                  <p className="text-sm mt-2">
                    In a real application, this would integrate with Google Maps or a similar service
                  </p>
                  {hotelLocations.length > 0 && (
                    <div>
                      <p>Found {hotelLocations.length} hotels</p>
                      {/* You can map through hotelLocations to display markers on the map */}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="absolute top-4 right-4 space-y-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-white shadow-md hover:bg-hotel-50"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFullscreen && (
        <Button
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-hotel-600 hover:bg-hotel-700"
          onClick={() => setIsFullscreen(false)}
        >
          Exit Fullscreen
        </Button>
      )}
    </div>
  )
}

