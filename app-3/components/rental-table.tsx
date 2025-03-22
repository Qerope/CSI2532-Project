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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

// Updated interface to match database schema
interface Rental {
  rental_id: number
  reservation_id: number
  guest_id: number
  room_id: number
  employee_id: number
  checkin_date: string
  checkout_date: string
  // Additional fields from API response
  guest_name?: string
  employee_name?: string
  room_number?: string
  room_type?: string
  hotel_name?: string
  phone?: string
  paidAmount?: number
  totalAmount?: number
}

interface RentalTableProps {
  type?: "all" | "checkout"
}

export function RentalTable({ type = "all" }: RentalTableProps) {
  const router = useRouter()
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")

  // Add state for rentals:
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)

  // Add useEffect to fetch rentals:
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch(`http://localhost:5010/api/rentals${type === "checkout" ? "?checkout=today" : ""}`)

        if (!response.ok) {
          throw new Error("Failed to fetch rentals")
        }

        const data = await response.json()
        setRentals(data)
      } catch (error) {
        console.error("Error fetching rentals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [type])

  // Filter rentals based on type
  const filteredRentals =
    type === "checkout"
      ? rentals.filter(
          (rental) =>
            new Date(rental.checkout_date).toISOString().split("T")[0] === new Date().toISOString().split("T")[0],
        )
      : rentals

  const handleCheckOut = (rental: Rental) => {
    setSelectedRental(rental)

    // If payment is not complete, show payment dialog first
    if ((rental.paidAmount || 0) < (rental.totalAmount || 0)) {
      setPaymentAmount(((rental.totalAmount || 0) - (rental.paidAmount || 0)).toFixed(2))
      setPaymentDialogOpen(true)
    } else {
      setCheckOutDialogOpen(true)
    }
  }

  const handlePayment = (rental: Rental) => {
    setSelectedRental(rental)
    setPaymentAmount(((rental.totalAmount || 0) - (rental.paidAmount || 0)).toFixed(2))
    setPaymentDialogOpen(true)
  }

  const confirmPayment = async () => {
    if (!selectedRental) return

    try {
      // Call API to record payment
      const response = await fetch(`http://localhost:5010/api/rental/${selectedRental.rental_id}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(paymentAmount),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process payment")
      }

      setPaymentDialogOpen(false)

      // If this was a checkout operation, proceed to checkout
      if (type === "checkout") {
        setCheckOutDialogOpen(true)
      } else {
        // Refresh rentals
        fetchRentals()
        // Show success message or redirect
        router.push(`/employee/rentals?success=payment&id=${selectedRental.rental_id}`)
      }
    } catch (error) {
      console.error("Error processing payment:", error)
    }
  }

  const confirmCheckOut = async () => {
    if (!selectedRental) return

    try {
      // Call API to archive rental
      const archiveResponse = await fetch("http://localhost:5010/api/archive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original_id: selectedRental.rental_id,
          type: "Rental",
          data_snapshot: JSON.stringify(selectedRental),
        }),
      })

      if (!archiveResponse.ok) {
        throw new Error("Failed to archive rental")
      }

      // Delete the rental
      const deleteResponse = await fetch(`http://localhost:5010/api/rental/${selectedRental.rental_id}`, {
        method: "DELETE",
      })

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete rental after archiving")
      }

      setCheckOutDialogOpen(false)
      // Refresh rentals
      const fetchRentals = async () => {
        try {
          const response = await fetch(`http://localhost:5010/api/rentals${type === "checkout" ? "?checkout=today" : ""}`)

          if (!response.ok) {
            throw new Error("Failed to fetch rentals")
          }

          const data = await response.json()
          setRentals(data)
        } catch (error) {
          console.error("Error fetching rentals:", error)
        }
      }
      fetchRentals()
      // Redirect or show success message
      router.push(`/employee/dashboard?success=checkout&id=${selectedRental.rental_id}`)
    } catch (error) {
      console.error("Error checking out rental:", error)
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Loading rentals...
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
              <TableHead>Rental ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental) => (
                <TableRow key={rental.rental_id}>
                  <TableCell className="font-medium">{rental.rental_id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{rental.guest_name || `Guest #${rental.guest_id}`}</div>
                      {rental.phone && <div className="text-sm text-gray-500">{rental.phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>Room {rental.room_number || rental.room_id}</div>
                      {rental.room_type && <div className="text-sm text-gray-500">{rental.room_type}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(rental.checkin_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{format(new Date(rental.checkout_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div>
                      <div>
                        ${(rental.paidAmount || 0).toFixed(2)} / ${(rental.totalAmount || 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(rental.paidAmount || 0) >= (rental.totalAmount || 0) ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(rental.paidAmount || 0) < (rental.totalAmount || 0) && (
                        <Button variant="outline" size="sm" onClick={() => handlePayment(rental)}>
                          Payment
                        </Button>
                      )}
                      <Button variant="default" size="sm" onClick={() => handleCheckOut(rental)}>
                        Check Out
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No active rentals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>Record payment for this rental.</DialogDescription>
          </DialogHeader>

          {selectedRental && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Guest</p>
                  <p className="text-sm">{selectedRental.guest_name || `Guest #${selectedRental.guest_id}`}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm">
                    {selectedRental.room_number || `Room #${selectedRental.room_id}`}
                    {selectedRental.room_type && ` (${selectedRental.room_type})`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-sm">${(selectedRental.totalAmount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount Paid</p>
                  <p className="text-sm">${(selectedRental.paidAmount || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-amount">Payment Amount</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  step="0.01"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPayment}>Process Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={checkOutDialogOpen} onOpenChange={setCheckOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check Out Guest</DialogTitle>
            <DialogDescription>Complete this rental and archive the record.</DialogDescription>
          </DialogHeader>

          {selectedRental && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Guest</p>
                  <p className="text-sm">{selectedRental.guest_name || `Guest #${selectedRental.guest_id}`}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm">
                    {selectedRental.room_number || `Room #${selectedRental.room_id}`}
                    {selectedRental.room_type && ` (${selectedRental.room_type})`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <p className="text-sm">{format(new Date(selectedRental.checkin_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <p className="text-sm">{format(new Date(selectedRental.checkout_date), "MMM d, yyyy")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-sm">${(selectedRental.totalAmount || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <p className="text-sm">
                    {(selectedRental.paidAmount || 0) >= (selectedRental.totalAmount || 0) ? "Paid" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckOutDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCheckOut}>Confirm Check Out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

