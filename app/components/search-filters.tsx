"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export function SearchFilters({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter()

  // Initialize state from URL parameters
  const [location, setLocation] = useState((searchParams.location as string) || "")
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    searchParams.checkIn ? new Date(searchParams.checkIn as string) : undefined,
  )
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    searchParams.checkOut ? new Date(searchParams.checkOut as string) : undefined,
  )
  const [guests, setGuests] = useState((searchParams.guests as string) || "1")
  const [priceRange, setPriceRange] = useState([
    Number.parseInt((searchParams.minPrice as string) || "0"),
    Number.parseInt((searchParams.maxPrice as string) || "500"),
  ])
  const [hotelChain, setHotelChain] = useState((searchParams.chain as string) || "")
  const [classification, setClassification] = useState((searchParams.stars as string) || "")
  const [amenities, setAmenities] = useState<string[]>([])
  const [views, setViews] = useState<string[]>([])

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (location) params.append("location", location)
    if (checkIn) params.append("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.append("checkOut", format(checkOut, "yyyy-MM-dd"))
    if (guests) params.append("guests", guests)

    params.append("minPrice", priceRange[0].toString())
    params.append("maxPrice", priceRange[1].toString())

    if (hotelChain) params.append("chain", hotelChain)
    if (classification) params.append("stars", classification)

    amenities.forEach((amenity) => {
      params.append("amenities", amenity)
    })

    views.forEach((view) => {
      params.append("views", view)
    })

    router.push(`/search?${params.toString()}`)
  }

  // Handle amenity checkbox changes
  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity])
    } else {
      setAmenities(amenities.filter((a) => a !== amenity))
    }
  }

  // Handle view checkbox changes
  const handleViewChange = (view: string, checked: boolean) => {
    if (checked) {
      setViews([...views, view])
    } else {
      setViews(views.filter((v) => v !== view))
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
      <h2 className="text-xl font-semibold mb-4">Filter Results</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, state, or area"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Room Capacity</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue placeholder="Select capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Single (1 Person)</SelectItem>
              <SelectItem value="2">Double (2 People)</SelectItem>
              <SelectItem value="3">Triple (3 People)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Range ($ per night)</Label>
          <div className="pt-6">
            <Slider value={priceRange} max={1000} step={10} onValueChange={setPriceRange} />
            <div className="flex justify-between mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hotelChain">Hotel Chain</Label>
          <Select value={hotelChain} onValueChange={setHotelChain}>
            <SelectTrigger>
              <SelectValue placeholder="Any chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any chain</SelectItem>
              <SelectItem value="marriott">Marriott</SelectItem>
              <SelectItem value="hilton">Hilton</SelectItem>
              <SelectItem value="hyatt">Hyatt</SelectItem>
              <SelectItem value="ihg">IHG</SelectItem>
              <SelectItem value="wyndham">Wyndham</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="classification">Hotel Classification</Label>
          <Select value={classification} onValueChange={setClassification}>
            <SelectTrigger>
              <SelectValue placeholder="Any stars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Room View</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sea-view"
                checked={views.includes("Sea View")}
                onCheckedChange={(checked) => handleViewChange("Sea View", checked as boolean)}
              />
              <label htmlFor="sea-view">Sea View</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mountain-view"
                checked={views.includes("Mountain View")}
                onCheckedChange={(checked) => handleViewChange("Mountain View", checked as boolean)}
              />
              <label htmlFor="mountain-view">Mountain View</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="city-view"
                checked={views.includes("City View")}
                onCheckedChange={(checked) => handleViewChange("City View", checked as boolean)}
              />
              <label htmlFor="city-view">City View</label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="tv"
                checked={amenities.includes("TV")}
                onCheckedChange={(checked) => handleAmenityChange("TV", checked as boolean)}
              />
              <label htmlFor="tv">TV</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ac"
                checked={amenities.includes("Air Conditioning")}
                onCheckedChange={(checked) => handleAmenityChange("Air Conditioning", checked as boolean)}
              />
              <label htmlFor="ac">Air Conditioning</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fridge"
                checked={amenities.includes("Refrigerator")}
                onCheckedChange={(checked) => handleAmenityChange("Refrigerator", checked as boolean)}
              />
              <label htmlFor="fridge">Refrigerator</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wifi"
                checked={amenities.includes("WiFi")}
                onCheckedChange={(checked) => handleAmenityChange("WiFi", checked as boolean)}
              />
              <label htmlFor="wifi">WiFi</label>
            </div>
          </div>
        </div>

        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

