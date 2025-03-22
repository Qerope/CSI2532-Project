"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Star, Users } from "lucide-react"

// This would be an actual SQL view in a real application:
// CREATE VIEW room_capacity_by_hotel AS
// SELECT
//   h.hotel_id,
//   h.name AS hotel_name,
//   hc.name AS chain_name,
//   h.classification,
//   h.address,
//   COUNT(r.room_id) AS total_rooms,
//   SUM(CASE WHEN r.capacity = 1 THEN 1 ELSE 0 END) AS single_rooms,
//   SUM(CASE WHEN r.capacity = 2 THEN 1 ELSE 0 END) AS double_rooms,
//   SUM(CASE WHEN r.capacity = 3 THEN 1 ELSE 0 END) AS triple_rooms,
//   SUM(r.capacity) AS total_capacity
// FROM Hotel h
// JOIN HotelChain hc ON h.chain_id = hc.chain_id
// JOIN Room r ON h.hotel_id = r.hotel_id
// GROUP BY h.hotel_id, h.name, hc.name, h.classification, h.address
// ORDER BY h.name;

export function RoomCapacityByHotel() {
  const [selectedHotel, setSelectedHotel] = useState("")
  const [hotelData, setHotelData] = useState<any | null>(null)

  // Mock data - in a real application, this would be fetched from your database view
  const hotels = [
    {
      hotel_id: 1,
      hotel_name: "Marriott Downtown",
      chain_name: "Marriott International",
      classification: 5,
      address: "123 Main St, New York, NY 10001",
      total_rooms: 120,
      single_rooms: 30,
      double_rooms: 70,
      triple_rooms: 20,
      total_capacity: 230,
    },
    {
      hotel_id: 2,
      hotel_name: "Hilton Garden Inn",
      chain_name: "Hilton Hotels & Resorts",
      classification: 4,
      address: "456 State St, Chicago, IL 60601",
      total_rooms: 85,
      single_rooms: 25,
      double_rooms: 50,
      triple_rooms: 10,
      total_capacity: 155,
    },
    {
      hotel_id: 3,
      hotel_name: "Hyatt Regency",
      chain_name: "Hyatt Hotels Corporation",
      classification: 5,
      address: "789 Mountain Rd, Denver, CO 80202",
      total_rooms: 150,
      single_rooms: 40,
      double_rooms: 80,
      triple_rooms: 30,
      total_capacity: 290,
    },
    {
      hotel_id: 4,
      hotel_name: "Holiday Inn Express",
      chain_name: "InterContinental Hotels Group",
      classification: 3,
      address: "101 Beach Blvd, Miami, FL 33139",
      total_rooms: 75,
      single_rooms: 30,
      double_rooms: 40,
      triple_rooms: 5,
      total_capacity: 125,
    },
    {
      hotel_id: 5,
      hotel_name: "Days Inn",
      chain_name: "Wyndham Hotels & Resorts",
      classification: 2,
      address: "202 Sunset Blvd, Los Angeles, CA 90001",
      total_rooms: 60,
      single_rooms: 30,
      double_rooms: 25,
      triple_rooms: 5,
      total_capacity: 95,
    },
  ]

  useEffect(() => {
    if (selectedHotel) {
      const hotel = hotels.find((h) => h.hotel_id.toString() === selectedHotel)
      setHotelData(hotel || null)
    } else {
      setHotelData(null)
    }
  }, [selectedHotel])

  // Render stars based on classification
  const renderStars = (classification: number) => {
    return Array(classification)
      .fill(0)
      .map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Capacity by Hotel</CardTitle>
        <CardDescription>View detailed room capacity information for a specific hotel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="select-hotel">Select Hotel</Label>
          <Select value={selectedHotel} onValueChange={setSelectedHotel}>
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Choose a hotel" />
            </SelectTrigger>
            <SelectContent>
              {hotels.map((hotel) => (
                <SelectItem key={hotel.hotel_id} value={hotel.hotel_id.toString()}>
                  {hotel.hotel_name} ({hotel.chain_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hotelData ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{hotelData.hotel_name}</h3>
              <div className="flex mb-1">{renderStars(hotelData.classification)}</div>
              <p className="text-gray-500 mb-2">{hotelData.address}</p>
              <p className="text-sm">Part of {hotelData.chain_name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Room Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Single Rooms</span>
                      </div>
                      <span className="font-medium">{hotelData.single_rooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Double Rooms</span>
                      </div>
                      <span className="font-medium">{hotelData.double_rooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Triple Rooms</span>
                      </div>
                      <span className="font-medium">{hotelData.triple_rooms}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Capacity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Rooms</span>
                      <span className="font-medium">{hotelData.total_rooms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Total Capacity</span>
                      <span className="font-medium">{hotelData.total_capacity} guests</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Capacity</span>
                      <span className="font-medium">
                        {(hotelData.total_capacity / hotelData.total_rooms).toFixed(2)} per room
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-gray-500">
              This view is generated from the SQL view "room_capacity_by_hotel" which aggregates room capacity data for
              each hotel.
            </p>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Please select a hotel to view capacity information</div>
        )}
      </CardContent>
    </Card>
  )
}

