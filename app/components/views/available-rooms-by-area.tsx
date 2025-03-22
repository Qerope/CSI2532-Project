"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

// This would be an actual SQL view in a real application:
// CREATE VIEW available_rooms_by_area AS
// SELECT
//   SUBSTRING_INDEX(h.address, ',', -2) AS area,
//   COUNT(r.room_id) AS available_rooms
// FROM Room r
// JOIN Hotel h ON r.hotel_id = h.hotel_id
// LEFT JOIN Reservation res ON r.room_id = res.room_id
//   AND res.status = 'Booked'
//   AND CURRENT_DATE BETWEEN res.start_date AND res.end_date
// WHERE res.reservation_id IS NULL
// GROUP BY area
// ORDER BY available_rooms DESC;

export function AvailableRoomsByArea() {
  const [searchTerm, setSearchTerm] = useState("")
  const [availableRooms, setAvailableRooms] = useState<any[]>([])

  // Mock data - in a real application, this would be fetched from your database view
  const mockData = [
    { area: "New York, NY", available_rooms: 42 },
    { area: "Los Angeles, CA", available_rooms: 38 },
    { area: "Chicago, IL", available_rooms: 27 },
    { area: "Miami, FL", available_rooms: 31 },
    { area: "Las Vegas, NV", available_rooms: 45 },
    { area: "San Francisco, CA", available_rooms: 19 },
    { area: "Boston, MA", available_rooms: 22 },
    { area: "Seattle, WA", available_rooms: 18 },
    { area: "Denver, CO", available_rooms: 29 },
    { area: "Dallas, TX", available_rooms: 33 },
    { area: "Atlanta, GA", available_rooms: 26 },
    { area: "New Orleans, LA", available_rooms: 15 },
    { area: "Nashville, TN", available_rooms: 21 },
    { area: "Phoenix, AZ", available_rooms: 30 },
  ]

  useEffect(() => {
    // Filter data based on search term
    const filteredData = mockData.filter((room) => room.area.toLowerCase().includes(searchTerm.toLowerCase()))

    setAvailableRooms(filteredData)
  }, [searchTerm])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Rooms by Area</CardTitle>
        <CardDescription>View the number of currently available rooms in each area</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="search-area">Search Area</Label>
          <Input
            id="search-area"
            placeholder="Enter city or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Area</TableHead>
                <TableHead className="text-right">Available Rooms</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableRooms.map((room) => (
                <TableRow key={room.area}>
                  <TableCell className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {room.area}
                  </TableCell>
                  <TableCell className="text-right">{room.available_rooms}</TableCell>
                </TableRow>
              ))}
              {availableRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-4">
                    No areas found matching your search
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          This view is generated from the SQL view "available_rooms_by_area" which counts rooms that are not currently
          reserved.
        </p>
      </CardContent>
    </Card>
  )
}

