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
import {
  CalendarIcon,
  Search,
  MapPin,
  Users,
  Star,
  Building,
  Tv,
  Wifi,
  Wind,
  Eye,
  DollarSign,
  Settings,
  Refrigerator,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
  const [amenities, setAmenities] = useState<string[]>((searchParams.amenities as string[]) || [])
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
    <Card className="border-none shadow-lg hotel-card-shadow bg-white rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-hotel-600 to-hotel-800 text-white p-6">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filter Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-hotel-500" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="City, state, or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border-hotel-200 focus:border-hotel-500 focus:ring-hotel-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-hotel-500" />
              Check-in Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal rounded-lg border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700"
                >
                  {checkIn ? format(checkIn, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-hotel-200">
                <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus className="rounded-lg" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-hotel-500" />
              Check-out Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal rounded-lg border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700"
                >
                  {checkOut ? format(checkOut, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-hotel-200">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  initialFocus
                  className="rounded-lg"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-hotel-500" />
              Room Capacity
            </Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="rounded-lg border-hotel-200">
                <SelectValue placeholder="Select capacity" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-hotel-200">
                <SelectItem value="1">Single (1 Person)</SelectItem>
                <SelectItem value="2">Double (2 People)</SelectItem>
                <SelectItem value="3">Triple (3 People)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-hotel-500" />
              Price Range ($ per night)
            </Label>
            <div className="pt-6">
              <Slider
                value={priceRange}
                max={1000}
                step={10}
                onValueChange={setPriceRange}
                className="[&>span]:bg-hotel-500"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hotelChain" className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4 text-hotel-500" />
              Hotel Chain
            </Label>
            <Select value={hotelChain} onValueChange={setHotelChain}>
              <SelectTrigger className="rounded-lg border-hotel-200">
                <SelectValue placeholder="Any chain" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-hotel-200">
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
            <Label htmlFor="classification" className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-hotel-500" />
              Hotel Classification
            </Label>
            <Select value={classification} onValueChange={setClassification}>
              <SelectTrigger className="rounded-lg border-hotel-200">
                <SelectValue placeholder="Any stars" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-hotel-200">
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
            <Label className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-hotel-500" />
              Room View
            </Label>
            <div className="space-y-2 pl-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sea-view"
                  checked={views.includes("Sea View")}
                  onCheckedChange={(checked) => handleViewChange("Sea View", checked as boolean)}
                  className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                />
                <label htmlFor="sea-view" className="text-sm">
                  Sea View
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mountain-view"
                  checked={views.includes("Mountain View")}
                  onCheckedChange={(checked) => handleViewChange("Mountain View", checked as boolean)}
                  className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                />
                <label htmlFor="mountain-view" className="text-sm">
                  Mountain View
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="city-view"
                  checked={views.includes("City View")}
                  onCheckedChange={(checked) => handleViewChange("City View", checked as boolean)}
                  className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                />
                <label htmlFor="city-view" className="text-sm">
                  City View
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4 text-hotel-500" />
              Amenities
            </Label>
            <div className="space-y-2 pl-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tv"
                  checked={amenities.includes("TV")}
                  onCheckedChange={(checked) => handleAmenityChange("TV", checked as boolean)}
                  className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                />
                <label htmlFor="tv" className="text-sm flex items-center gap-2">
                  <Tv className="h-3 w-3 text-hotel-500" />
                  TV
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ac"
                  checked={amenities.includes("Air Conditioning")}
                  onCheckedChange={(checked) => handleAmenityChange("Air Conditioning", checked as boolean)}
                  className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                />
                <label htmlFor="ac" className="text-sm flex items-center gap-2">
                  <Wind className="h-3 w-3 text-hotel-500" />
                  Air Conditioning
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="fridge"
                  checked={amenities.includes("Refrigerator")}
                  onCheckedChange={(checked) => handleAmenityChange("Refrigerator", checked as boolean)}
                  className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                />
                <label htmlFor="fridge" className="text-sm flex items-center gap-2">
                  <Refrigerator className="h-3 w-3 text-hotel-500" />
                  Refrigerator
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wifi"
                  checked={amenities.includes("WiFi")}
                  onCheckedChange={(checked) => handleAmenityChange("WiFi", checked as boolean)}
                  className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                />
                <label htmlFor="wifi" className="text-sm flex items-center gap-2">
                  <Wifi className="h-3 w-3 text-hotel-500" />
                  WiFi
                </label>
              </div>
            </div>
          </div>

          <Button
            onClick={applyFilters}
            className="w-full bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg h-12 font-medium mt-4"
          >
            <Search className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

