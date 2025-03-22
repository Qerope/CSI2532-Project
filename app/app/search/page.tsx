"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { RoomCard } from "@/components/room-card"

interface Room {
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

interface HotelChain {
  chain_id: number
  name: string
}

export default function SearchPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [capacity, setCapacity] = useState<string>("")
  const [priceRange, setPriceRange] = useState<[number]>([300])
  const [hotelChain, setHotelChain] = useState<string>("")
  const [classification, setClassification] = useState<string>("")
  const [view, setView] = useState<string>("")

  const [rooms, setRooms] = useState<Room[]>([])
  const [hotelChains, setHotelChains] = useState<HotelChain[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch hotel chains
    const fetchHotelChains = async () => {
      try {
        const response = await fetch("http://localhost:5010/api/hotelChains")
        if (response.ok) {
          const data = await response.json()
          setHotelChains(data)
        }
      } catch (error) {
        console.error("Error fetching hotel chains:", error)
      }
    }

    fetchHotelChains()
  }, [])

  const handleSearch = async () => {
    setLoading(true)

    try {
      const url = "http://localhost:5010/api/rooms?"

      const params = new URLSearchParams()

      if (startDate) {
        params.append("start_date", format(startDate, "yyyy-MM-dd"))
      }

      if (endDate) {
        params.append("end_date", format(endDate, "yyyy-MM-dd"))
      }

      if (capacity) {
        params.append("capacity", capacity)
      }

      if (priceRange[0] > 0) {
        params.append("price", priceRange[0].toString())
      }

      if (hotelChain) {
        params.append("hotel_chain", hotelChain)
      }

      if (classification) {
        params.append("classification", classification)
      }

      if (view) {
        params.append("view", view)
      }

      const response = await fetch(`http://localhost:5010/api/rooms?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        setRooms(data)

        if (data.length === 0) {
          toast({
            title: "No rooms found",
            description: "Try adjusting your search criteria.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Rooms found",
            description: `Found ${data.length} rooms matching your criteria.`,
          })
        }
      } else {
        throw new Error("Failed to fetch rooms")
      }
    } catch (error) {
      console.error("Error searching rooms:", error)
      toast({
        title: "Error",
        description: "Failed to search for rooms. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReservation = async (roomId: number) => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would have a proper guest ID from authentication
    const guestId = 1 // Placeholder

    try {
      const response = await fetch("http://localhost:5010/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_id: guestId,
          room_id: roomId,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Reservation successful",
          description: "Your room has been reserved successfully.",
        })
        router.push("/reservations")
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to make reservation")
      }
    } catch (error) {
      console.error("Error making reservation:", error)
      toast({
        title: "Reservation failed",
        description: error instanceof Error ? error.message : "Failed to make reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Available Rooms</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="check-in">Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="check-out">Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false) || date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Room Capacity</Label>
                <Select value={capacity} onValueChange={setCapacity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">Single (1 person)</SelectItem>
                    <SelectItem value="2">Double (2 people)</SelectItem>
                    <SelectItem value="3">Triple (3 people)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-range">Max Price: ${priceRange[0]}</Label>
                <Slider
                  defaultValue={[300]}
                  max={1000}
                  step={10}
                  onValueChange={(value) => setPriceRange(value as [number])}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hotel-chain">Hotel Chain</Label>
                <Select value={hotelChain} onValueChange={setHotelChain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hotel chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    {hotelChains.map((chain) => (
                      <SelectItem key={chain.chain_id} value={chain.chain_id.toString()}>
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classification">Hotel Classification</Label>
                <Select value={classification} onValueChange={setClassification}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="view">Room View</Label>
                <Select value={view} onValueChange={setView}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="Sea View">Sea View</SelectItem>
                    <SelectItem value="Mountain View">Mountain View</SelectItem>
                    <SelectItem value="City View">City View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : "Search Rooms"}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">
            {rooms.length > 0 ? `${rooms.length} Available Rooms` : "Search for available rooms using the filters"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard key={room.room_id} room={room} onReserve={() => handleReservation(room.room_id)} />
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No rooms found. Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

