"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, MapPin, Star } from "lucide-react"
import { useState, useEffect } from "react"

export function HotelChainShowcase() {
  const [hotelChains, setHotelChains] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotelChains = async () => {
      try {
        const response = await fetch("http://localhost:5010/api/hotelChains")

        if (!response.ok) {
          throw new Error("Failed to fetch hotel chains")
        }

        const data = await response.json()
        setHotelChains(data)
      } catch (error) {
        console.error("Error fetching hotel chains:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHotelChains()
  }, [])

  // Function to render stars
  const renderStars = (count: number) => {
    return Array(count)
      .fill(0)
      .map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
      {hotelChains.map((chain) => (
        <Card key={chain.id} className="overflow-hidden border-none hotel-card-shadow rounded-xl hotel-card-hover">
          <div className="relative">
            <Image
              src={chain.image || "/placeholder.svg"}
              alt={chain.name}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-sm">
              <MapPin className="h-4 w-4" />
              {chain.location}
            </div>
            <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 text-xs font-medium">
              <Building className="h-3 w-3 text-hotel-600" />
              {chain.hotels} hotels
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">{chain.name}</CardTitle>
            <div className="flex mt-1">{renderStars(chain.stars)}</div>
            <CardDescription className="line-clamp-2 mt-1">{chain.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-4 w-4 text-hotel-500" />
              <span>
                {chain.hotels} hotels across {chain.location}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg"
            >
              <Link href={`/hotels?chain=${chain.id}`}>View Hotels</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

