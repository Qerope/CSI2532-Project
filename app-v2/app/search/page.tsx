"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, addDays } from "date-fns"
import { CalendarIcon, Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { RoomCard } from "@/components/room-card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Users, DollarSign, Building, Eye } from "lucide-react"
import { trackServerSqlQueries } from "@/lib/server-sql-tracker"

// Updated interface to match database schema
interface Room {
  room_id: number
  hotel_id: number
  price: number
  capacity: number
  view: string
  extendable: boolean
  condition: string
  amenities: string
  // Additional fields from API response
  hotel_name?: string
  hotel_classification?: number
  chain_name?: string
}

interface HotelChain {
  chain_id: number
  name: string
  central_address: string
  num_hotels: number
  contact_email: string
  telephone: string
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get initial values from URL parameters
  const initialStartDate = searchParams.get("start_date")
    ? new Date(searchParams.get("start_date") as string)
    : new Date()
  const initialEndDate = searchParams.get("end_date") ? new Date(searchParams.get("end_date") as string) : new Date()
  const initialCapacity = searchParams.get("capacity") || ""
  const initialMinPrice = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : 0
  const initialMaxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : 1000
  const initialHotelChain = searchParams.get("hotel_chain") || ""
  const initialView = searchParams.get("view") || ""
  const initialCondition = searchParams.get("condition") || ""
  const initialExtendable = searchParams.get("extendable") === "true"
  const initialAmenities = searchParams.get("amenities")?.split(",") || []

  // State for filter values
  const [startDate, setStartDate] = useState<Date | undefined>(initialStartDate)
  const [endDate, setEndDate] = useState<Date | undefined>(initialEndDate)
  const [capacity, setCapacity] = useState<string>(initialCapacity)
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice])
  const [hotelChain, setHotelChain] = useState<string>(initialHotelChain)
  const [view, setView] = useState<string>(initialView)
  const [condition, setCondition] = useState<string>(initialCondition)
  const [extendable, setExtendable] = useState<boolean>(initialExtendable)
  const [amenities, setAmenities] = useState<string[]>(initialAmenities)
  const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false)

  // State for results and UI
  const [rooms, setRooms] = useState<Room[]>([])
  const [hotelChains, setHotelChains] = useState<HotelChain[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // State for reservation modal
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [guestId, setGuestId] = useState<string>("1") // Default guest ID
  const [guestName, setGuestName] = useState<string>("")
  const [reservationLoading, setReservationLoading] = useState(false)

  // Fetch hotel chains on component mount
  useEffect(() => {
    const fetchHotelChains = async () => {
      try {
        const response = await fetch("http://localhost:5010/api/hotelChains")
        trackServerSqlQueries(response)

        if (response.ok) {
          const data = await response.json()
          setHotelChains(data)
        } else {
          throw new Error("Failed to fetch hotel chains")
        }
      } catch (error) {
        console.error("Error fetching hotel chains:", error)
        toast({
          title: "Error",
          description: "Failed to fetch hotel chains. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchHotelChains()

    // If we have search params, perform initial search
    if (searchParams.toString()) {
      handleSearch()
    }
  }, [])

  // Update active filters whenever filter values change
  useEffect(() => {
    const filters = []

    if (startDate) filters.push(`Check-in: ${format(startDate, "MMM d, yyyy")}`)
    if (endDate) filters.push(`Check-out: ${format(endDate, "MMM d, yyyy")}`)
    if (capacity) filters.push(`Capacity: ${capacity} ${Number(capacity) === 1 ? "person" : "people"}`)
    if (priceRange[0] > 0 || priceRange[1] < 1000) filters.push(`Price: $${priceRange[0]} - $${priceRange[1]}`)
    if (hotelChain) {
      const chainName = hotelChains.find((chain) => chain.chain_id.toString() === hotelChain)?.name || hotelChain
      filters.push(`Chain: ${chainName}`)
    }
    if (view) filters.push(`View: ${view}`)
    if (condition) filters.push(`Condition: ${condition}`)
    if (extendable) filters.push("Extendable")
    if (amenities.length > 0) filters.push(`Amenities: ${amenities.length}`)

    setActiveFilters(filters)
  }, [startDate, endDate, capacity, priceRange, hotelChain, view, condition, extendable, amenities, hotelChains])

  // Handle amenity checkbox changes
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity])
    } else {
      setAmenities(amenities.filter((a) => a !== amenity))
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setCapacity("")
    setPriceRange([0, 1000])
    setHotelChain("")
    setView("")
    setCondition("")
    setExtendable(false)
    setAmenities([])
  }

  // Remove a specific filter
  const removeFilter = (filter: string) => {
    if (filter.startsWith("Check-in:")) setStartDate(undefined)
    else if (filter.startsWith("Check-out:")) setEndDate(undefined)
    else if (filter.startsWith("Capacity:")) setCapacity("")
    else if (filter.startsWith("Price:")) setPriceRange([0, 1000])
    else if (filter.startsWith("Chain:")) setHotelChain("")
    else if (filter.startsWith("View:")) setView("")
    else if (filter.startsWith("Condition:")) setCondition("")
    else if (filter === "Extendable") setExtendable(false)
    else if (filter.startsWith("Amenities:")) setAmenities([])
  }

  const handleSearch = async () => {
    setLoading(true)

    try {
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
        params.append("min_price", priceRange[0].toString())
      }

      if (priceRange[1] < 1000) {
        params.append("max_price", priceRange[1].toString())
      }

      if (hotelChain) {
        params.append("hotel_chain", hotelChain)
      }

      if (view) {
        params.append("view", view)
      }

      if (condition) {
        params.append("condition", condition)
      }

      if (extendable) {
        params.append("extendable", "true")
      }

      if (amenities.length > 0) {
        params.append("amenities", amenities.join(","))
      }

      // Update URL with search parameters
      router.push(`/search?${params.toString()}`, { scroll: false })

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

  const handleReservationClick = (room: Room) => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    setSelectedRoom(room)
    setIsReservationModalOpen(true)
  }

  const handleReservation = async () => {
    if (!selectedRoom || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please select dates and a room.",
        variant: "destructive",
      })
      return
    }

    setReservationLoading(true)

    try {
      const response = await fetch("http://localhost:5010/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_id: Number.parseInt(guestId),
          room_id: selectedRoom.room_id,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Reservation successful",
          description: "Your room has been reserved successfully.",
        })
        setIsReservationModalOpen(false)
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
    } finally {
      setReservationLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Available Rooms</h1>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                {filter}
                <button onClick={() => removeFilter(filter)} className="ml-1 rounded-full hover:bg-muted">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card className="sticky top-24 border-none hotel-card-shadow rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-hotel-600 to-hotel-800 text-white p-6 flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="md:hidden text-white hover:text-white hover:bg-white/20"
              >
                {isFilterExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CardHeader>
            <CardContent className={`p-6 space-y-6 ${isFilterExpanded ? "block" : "hidden md:block"}`}>
              <Accordion type="multiple" defaultValue={["dates", "guests", "price", "hotel", "room"]}>
                <AccordionItem value="dates" className="border-b-0">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <CalendarIcon className="h-4 w-4 text-hotel-500" />
                      Dates
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0 space-y-4">
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
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                              setStartDate(date)
                              // If end date is before start date or not set, set it to start date + 1
                              if (!endDate || (date && endDate < date)) {
                                setEndDate(date ? addDays(date, 1) : undefined)
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
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
                            disabled={(date) => (startDate ? date <= startDate : date <= new Date())}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="guests" className="border-b-0">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Users className="h-4 w-4 text-hotel-500" />
                      Room Capacity
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0">
                    <div className="space-y-2">
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-b-0">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="h-4 w-4 text-hotel-500" />
                      Price Range
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0">
                    <div className="space-y-4">
                      <div className="pt-2">
                        <Slider
                          value={priceRange}
                          max={1000}
                          step={10}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="[&>span]:bg-hotel-500"
                        />
                        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="min-price">Min Price</Label>
                          <Input
                            id="min-price"
                            type="number"
                            min="0"
                            max={priceRange[1]}
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max-price">Max Price</Label>
                          <Input
                            id="max-price"
                            type="number"
                            min={priceRange[0]}
                            max="1000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hotel" className="border-b-0">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Building className="h-4 w-4 text-hotel-500" />
                      Hotel Chain
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0">
                    <div className="space-y-2">
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="room" className="border-b-0">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Eye className="h-4 w-4 text-hotel-500" />
                      Room Features
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-0 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="view">Room View</Label>
                      <Select value={view} onValueChange={setView}>
                        <SelectTrigger id="view">
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

                    <div className="space-y-2">
                      <Label htmlFor="condition">Room Condition</Label>
                      <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="Good Condition">Good Condition</SelectItem>
                          <SelectItem value="In Repair">In Repair</SelectItem>
                          <SelectItem value="Damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="extendable" checked={extendable} onCheckedChange={setExtendable} />
                      <Label htmlFor="extendable">Extendable rooms only</Label>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Amenities</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "wifi", label: "WiFi" },
                          { id: "tv", label: "TV" },
                          { id: "ac", label: "Air Conditioning" },
                          { id: "fridge", label: "Refrigerator" },
                          { id: "coffee", label: "Coffee Machine" },
                          { id: "safe", label: "Safe" },
                          { id: "minibar", label: "Minibar" },
                          { id: "bathtub", label: "Bathtub" },
                        ].map((amenity) => (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`amenity-${amenity.id}`}
                              checked={amenities.includes(amenity.id)}
                              onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                              className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                            />
                            <label htmlFor={`amenity-${amenity.id}`} className="text-sm">
                              {amenity.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                className="w-full bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Search Rooms
                  </span>
                )}
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
              <RoomCard key={room.room_id} room={room} onReserve={() => handleReservationClick(room)} />
            ))}
          </div>

          {rooms.length === 0 && (
            <div className="text-center py-12 bg-hotel-50 rounded-xl border border-hotel-100">
              <div className="bg-white rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4 shadow-md">
                <Search className="h-8 w-8 text-hotel-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-hotel-800">No rooms found</h2>
              <p className="text-hotel-600 mb-4">Try adjusting your search criteria</p>
              {activeFilters.length > 0 && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reservation Modal */}
      <Dialog open={isReservationModalOpen} onOpenChange={setIsReservationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Reservation</DialogTitle>
            <DialogDescription>Please confirm your reservation details.</DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hotel-name">Hotel</Label>
                  <Input id="hotel-name" value={selectedRoom.hotel_name || ""} readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="room-id">Room ID</Label>
                  <Input id="room-id" value={selectedRoom.room_id} readOnly className="mt-1" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="check-in-date">Check-in Date</Label>
                  <Input
                    id="check-in-date"
                    value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                    readOnly
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="check-out-date">Check-out Date</Label>
                  <Input
                    id="check-out-date"
                    value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                    readOnly
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price per Night</Label>
                  <Input id="price" value={`$${Number(selectedRoom.price).toFixed(2)}`} readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="total-price">Total Price</Label>
                  <Input
                    id="total-price"
                    value={
                      startDate && endDate
                        ? `$${(selectedRoom.price * Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2)}`
                        : ""
                    }
                    readOnly
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guest-id">Guest ID</Label>
                <Input id="guest-id" value={guestId} onChange={(e) => setGuestId(e.target.value)} className="mt-1" />
              </div>

              <div>
                <Label htmlFor="guest-name">Guest Name</Label>
                <Input
                  id="guest-name"
                  value={guestName}
                  required
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReservationModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReservation} disabled={reservationLoading}>
              {reservationLoading ? "Processing..." : "Confirm Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

