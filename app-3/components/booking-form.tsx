"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface BookingFormProps {
  roomId: number
  price: number
}

export function BookingForm({ roomId, price }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [guests, setGuests] = useState<string>("1")
  const [isLoading, setIsLoading] = useState(false)

  // Add state for reservation modal
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false)
  const [guestId, setGuestId] = useState<string>("1") // Default guest ID
  const [guestName, setGuestName] = useState<string>("")
  const [reservationLoading, setReservationLoading] = useState(false)

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return price

    const nights = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
    return price * nights
  }

  const handleBookNow = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates.",
        variant: "destructive",
      })
      return
    }

    setIsReservationModalOpen(true)
  }

  const handleReservation = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Missing dates",
        description: "Please select check-in and check-out dates.",
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

        // Redirect to confirmation page
        const totalPrice = calculateTotalPrice()
        router.push(
          `/booking/confirmation?roomId=${roomId}&checkIn=${format(startDate, "yyyy-MM-dd")}&checkOut=${format(
            endDate,
            "yyyy-MM-dd",
          )}&guests=${guests}&total=${totalPrice.toFixed(2)}`,
        )
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
      setIsReservationModalOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="check-in" className="block text-sm font-medium">
          Check-in Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isLoading}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="check-out" className="block text-sm font-medium">
          Check-out Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={isLoading}>
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

      <div className="space-y-2">
        <label htmlFor="guests" className="block text-sm font-medium">
          Number of Guests
        </label>
        <Select value={guests} onValueChange={setGuests} disabled={isLoading}>
          <SelectTrigger id="guests" className="w-full">
            <SelectValue placeholder="Select guests">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {guests} Guest{Number(guests) > 1 ? "s" : ""}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Guest</SelectItem>
            <SelectItem value="2">2 Guests</SelectItem>
            <SelectItem value="3">3 Guests</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between mb-2">
          <span>Price per night</span>
          <span>${price.toFixed(2)}</span>
        </div>
        {startDate && endDate && (
          <div className="flex justify-between mb-2">
            <span>{Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
            <span>
              ${(price * Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))).toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>Total</span>
          <span>${calculateTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white"
        onClick={handleBookNow}
        disabled={isLoading || !startDate || !endDate}
      >
        {isLoading ? "Processing..." : "Book Now"}
      </Button>

      {/* Reservation Modal */}
      <Dialog open={isReservationModalOpen} onOpenChange={setIsReservationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make a Reservation</DialogTitle>
            <DialogDescription>Please confirm your reservation details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="room-id">Room ID</Label>
                <Input id="room-id" value={roomId} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="price">Price per Night</Label>
                <Input id="price" value={`$${price.toFixed(2)}`} readOnly className="mt-1" />
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
                <Label htmlFor="guests-count">Number of Guests</Label>
                <Input id="guests-count" value={guests} readOnly className="mt-1" />
              </div>
              <div>
                <Label htmlFor="total-price">Total Price</Label>
                <Input id="total-price" value={`$${calculateTotalPrice().toFixed(2)}`} readOnly className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="guest-id">Guest ID</Label>
              <Input id="guest-id" value={guestId} onChange={(e) => setGuestId(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="guest-name">Guest Name (Optional)</Label>
              <Input
                id="guest-name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name"
                className="mt-1"
              />
            </div>
          </div>

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

