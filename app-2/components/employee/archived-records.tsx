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
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Archive, Calendar, Clock, CreditCard, Eye, FileText, Hotel, MapPin, User, Users } from 'lucide-react'

// Interface for archived records
interface ArchivedRecord {
  record_id: number
  original_id: number
  type: string
  data_snapshot: string
  archived_at: string

  // Reservation-related fields
  reservation_id?: number
  reservation_guest_id?: number
  reservation_room_id?: number
  start_date?: string
  end_date?: string
  reservation_status?: string

  // Rental-related fields
  rental_id?: number
  checkin_date?: string
  checkout_date?: string
  rental_employee_id?: number
  rental_guest_id?: number
  rental_room_id?: number

  // Hotel Chain-related fields
  hotel_chain_name?: string
  hotel_chain_email?: string
  hotel_chain_telephone?: string

  // Hotel-related fields
  hotel_name?: string
  hotel_address?: string
  hotel_email?: string
  hotel_telephone?: string

  // Room-related fields
  room_view?: string
  room_condition?: string
  room_amenities?: string

  // Guest-related fields
  guest_full_name?: string
  guest_address?: string
  guest_SIN?: string
  guest_checkin_date?: string

  // Employee-related fields
  employee_full_name?: string
  employee_address?: string
  employee_SIN?: string
  employee_role?: string

  // Payment-related fields
  payment_amount?: number
  payment_method?: string
  payment_date?: string
}

export function ArchivedRecords() {
  const { toast } = useToast()
  const [records, setRecords] = useState<ArchivedRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordType, setRecordType] = useState<string>("all")
  const [selectedRecord, setSelectedRecord] = useState<ArchivedRecord | null>(null)
  const [isViewingDetails, setIsViewingDetails] = useState(false)
  const [isViewingSnapshot, setIsViewingSnapshot] = useState(false)

  useEffect(() => {
    fetchArchivedRecords()
  }, [])

  const fetchArchivedRecords = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/archives")
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      } else {
        throw new Error("Failed to fetch archived records")
      }
    } catch (error) {
      console.error("Error fetching archived records:", error)
      toast({
        title: "Error",
        description: "Failed to fetch archived records. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter records based on search term and record type
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === "" ||
      Object.values(record).some(value =>
        value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = recordType === "all" || record.type === recordType;

    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Archived Records</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="search" className="mb-2 block">Search Records</Label>
          <Input
            id="search"
            placeholder="Search by name, ID, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="record-type" className="mb-2 block">Record Type</Label>
          <Select value={recordType} onValueChange={setRecordType}>
            <SelectTrigger id="record-type">
              <SelectValue placeholder="Select record type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="Reservation">Reservations</SelectItem>
              <SelectItem value="Rental">Rentals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button onClick={fetchArchivedRecords} className="w-full">
            <Archive className="h-4 w-4 mr-2" />
            Refresh Records
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Original ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room ID</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Archived At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading archived records...
                </TableCell>
              </TableRow>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <TableRow key={record.record_id}>
                  <TableCell>{record.record_id}</TableCell>
                  <TableCell>
                    <Badge variant={record.type === "Reservation" ? "secondary" : "default"}>
                      {record.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.original_id}</TableCell>
                  <TableCell>{JSON.parse(record.data_snapshot).guest_id || "N/A"}</TableCell>
                  <TableCell>
                    {record.hotel_name ? (
                      <div>
                        <div>{record.hotel_name}</div>
                        <div className="text-xs text-muted-foreground">Room {record.reservation_room_id || record.rental_room_id}</div>
                      </div>
                    ) : (
                      JSON.parse(record.data_snapshot).room_id
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-xs">{JSON.parse(record.data_snapshot).checkin_date && format(new Date(JSON.parse(record.data_snapshot).checkin_date), "MMM d, yyyy")}</div>
                      <div className="text-xs">{JSON.parse(record.data_snapshot).checkout_date && format(new Date(JSON.parse(record.data_snapshot).checkout_date), "MMM d, yyyy")}</div>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(record.archived_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRecord(record)
                          setIsViewingDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRecord(record)
                          setIsViewingSnapshot(true)
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No archived records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Record Details Dialog */}
      <Dialog open={isViewingDetails} onOpenChange={setIsViewingDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Archived Record Details</DialogTitle>
            <DialogDescription>
              {selectedRecord?.type} #{selectedRecord?.original_id} archived on {selectedRecord?.archived_at && format(new Date(selectedRecord.archived_at), "PPP")}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="guest">Guest</TabsTrigger>
                <TabsTrigger value="hotel">Hotel</TabsTrigger>
                {selectedRecord.type === "Rental" && <TabsTrigger value="employee">Employee</TabsTrigger>}
              </TabsList>

              <TabsContent value="details" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Record Type</Label>
                    <div className="text-sm">{selectedRecord.type}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Original ID</Label>
                    <div className="text-sm">{selectedRecord.original_id}</div>
                  </div>

                  {selectedRecord.type === "Reservation" ? (
                    <>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Start Date</Label>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {selectedRecord.start_date && format(new Date(selectedRecord.start_date), "PPP")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">End Date</Label>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {selectedRecord.end_date && format(new Date(selectedRecord.end_date), "PPP")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Status</Label>
                        <div className="text-sm">
                          <Badge variant="outline">{selectedRecord.reservation_status}</Badge>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Check-in Date</Label>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {selectedRecord.checkin_date && format(new Date(selectedRecord.checkin_date), "PPP")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-sm font-medium">Check-out Date</Label>
                        <div className="text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          {selectedRecord.checkout_date && format(new Date(selectedRecord.checkout_date), "PPP")}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Archived At</Label>
                    <div className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {format(new Date(selectedRecord.archived_at), "PPP p")}
                    </div>
                  </div>
                </div>

                {selectedRecord.payment_amount && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      Payment Information
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Amount</Label>
                        <div className="text-sm font-medium">${selectedRecord.payment_amount.toFixed(2)}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Method</Label>
                        <div className="text-sm">{selectedRecord.payment_method}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Date</Label>
                        <div className="text-sm">
                          {selectedRecord.payment_date && format(new Date(selectedRecord.payment_date), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="guest" className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-4 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Guest Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Full Name</Label>
                      <div className="text-sm font-medium">{selectedRecord.guest_full_name || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">SIN</Label>
                      <div className="text-sm">{selectedRecord.guest_SIN || "N/A"}</div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <Label className="text-xs">Address</Label>
                      <div className="text-sm">{selectedRecord.guest_address || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Check-in Date</Label>
                      <div className="text-sm">
                        {selectedRecord.guest_checkin_date && format(new Date(selectedRecord.guest_checkin_date), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hotel" className="space-y-4 py-4">
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-4 flex items-center">
                    <Hotel className="h-4 w-4 mr-1" />
                    Hotel Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Hotel Name</Label>
                      <div className="text-sm font-medium">{selectedRecord.hotel_name || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Chain</Label>
                      <div className="text-sm">{selectedRecord.hotel_chain_name || "N/A"}</div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <Label className="text-xs">Address</Label>
                      <div className="text-sm flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        {selectedRecord.hotel_address || "N/A"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email</Label>
                      <div className="text-sm">{selectedRecord.hotel_email || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Telephone</Label>
                      <div className="text-sm">{selectedRecord.hotel_telephone || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-4 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Room Information
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Room ID</Label>
                      <div className="text-sm font-medium">
                        {selectedRecord.reservation_room_id || selectedRecord.rental_room_id || "N/A"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">View</Label>
                      <div className="text-sm">{selectedRecord.room_view || "N/A"}</div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Condition</Label>
                      <div className="text-sm">{selectedRecord.room_condition || "N/A"}</div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <Label className="text-xs">Amenities</Label>
                      <div className="text-sm">{selectedRecord.room_amenities || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {selectedRecord.type === "Rental" && (
                <TabsContent value="employee" className="space-y-4 py-4">
                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-4 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Employee Information
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Full Name</Label>
                        <div className="text-sm font-medium">{selectedRecord.employee_full_name || "N/A"}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Role</Label>
                        <div className="text-sm">
                          <Badge variant="outline">{selectedRecord.employee_role || "N/A"}</Badge>
                        </div>
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs">Address</Label>
                        <div className="text-sm">{selectedRecord.employee_address || "N/A"}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">SIN</Label>
                        <div className="text-sm">{selectedRecord.employee_SIN || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewingDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Snapshot Dialog */}
      <Dialog open={isViewingSnapshot} onOpenChange={setIsViewingSnapshot}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Snapshot</DialogTitle>
            <DialogDescription>
              Raw data snapshot for {selectedRecord?.type} #{selectedRecord?.original_id}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="max-h-[400px] overflow-y-auto">
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(JSON.parse(selectedRecord.data_snapshot || "{}"), null, 2)}
              </pre>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewingSnapshot(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
