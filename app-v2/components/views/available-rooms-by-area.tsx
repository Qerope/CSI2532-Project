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

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const params = new URLSearchParams()

        if (searchTerm) {
          params.append("area", searchTerm)
        }

        const response = await fetch(`http://localhost:5010/api/views/available-rooms-by-area?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch available rooms by area")
        }

        const data = await response.json()
        setAvailableRooms(data)
      } catch (error) {
        console.error("Error fetching available rooms by area:", error)
      }
    }

    fetchAvailableRooms()
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

