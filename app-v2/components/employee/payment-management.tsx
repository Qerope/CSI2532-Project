"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, DollarSign, Edit, Plus, Trash } from "lucide-react"

// Interface matching the database schema exactly
interface Payment {
  payment_id: number
  rental_id: number
  amount: number
  payment_method: string
  payment_date: string
}

// Interface for API response which may include joined data
interface PaymentWithDetails extends Payment {
  guest_name?: string
  room_number?: string
  hotel_name?: string
}

interface Rental {
  rental_id: number
  reservation_id: number
  guest_id: number
  room_id: number
  employee_id: number
  checkin_date: string
  checkout_date: string
}

// Interface for API response which may include joined data
interface RentalWithDetails extends Rental {
  guest_name?: string
  room_number?: string
  hotel_name?: string
  totalamount?: number
}

export function PaymentManagement() {
  const { toast } = useToast()

  const [payments, setPayments] = useState<PaymentWithDetails[]>([])
  const [rentals, setRentals] = useState<RentalWithDetails[]>([])
  const [isAddingPayment, setIsAddingPayment] = useState(false)
  const [isEditingPayment, setIsEditingPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentWithDetails | null>(null)
  const [newPayment, setNewPayment] = useState<Partial<Payment>>({
    payment_method: "Credit Card",
    payment_date: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPayments()
    fetchRentals()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/payments")
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      } else {
        throw new Error("Failed to fetch payments")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast({
        title: "Error",
        description: "Failed to fetch payments. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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

  const handleAddPayment = async () => {
    if (!newPayment.rental_id || !newPayment.amount || !newPayment.payment_method || !newPayment.payment_date) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:5010/api/payment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPayment),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment added successfully.",
        })
        setIsAddingPayment(false)
        setNewPayment({
          payment_method: "Credit Card",
          payment_date: new Date().toISOString(),
        })
        fetchPayments()
      } else {
        throw new Error("Failed to add payment")
      }
    } catch (error) {
      console.error("Error adding payment:", error)
      toast({
        title: "Error",
        description: "Failed to add payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditPayment = async () => {
    if (!selectedPayment) return

    try {
      const response = await fetch(`http://localhost:5010/api/payment/${selectedPayment.payment_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rental_id: selectedPayment.rental_id,
          amount: selectedPayment.amount,
          payment_method: selectedPayment.payment_method,
          payment_date: selectedPayment.payment_date,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment updated successfully.",
        })
        setIsEditingPayment(false)
        setSelectedPayment(null)
        fetchPayments()
      } else {
        throw new Error("Failed to update payment")
      }
    } catch (error) {
      console.error("Error updating payment:", error)
      toast({
        title: "Error",
        description: "Failed to update payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePayment = async (paymentId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/payment/${paymentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment deleted successfully.",
        })
        fetchPayments()
      } else {
        throw new Error("Failed to delete payment")
      }
    } catch (error) {
      console.error("Error deleting payment:", error)
      toast({
        title: "Error",
        description: "Failed to delete payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter payments based on search term
  const filteredPayments = payments.filter((payment) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      payment.payment_id.toString().includes(searchLower) ||
      payment.rental_id.toString().includes(searchLower) ||
      (payment.guest_name && payment.guest_name.toLowerCase().includes(searchLower)) ||
      (payment.room_number && payment.room_number.toLowerCase().includes(searchLower)) ||
      (payment.hotel_name && payment.hotel_name.toLowerCase().includes(searchLower)) ||
      payment.payment_method.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <Dialog open={isAddingPayment} onOpenChange={setIsAddingPayment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment</DialogTitle>
              <DialogDescription>Enter the details for the new payment.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rental_id" className="text-right">
                  Rental
                </Label>
                <Select
                  value={newPayment.rental_id?.toString() || ""}
                  onValueChange={(value) => setNewPayment({ ...newPayment, rental_id: Number.parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a rental" />
                  </SelectTrigger>
                  <SelectContent>
                    {rentals.map((rental) => (
                      <SelectItem key={rental.rental_id} value={rental.rental_id.toString()}>
                        Rental #{rental.rental_id} - {rental.guest_name || `Guest #${rental.guest_id}`}
                        {rental.room_number && ` (Room ${rental.room_number})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <div className="col-span-3 relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newPayment.amount || ""}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number.parseFloat(e.target.value) })}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_method" className="text-right">
                  Payment Method
                </Label>
                <Select
                  value={newPayment.payment_method || ""}
                  onValueChange={(value) => setNewPayment({ ...newPayment, payment_method: value })}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_date" className="text-right">
                  Payment Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newPayment.payment_date ? format(new Date(newPayment.payment_date), "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newPayment.payment_date ? new Date(newPayment.payment_date) : undefined}
                      onSelect={(date) => date && setNewPayment({ ...newPayment, payment_date: date.toISOString() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingPayment(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPayment}>Add Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Label htmlFor="search" className="mb-2 block">
          Search Payments
        </Label>
        <Input
          id="search"
          placeholder="Search by ID, guest name, room number, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Rental</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading payments...
                </TableCell>
              </TableRow>
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell>{payment.payment_id}</TableCell>
                  <TableCell>{payment.rental_id}</TableCell>
                  <TableCell>{payment.guest_name || "N/A"}</TableCell>
                  <TableCell>{payment.room_number || "N/A"}</TableCell>
                  <TableCell>${Number(payment.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {payment.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(payment.payment_date), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment)
                          setIsEditingPayment(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeletePayment(payment.payment_id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditingPayment} onOpenChange={setIsEditingPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment</DialogTitle>
            <DialogDescription>Update the payment details.</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-rental-id" className="text-right">
                  Rental ID
                </Label>
                <Input id="edit-rental-id" value={selectedPayment.rental_id} readOnly className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-amount" className="text-right">
                  Amount
                </Label>
                <div className="col-span-3 relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    value={selectedPayment.amount}
                    onChange={(e) =>
                      setSelectedPayment({ ...selectedPayment, amount: Number.parseFloat(e.target.value) })
                    }
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-payment-method" className="text-right">
                  Payment Method
                </Label>
                <Select
                  value={selectedPayment.payment_method}
                  onValueChange={(value) => setSelectedPayment({ ...selectedPayment, payment_method: value })}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-payment-date" className="text-right">
                  Payment Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(selectedPayment.payment_date), "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(selectedPayment.payment_date)}
                      onSelect={(date) =>
                        date && setSelectedPayment({ ...selectedPayment, payment_date: date.toISOString() })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPayment(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPayment}>Update Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

