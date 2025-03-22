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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, DollarSign } from "lucide-react"

// Base interface matching the database schema exactly
interface Rental {
  rental_id: number
  reservation_id: number
  guest_id: number
  room_id: number
  employee_id: number
  checkin_date: string
  checkout_date: string
}

// Interface for Payment table
interface Payment {
  payment_id: number
  rental_id: number
  amount: number
  payment_method: string
  payment_date: string
}

// Interface for API response which may include joined data
interface RentalWithDetails extends Rental {
  guest_name?: string
  employee_name?: string
  room_number?: string
  room_type?: string
  hotel_name?: string
  phone?: string
  payments?: Payment[]
  totalamount?: number
}

interface RentalTableProps {
  type?: "all" | "checkout"
}

export function RentalTable({ type = "all" }: RentalTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<RentalWithDetails | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card")

  // Add state for rentals:
  const [rentals, setRentals] = useState<RentalWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  // Add useEffect to fetch rentals:
  useEffect(() => {
    fetchRentals()
  }, [type])

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

  // Filter rentals based on type
  const filteredRentals =
    type === "checkout"
      ? rentals.filter(
          (rental) =>
            new Date(rental.checkout_date).toISOString().split("T")[0] === new Date().toISOString().split("T")[0],
        )
      : rentals

  const handleCheckOut = (rental: RentalWithDetails) => {
    setSelectedRental(rental)

    // Calculate total paid amount
    const totalPaid = rental.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    // If payment is not complete, show payment dialog first
    if (totalPaid < (Number(rental.totalamount) || 0)) {
      setPaymentAmount(((Number(rental.totalamount) || 0) - totalPaid).toFixed(2))
      setPaymentDialogOpen(true)
    } else {
      setCheckOutDialogOpen(true)
    }
  }

  const handlePayment = (rental: RentalWithDetails) => {
    setSelectedRental(rental)

    // Calculate total paid amount
    const totalPaid = rental.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0

    setPaymentAmount(((Number(rental.totalamount) || 0) - totalPaid).toFixed(2))
    setPaymentDialogOpen(true)
  }

  const confirmPayment = async () => {
    if (!selectedRental) return

    try {
      // Call API to record payment
      const response = await fetch("http://localhost:5010/api/payment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rental_id: selectedRental.rental_id,
          amount: Number.parseFloat(paymentAmount),
          payment_method: paymentMethod,
          payment_date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process payment")
      }

      toast({
        title: "Payment successful",
        description: `Payment of $${paymentAmount} processed successfully.`,
      })

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
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
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

      toast({
        title: "Check-out successful",
        description: "The guest has been checked out successfully.",
      })

      setCheckOutDialogOpen(false)
      // Refresh rentals
      fetchRentals()
      // Redirect or show success message
      router.push(`/employee/dashboard?success=checkout&id=${selectedRental.rental_id}`)
    } catch (error) {
      console.error("Error checking out rental:", error)
      toast({
        title: "Error",
        description: "Failed to check out guest. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calculate total paid amount for a rental
  const calculateTotalPaid = (rental: RentalWithDetails) => {
    return rental.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0
  }

  // Check if payment is complete
  const isPaymentComplete = (rental: RentalWithDetails) => {
    const totalPaid = calculateTotalPaid(rental)
    return totalPaid >= (Number(rental.totalamount) || 0)
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
              filteredRentals.map((rental) => {
                const totalPaid = calculateTotalPaid(rental)
                const paymentComplete = isPaymentComplete(rental)

                return (
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
                          ${totalPaid.toFixed(2)} / ${(Number(rental.totalamount) || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {paymentComplete ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          )}
                        </div>
                        {rental.payments && rental.payments.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">{rental.payments.length} payment(s)</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!paymentComplete && (
                          <Button variant="outline" size="sm" onClick={() => handlePayment(rental)}>
                            <CreditCard className="h-4 w-4 mr-1" />
                            Payment
                          </Button>
                        )}
                        <Button variant="default" size="sm" onClick={() => handleCheckOut(rental)}>
                          Check Out
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
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
                  <p className="text-sm">${(Number(selectedRental.totalamount) || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount Paid</p>
                  <p className="text-sm">${calculateTotalPaid(selectedRental).toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-amount">Payment Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Debit Card">Debit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedRental.payments && selectedRental.payments.length > 0 && (
                <div className="space-y-2 mt-4">
                  <Label>Previous Payments</Label>
                  <div className="border rounded-md divide-y">
                    {selectedRental.payments.map((payment) => (
                      <div key={payment.payment_id} className="p-2 flex justify-between items-center">
                        <div>
                          <div className="font-medium">${Number(payment.amount).toFixed(2)}</div>
                          <div className="text-xs text-gray-500">{payment.payment_method}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(payment.payment_date), "MMM d, yyyy h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                  <p className="text-sm">${(Number(selectedRental.totalamount) || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <p className="text-sm">
                    {isPaymentComplete(selectedRental) ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              {!isPaymentComplete(selectedRental) && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md">
                  <p className="text-sm font-medium">Warning: Payment Incomplete</p>
                  <p className="text-xs">
                    The guest has not paid the full amount. Consider collecting the remaining payment before check-out.
                  </p>
                </div>
              )}
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

