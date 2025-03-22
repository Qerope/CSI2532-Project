"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, addDays } from "date-fns"
import { CalendarIcon } from "lucide-react"

export function NewRentalForm() {
  const router = useRouter()

  // Guest information
  const [guestName, setGuestName] = useState("")
  const [guestAddress, setGuestAddress] = useState("")
  const [guestSIN, setGuestSIN] = useState("")
  const [guestPhone, setGuestPhone] = useState("")

  // Rental details
  const [roomId, setRoomId] = useState("")
  const [checkIn, setCheckIn] = useState<Date>(new Date())
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 1))
  const [guests, setGuests] = useState("1")

  // Available rooms (in a real app, this would be fetched from the database)
  const availableRooms = [
    { id: "101", number: "101", type: "Single Room", price: 99.99 },
    { id: "203", number: "203", type: "Double Room", price: 149.99 },
    { id: "305", number: "305", type: "Deluxe Room", price: 199.99 },
    { id: "410", number: "410", type: "Suite", price: 299.99 },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!guestName || !guestAddress || !guestSIN || !guestPhone || !roomId) {
      alert("Please fill in all required fields")
      return
    }

    // In a real application, this would call an API to create the rental

    // Redirect to the rentals page with a success message
    router.push("/employee/rentals?success=created")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
            <CardDescription>Enter the guest's personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guest-name">Full Name</Label>
                <Input id="guest-name" value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guest-phone">Phone Number</Label>
                <Input id="guest-phone" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest-address">Address</Label>
              <Input
                id="guest-address"
                value={guestAddress}
                onChange={(e) => setGuestAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest-sin">Social Insurance Number (SIN)</Label>
              <Input
                id="guest-sin"
                value={guestSIN}
                onChange={(e) => setGuestSIN(e.target.value)}
                placeholder="9 digits"
                maxLength={9}
                required
              />
              <p className="text-xs text-gray-500">Format: 9 digits without spaces or dashes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rental Details</CardTitle>
            <CardDescription>Select room and stay duration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room">Select Room</Label>
              <Select value={roomId} onValueChange={setRoomId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.number} - {room.type} (${room.price}/night)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(date) => {
                        if (date) {
                          setCheckIn(date)
                          // If check-out is before new check-in, update it
                          if (checkOut < date) {
                            setCheckOut(addDays(date, 1))
                          }
                        }
                      }}
                      initialFocus
                    />
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
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(date) => date && setCheckOut(date)}
                      disabled={(date) => date <= checkIn}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="3">3 Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Create Rental</Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}

