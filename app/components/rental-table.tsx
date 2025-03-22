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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

interface RentalTableProps {
  type?: "all" | "checkout"
}

export function RentalTable({ type = "all" }: RentalTableProps) {
  const router = useRouter()
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<any>(null)
  const [paymentAmount, setPaymentAmount] = useState("")

  // In a real application, this data would come from your database
  const rentals = [
    {
      id: "RNT-1234",
      reservationId: "RES-1234",
      guestName: "John Smith",
      roomNumber: "301",
      roomType: "Deluxe Room",
      checkIn: "2024-06-15",
      checkOut: "2024-06-20",
      status: "Active",
      guests: 2,
      phone: "+1 (555) 123-4567",
      totalAmount: 1499.95,
      paidAmount: 0,
    },
    {
      id: "RNT-5678",
      reservationId: "RES-5678",
      guestName: "Jane Doe",
      roomNumber: "205",
      roomType: "Standard Room",
      checkIn: "2024-06-15",
      checkOut: "2024-06-18",
      status: "Active",
      guests: 1,
      phone: "+1 (555) 987-6543",
      totalAmount: 599.97,
      paidAmount: 0,
    },
    {
      id: "RNT-9012",
      reservationId: "RES-9012",
      guestName: "Robert Johnson",
      roomNumber: "410",
      roomType: "Suite",
      checkIn: "2024-06-16",
      checkOut: "2024-06-22",
      status: "Active",
      guests: 3,
      phone: "+1 (555) 456-7890",
      totalAmount: 2099.94,
      paidAmount: 0,
    },
    {
      id: "RNT-3456",
      reservationId: "RES-3456",
      guestName: "Emily Wilson",
      roomNumber: "118",
      roomType: "Double Room",
      checkIn: "2024-06-15",
      checkOut: "2024-06-17",
      status: "Active",
      guests: 2,
      phone: "+1 (555) 234-5678",
      totalAmount: 299.98,
      paidAmount: 0,
    },
  ]

  // Filter rentals based on type
  const filteredRentals =
    type === "checkout" ? rentals.filter((rental) => rental.checkOut === format(new Date(), "yyyy-MM-dd")) : rentals

  const handleCheckOut = (rental: any) => {
    setSelectedRental(rental)

    // If payment is not complete, show payment dialog first
    if (true) {
      setPaymentAmount((rental.totalAmount - rental.paidAmount).toFixed(2))
      setPaymentDialogOpen(true)
    } else {
      setCheckOutDialogOpen(true)
    }
  }

  const handlePayment = (rental: any) => {
    setSelectedRental(rental)
    setPaymentAmount((rental.totalAmount - rental.paidAmount).toFixed(2))
    setPaymentDialogOpen(true)
  }

  const confirmPayment = () => {
    // In a real application, this would call an API to record the payment

    setPaymentDialogOpen(false)

    // If this was a checkout operation, proceed to checkout
    if (type === "checkout") {
      setCheckOutDialogOpen(true)
    } else {
      // Show success message or redirect
      router.push(`/employee/rentals?success=payment&id=${selectedRental.id}`)
    }
  }

  const confirmCheckOut = () => {
    // In a real application, this would call an API to complete the rental

    setCheckOutDialogOpen(false)
    // Redirect or show success message
    router.push(`/employee/dashboard?success=checkout&id=${selectedRental.id}`)
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
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{rental.guestName}</div>
                      <div className="text-sm text-gray-500">{rental.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>Room {rental.roomNumber}</div>
                      <div className="text-sm text-gray-500">{rental.roomType}</div>
                    </div>
                  </TableCell>
                  <TableCell>{rental.checkIn}</TableCell>
                  <TableCell>{rental.checkOut}</TableCell>
                  <TableCell>
                    <div>
                      <div>
                        ${} / ${}
                      </div>
                      <div className="text-sm text-gray-500">
                        {rental.paidAmount >= rental.totalAmount ? (
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
                      {rental.paidAmount < rental.totalAmount && (
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
                  <p className="text-sm">{selectedRental.guestName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm">
                    {selectedRental.roomNumber} ({selectedRental.roomType})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-sm">${selectedRental.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount Paid</p>
                  <p className="text-sm">${selectedRental.paidAmount.toFixed(2)}</p>
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
                  <p className="text-sm">{selectedRental.guestName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm">
                    {selectedRental.roomNumber} ({selectedRental.roomType})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <p className="text-sm">{selectedRental.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <p className="text-sm">{selectedRental.checkOut}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-sm">${selectedRental.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <p className="text-sm">
                    {selectedRental.paidAmount >= selectedRental.totalAmount ? "Paid" : "Pending"}
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

