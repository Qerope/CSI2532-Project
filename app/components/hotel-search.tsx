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
import { CalendarIcon } from "lucide-react"

export function HotelSearch() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
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
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <Label htmlFor="guests">Guests</Label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger>
              <SelectValue placeholder="Select guests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Guest</SelectItem>
              <SelectItem value="2">2 Guests</SelectItem>
              <SelectItem value="3">3 Guests</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Price Range ($ per night)</Label>
          <div className="pt-6">
            <Slider defaultValue={[0, 500]} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
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
      </div>

      <Button type="submit" className="w-full">
        Search Rooms
      </Button>
    </form>
  )
}

