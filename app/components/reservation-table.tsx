"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"

interface ReservationTableProps {
  type?: "all" | "checkin"
}

export function ReservationTable({ type = "all" }: ReservationTableProps) {
  const router = useRouter()
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<any>(null)

  // In a real application, this data would come from your database
  const reservations = [
    {
      id: "RES-1234",
      guestName: "John Smith",
      roomNumber: "301",
      roomType: "Deluxe Room",
      checkIn: "2024-06-15",
      checkOut: "2024-06-20",
      status: "Confirmed",
      guests: 2,
      phone: "+1 (555) 123-4567",
    },
    {
      id: "RES-5678",
      guestName: "Jane Doe",
      roomNumber: "205",
      roomType: "Standard Room",
      checkIn: "2024-06-15",
      checkOut: "2024-06-18",
      status: "Confirmed",
      guests: 1,
      phone: "+1 (555) 987-6543",
    },
    {
      id: "RES-9012",
      guestName: "Robert Johnson",
      roomNumber: "410",
      roomType: "Suite",
      checkIn: "2024-06-16",
      checkOut: "2024-06-22",
      status: "Confirmed",
      guests: 3,
      phone: "+1 (555) 456-7890",
    },
    {
      id: "RES-3456",
      guestName: "Emily Wilson",
      roomNumber: "118",
      roomType: "Double Room",
      checkIn: "2024-06-15",
      checkOut: "2024-06-17",
      status: "Confirmed",
      guests: 2,
      phone: "+1 (555) 234-5678",
    },
  ]

  // Filter reservations based on type
  const filteredReservations =
    type === "checkin" ? reservations.filter((res) => res.checkIn === format(new Date(), "yyyy-MM-dd")) : reservations

  const handleCheckIn = (reservation: any) => {
    setSelectedReservation(reservation)
    setCheckInDialogOpen(true)
  }

  const confirmCheckIn = () => {
    // In a real application, this would call an API to convert the reservation to a rental

    setCheckInDialogOpen(false)
    // Redirect to the rental page or show a success message
    router.push(`/employee/rentals?success=checkin&id=${selectedReservation.id}`)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reservation ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{reservation.guestName}</div>
                      <div className="text-sm text-gray-500">{reservation.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>Room {reservation.roomNumber}</div>
                      <div className="text-sm text-gray-500">{reservation.roomType}</div>
                    </div>
                  </TableCell>
                  <TableCell>{reservation.checkIn}</TableCell>
                  <TableCell>{reservation.checkOut}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{reservation.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="default" size="sm" onClick={() => handleCheckIn(reservation)}>
                      Check In
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No reservations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={checkInDialogOpen} onOpenChange={setCheckInDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In Guest</DialogTitle>
            <DialogDescription>Convert this reservation to an active rental.</DialogDescription>
          </DialogHeader>

          {selectedReservation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Guest</p>
                  <p className="text-sm">{selectedReservation.guestName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm">
                    {selectedReservation.roomNumber} ({selectedReservation.roomType})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <p className="text-sm">{selectedReservation.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <p className="text-sm">{selectedReservation.checkOut}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Reservation ID</p>
                <p className="text-sm">{selectedReservation.id}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckInDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCheckIn}>Confirm Check In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

