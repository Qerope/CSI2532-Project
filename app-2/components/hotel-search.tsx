"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search, MapPin, Users, Star, Building, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function HotelSearch() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState<Date>(new Date())
  const [checkOut, setCheckOut] = useState<Date>(new Date())
  const [guests, setGuests] = useState("1")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [hotelChain, setHotelChain] = useState("")
  const [classification, setClassification] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build query parameters
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (checkIn) params.append("checkIn", format(checkIn, "yyyy-MM-dd"))
    if (checkOut) params.append("checkOut", format(checkOut, "yyyy-MM-dd"))
    if (guests) params.append("guests", guests)
    if (priceRange) {
      params.append("minPrice", priceRange[0].toString())
      params.append("maxPrice", priceRange[1].toString())
    }
    if (hotelChain) params.append("chain", hotelChain)
    if (classification) params.append("stars", classification)

    // Navigate to search results page with query parameters
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Card className="border-none shadow-lg hotel-card-shadow bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    initialFocus
                    className="rounded-lg"
                  />
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
                Guests
              </Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="rounded-lg border-hotel-200">
                  <SelectValue placeholder="Select guests" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-hotel-200">
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-hotel-500" />
                Price Range ($ per night)
              </Label>
              <div className="pt-6">
                <Slider
                  defaultValue={[0, 500]}
                  max={1000}
                  step={10}
                  value={priceRange}
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
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg h-12 font-medium"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Rooms
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

