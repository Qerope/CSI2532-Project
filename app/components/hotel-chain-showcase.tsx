import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function HotelChainShowcase() {
  const hotelChains = [
    {
      id: 1,
      name: "Marriott International",
      description: "Luxury hotels with exceptional service across North America.",
      image: "/placeholder.svg?height=200&width=400",
      hotels: 120,
    },
    {
      id: 2,
      name: "Hilton Hotels & Resorts",
      description: "Upscale accommodations with world-class amenities.",
      image: "/placeholder.svg?height=200&width=400",
      hotels: 95,
    },
    {
      id: 3,
      name: "Hyatt Hotels Corporation",
      description: "Modern luxury with a focus on wellness and comfort.",
      image: "/placeholder.svg?height=200&width=400",
      hotels: 85,
    },
    {
      id: 4,
      name: "InterContinental Hotels Group",
      description: "Diverse portfolio of hotels for every type of traveler.",
      image: "/placeholder.svg?height=200&width=400",
      hotels: 110,
    },
    {
      id: 5,
      name: "Wyndham Hotels & Resorts",
      description: "Comfortable stays with excellent value across locations.",
      image: "/placeholder.svg?height=200&width=400",
      hotels: 130,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      {hotelChains.map((chain) => (
        <Card key={chain.id} className="overflow-hidden">
          <Image
            src={chain.image || "/placeholder.svg"}
            alt={chain.name}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <CardHeader>
            <CardTitle>{chain.name}</CardTitle>
            <CardDescription>{chain.hotels} hotels across North America</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{chain.description}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/hotels?chain=${chain.id}`}>View Hotels</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

