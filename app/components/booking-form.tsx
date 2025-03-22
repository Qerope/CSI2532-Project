"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, differenceInDays } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface BookingFormProps {
  roomId: number
  price: number
}

export function BookingForm({ roomId, price }: BookingFormProps) {
  const router = useRouter()
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(1)

  // Calculate total nights and price
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const totalPrice = nights * price

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates")
      return
    }

    // In a real application, this would call an API to create a reservation
    // For now, we'll just simulate a successful booking

    // Redirect to confirmation page
    router.push(
      `/booking/confirmation?roomId=${roomId}&checkIn=${format(checkIn, "yyyy-MM-dd")}&checkOut=${format(checkOut, "yyyy-MM-dd")}&guests=${guests}&total=${totalPrice.toFixed(2)}`,
    )
  }

  return (
    <form onSubmit={handleBooking} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="check-in">Check-in Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button id="check-in" variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkIn ? format(checkIn, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={(date) => {
                setCheckIn(date)
                // If check-out is not set or is before check-in, set it to check-in + 1 day
                if (!checkOut || (date && checkOut < date)) {
                  setCheckOut(date ? addDays(date, 1) : undefined)
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
            <Button id="check-out" variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {checkOut ? format(checkOut, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => !checkIn || date <= checkIn || date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests">Number of Guests</Label>
        <Input
          id="guests"
          type="number"
          min={1}
          max={3}
          value={guests}
          onChange={(e) => setGuests(Number.parseInt(e.target.value))}
        />
      </div>

      {nights > 0 && (
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span>Price per night</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Nights</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!checkIn || !checkOut}>
        Book Now
      </Button>
    </form>
  )
}

