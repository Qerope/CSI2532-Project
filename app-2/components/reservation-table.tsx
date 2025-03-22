"use client"

import { useState, useEffect } from "react"
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

// Base interface matching the database schema exactly
interface Reservation {
  reservation_id: number
  guest_id: number
  room_id: number
  start_date: string
  end_date: string
  status: string
}

// Interface for API response which may include joined data
interface ReservationWithDetails extends Reservation {
  guest_name?: string
  phone?: string
  room_number?: string
  room_type?: string
  hotel_name?: string
}

interface ReservationTableProps {
  type?: "all" | "checkin"
}

export function ReservationTable({ type = "all" }: ReservationTableProps) {
  const router = useRouter()
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null)

  // Add state for reservations:
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  // Add useEffect to fetch reservations:
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:5010/api/reservations${type === "checkin" ? "?checkin=today" : ""}`)

        if (!response.ok) {
          throw new Error("Failed to fetch reservations")
        }

        const data = await response.json()
        setReservations(data)
      } catch (error) {
        console.error("Error fetching reservations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [type])

  // Filter reservations based on type
  const filteredReservations =
    type === "checkin"
      ? reservations.filter(
          (res) => new Date(res.start_date).toISOString().split("T")[0] === new Date().toISOString().split("T")[0],
        )
      : reservations

  const handleCheckIn = (reservation: ReservationWithDetails) => {
    setSelectedReservation(reservation)
    setCheckInDialogOpen(true)
  }

  const confirmCheckIn = async () => {
    if (!selectedReservation) return

    try {
      // Call API to convert reservation to rental
      const response = await fetch(`http://localhost:5010/api/rental/${selectedReservation.reservation_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_id: 1, // Default employee ID
          checkin_date: selectedReservation.start_date,
          checkout_date: selectedReservation.end_date,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to check in guest")
      }

      setCheckInDialogOpen(false)
      // Refresh reservations
      router.refresh()
      // Redirect to the rental page or show a success message
      router.push(`/employee/rentals?success=checkin&id=${selectedReservation.reservation_id}`)
    } catch (error) {
      console.error("Error checking in guest:", error)
    }
  }

  if (loading) {
    return (
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
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Loading reservations...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
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
                <TableRow key={reservation.reservation_id}>
                  <TableCell className="font-medium">{reservation.reservation_id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{reservation.guest_name || `Guest #${reservation.guest_id}`}</div>
                      {reservation.phone && <div className="text-sm text-gray-500">{reservation.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>Room {reservation.room_number || reservation.room_id}</div>
                      {reservation.room_type && <div className="text-sm text-gray-500">{reservation.room_type}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(reservation.start_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(reservation.end_date), "MMM d, yyyy")}</TableCell>
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
                  <p className="text-sm">
                    {selectedReservation.guest_name || `Guest #${selectedReservation.guest_id}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm">
                    {selectedReservation.room_number || `Room #${selectedReservation.room_id}`}
                    {selectedReservation.room_type && ` (${selectedReservation.room_type})`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <p className="text-sm">{format(new Date(selectedReservation.start_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <p className="text-sm">{format(new Date(selectedReservation.end_date), "MMM d, yyyy")}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Reservation ID</p>
                <p className="text-sm">{selectedReservation.reservation_id}</p>
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

