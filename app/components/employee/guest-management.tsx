"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash } from "lucide-react"

interface Guest {
  guest_id: number
  full_name: string
  address: string
  SIN: string
  date_of_checkin: string
}

export function GuestManagement() {
  const { toast } = useToast()

  const [guests, setGuests] = useState<Guest[]>([])
  const [isAddingGuest, setIsAddingGuest] = useState(false)
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({})

  useEffect(() => {
    fetchGuests()
  }, [])

  const fetchGuests = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/guests")
      if (response.ok) {
        const data = await response.json()
        setGuests(data)
      }
    } catch (error) {
      console.error("Error fetching guests:", error)
    }
  }

  const handleAddGuest = async () => {
    if (!newGuest.full_name || !newGuest.address || !newGuest.SIN || !newGuest.date_of_checkin) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("http://localhost:5010/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newGuest,
          date_of_checkin: format(new Date(newGuest.date_of_checkin as string), "yyyy-MM-dd"),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Guest added successfully.",
        })
        setIsAddingGuest(false)
        setNewGuest({})
        fetchGuests()
      } else {
        throw new Error("Failed to add guest")
      }
    } catch (error) {
      console.error("Error adding guest:", error)
      toast({
        title: "Error",
        description: "Failed to add guest. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGuest = async (guestId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/Guest/${guestId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Guest deleted successfully.",
        })
        fetchGuests()
      } else {
        throw new Error("Failed to delete guest")
      }
    } catch (error) {
      console.error("Error deleting guest:", error)
      toast({
        title: "Error",
        description: "Failed to delete guest. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Guest Management</h2>
        <Dialog open={isAddingGuest} onOpenChange={setIsAddingGuest}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guest</DialogTitle>
              <DialogDescription>Enter the details for the new guest.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="full_name" className="text-right">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  value={newGuest.full_name || ""}
                  onChange={(e) => setNewGuest({ ...newGuest, full_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newGuest.address || ""}
                  onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sin" className="text-right">
                  SIN
                </Label>
                <Input
                  id="sin"
                  value={newGuest.SIN || ""}
                  onChange={(e) => setNewGuest({ ...newGuest, SIN: e.target.value })}
                  className="col-span-3"
                  placeholder="9-digit number"
                  maxLength={9}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date_of_checkin" className="text-right">
                  Registration Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newGuest.date_of_checkin
                        ? format(new Date(newGuest.date_of_checkin as string), "PPP")
                        : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newGuest.date_of_checkin ? new Date(newGuest.date_of_checkin as string) : undefined}
                      onSelect={(date) => date && setNewGuest({ ...newGuest, date_of_checkin: date.toISOString() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingGuest(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGuest}>Add Guest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>SIN</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.guest_id}>
                <TableCell>{guest.guest_id}</TableCell>
                <TableCell>{guest.full_name}</TableCell>
                <TableCell>{guest.address}</TableCell>
                <TableCell>{guest.SIN}</TableCell>
                <TableCell>{format(new Date(guest.date_of_checkin), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteGuest(guest.guest_id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {guests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No guests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

