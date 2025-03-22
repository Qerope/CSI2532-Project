"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, Check } from "lucide-react"

interface Reservation {
  reservation_id: number
  guest_id: number
  room_id: number
  start_date: string
  end_date: string
  status: string
  guest_name?: string
  room_details?: {
    price: number
    hotel_name?: string
  }
}

interface Rental {
  rental_id: number
  reservation_id: number
  guest_id: number
  room_id: number
  employee_id: number
  checkin_date: string
  checkout_date: string
  guest_name?: string
  employee_name?: string
  room_details?: {
    price: number
    hotel_name?: string
  }
}

interface Guest {
  guest_id: number
  full_name: string
}

interface Room {
  room_id: number
  hotel_id: number
  price: number
  hotel_name?: string
}

interface Employee {
  employee_id: number
  full_name: string
  role: string
}

export function RentalManagement() {
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("reservations")

  const [reservations, setReservations] = useState<Reservation[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [isConvertingReservation, setIsConvertingReservation] = useState(false)
  const [isCreatingDirectRental, setIsCreatingDirectRental] = useState(false)

  const [newRental, setNewRental] = useState<{
    reservation_id?: number
    guest_id?: number
    room_id?: number
    employee_id?: number
    checkin_date?: Date
    checkout_date?: Date
  }>({})

  useEffect(() => {
    fetchReservations()
    fetchRentals()
    fetchGuests()
    fetchRooms()
    fetchEmployees()
  }, [])

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/reservations")
      if (response.ok) {
        const data = await response.json()
        setReservations(data.filter((res: Reservation) => res.status === "Booked"))
      } else {
        throw new Error("Failed to fetch reservations")
      }
    } catch (error) {
      console.error("Error fetching reservations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch reservations. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchRentals = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/rentals")
      if (response.ok) {
        const data = await response.json()
        setRentals(data)
      } else {
        throw new Error("Failed to fetch rentals")
      }
    } catch (error) {
      console.error("Error fetching rentals:", error)
      toast({
        title: "Error",
        description: "Failed to fetch rentals. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchGuests = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/guests")
      if (response.ok) {
        const data = await response.json()
        setGuests(data)
      } else {
        throw new Error("Failed to fetch guests")
      }
    } catch (error) {
      console.error("Error fetching guests:", error)
      toast({
        title: "Error",
        description: "Failed to fetch guests. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/rooms")
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
      } else {
        throw new Error("Failed to fetch rooms")
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch rooms. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/employees")
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      } else {
        throw new Error("Failed to fetch employees")
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast({
        title: "Error",
        description: "Failed to fetch employees. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleConvertReservation = async () => {
    if (!selectedReservation || !newRental.employee_id || !newRental.checkin_date || !newRental.checkout_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`http://localhost:5010/api/rental/${selectedReservation.reservation_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: newRental.employee_id,
          checkin_date: format(newRental.checkin_date, "yyyy-MM-dd"),
          checkout_date: format(newRental.checkout_date, "yyyy-MM-dd"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reservation converted to rental successfully.",
        })
        setIsConvertingReservation(false)
        setSelectedReservation(null)
        setNewRental({})
        fetchReservations()
        fetchRentals()
      } else {
        throw new Error("Failed to convert reservation to rental")
      }
    } catch (error) {
      console.error("Error converting reservation to rental:", error)
      toast({
        title: "Error",
        description: "Failed to convert reservation to rental. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateDirectRental = async () => {
    if (
      !newRental.guest_id ||
      !newRental.room_id ||
      !newRental.employee_id ||
      !newRental.checkin_date ||
      !newRental.checkout_date
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // First create a reservation
      const reservationResponse = await fetch("http://localhost:5010/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guest_id: newRental.guest_id,
          room_id: newRental.room_id,
          start_date: format(newRental.checkin_date, "yyyy-MM-dd"),
          end_date: format(newRental.checkout_date, "yyyy-MM-dd"),
        }),
      })

      if (!reservationResponse.ok) {
        throw new Error("Failed to create reservation")
      }

      const reservationData = await reservationResponse.json()
      const reservationId = reservationData.reservation_id

      // Then convert it to a rental
      const rentalResponse = await fetch(`http://localhost:5010/api/rental/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: newRental.employee_id,
          checkin_date: format(newRental.checkin_date, "yyyy-MM-dd"),
          checkout_date: format(newRental.checkout_date, "yyyy-MM-dd"),
        }),
      })

      if (rentalResponse.ok) {
        toast({
          title: "Success",
          description: "Direct rental created successfully.",
        })
        setIsCreatingDirectRental(false)
        setNewRental({})
        fetchReservations()
        fetchRentals()
      } else {
        throw new Error("Failed to create direct rental")
      }
    } catch (error) {
      console.error("Error creating direct rental:", error)
      toast({
        title: "Error",
        description: "Failed to create direct rental. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleArchiveRental = async (rentalId: number) => {
    try {
      // Get the rental details first
      const rental = rentals.find((r) => r.rental_id === rentalId)
      if (!rental) {
        throw new Error("Rental not found")
      }

      // Archive the rental
      const archiveResponse = await fetch("http://localhost:5010/api/archive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_id: rentalId,
          type: "Rental",
          data_snapshot: JSON.stringify(rental),
        }),
      })

      if (!archiveResponse.ok) {
        throw new Error("Failed to archive rental")
      }

      // Delete the rental
      const deleteResponse = await fetch(`http://localhost:5010/api/Rental/${rentalId}`, {
        method: "DELETE",
      })

      if (deleteResponse.ok) {
        toast({
          title: "Success",
          description: "Rental archived successfully.",
        })
        fetchRentals()
      } else {
        throw new Error("Failed to delete rental after archiving")
      }
    } catch (error) {
      console.error("Error archiving rental:", error)
      toast({
        title: "Error",
        description: "Failed to archive rental. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <Tabs defaultValue="reservations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="direct-rental">Create Direct Rental</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Pending Reservations</h2>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.reservation_id}>
                    <TableCell>{reservation.reservation_id}</TableCell>
                    <TableCell>{reservation.guest_name || `Guest #${reservation.guest_id}`}</TableCell>
                    <TableCell>
                      Room #{reservation.room_id}
                      {reservation.room_details?.hotel_name && (
                        <div className="text-sm text-muted-foreground">{reservation.room_details.hotel_name}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(reservation.start_date), "MMM d, yyyy")} -{" "}
                      {format(new Date(reservation.end_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge>{reservation.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReservation(reservation)
                          setIsConvertingReservation(true)
                          setNewRental({
                            reservation_id: reservation.reservation_id,
                            checkin_date: new Date(reservation.start_date),
                            checkout_date: new Date(reservation.end_date),
                          })
                        }}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Check In
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {reservations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No pending reservations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isConvertingReservation} onOpenChange={setIsConvertingReservation}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convert Reservation to Rental</DialogTitle>
                <DialogDescription>Complete the check-in process for this reservation.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="reservation-id" className="text-right">
                    Reservation
                  </Label>
                  <Input
                    id="reservation-id"
                    value={`#${selectedReservation?.reservation_id} - ${selectedReservation?.guest_name || `Guest #${selectedReservation?.guest_id}`}`}
                    disabled
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee" className="text-right">
                    Employee
                  </Label>
                  <Select
                    value={newRental.employee_id?.toString() || ""}
                    onValueChange={(value) => setNewRental({ ...newRental, employee_id: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.employee_id} value={employee.employee_id.toString()}>
                          {employee.full_name} ({employee.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkin-date" className="text-right">
                    Check-in Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRental.checkin_date ? format(newRental.checkin_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newRental.checkin_date}
                        onSelect={(date) => date && setNewRental({ ...newRental, checkin_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkout-date" className="text-right">
                    Check-out Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRental.checkout_date ? format(newRental.checkout_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newRental.checkout_date}
                        onSelect={(date) => date && setNewRental({ ...newRental, checkout_date: date })}
                        initialFocus
                        disabled={(date) => (newRental.checkin_date ? date < newRental.checkin_date : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsConvertingReservation(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConvertReservation}>Complete Check-in</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="rentals">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Active Rentals</h2>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental.rental_id}>
                    <TableCell>{rental.rental_id}</TableCell>
                    <TableCell>{rental.guest_name || `Guest #${rental.guest_id}`}</TableCell>
                    <TableCell>
                      Room #{rental.room_id}
                      {rental.room_details?.hotel_name && (
                        <div className="text-sm text-muted-foreground">{rental.room_details.hotel_name}</div>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(rental.checkin_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(rental.checkout_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{rental.employee_name || `Employee #${rental.employee_id}`}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleArchiveRental(rental.rental_id)}>
                        Archive
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rentals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No active rentals found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="direct-rental">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Create Direct Rental</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Direct Rental</CardTitle>
              <CardDescription>Create a rental without a prior reservation for walk-in guests.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guest" className="text-right">
                    Guest
                  </Label>
                  <Select
                    value={newRental.guest_id?.toString() || ""}
                    onValueChange={(value) => setNewRental({ ...newRental, guest_id: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {guests.map((guest) => (
                        <SelectItem key={guest.guest_id} value={guest.guest_id.toString()}>
                          {guest.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room" className="text-right">
                    Room
                  </Label>
                  <Select
                    value={newRental.room_id?.toString() || ""}
                    onValueChange={(value) => setNewRental({ ...newRental, room_id: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.room_id} value={room.room_id.toString()}>
                          Room #{room.room_id} - {room.hotel_name || `Hotel #${room.hotel_id}`} (${Number(room.price)}/night)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee" className="text-right">
                    Employee
                  </Label>
                  <Select
                    value={newRental.employee_id?.toString() || ""}
                    onValueChange={(value) => setNewRental({ ...newRental, employee_id: Number.parseInt(value) })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.employee_id} value={employee.employee_id.toString()}>
                          {employee.full_name} ({employee.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkin-date" className="text-right">
                    Check-in Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRental.checkin_date ? format(newRental.checkin_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newRental.checkin_date}
                        onSelect={(date) => date && setNewRental({ ...newRental, checkin_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkout-date" className="text-right">
                    Check-out Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newRental.checkout_date ? format(newRental.checkout_date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newRental.checkout_date}
                        onSelect={(date) => date && setNewRental({ ...newRental, checkout_date: date })}
                        initialFocus
                        disabled={(date) => (newRental.checkin_date ? date < newRental.checkin_date : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateDirectRental} className="ml-auto">
                Create Direct Rental
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

