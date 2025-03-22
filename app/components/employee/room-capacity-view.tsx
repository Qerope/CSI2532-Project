"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface Hotel {
  hotel_id: number
  name: string
}

interface CapacityData {
  capacity: number
  count: number
}

export function RoomCapacityView() {
  const { toast } = useToast()

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedHotel, setSelectedHotel] = useState<string>("")
  const [capacityData, setCapacityData] = useState<CapacityData[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRooms, setTotalRooms] = useState(0)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/hotels")
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
    }
  }

  const handleSearch = async () => {
    if (!selectedHotel) {
      toast({
        title: "Missing hotel",
        description: "Please select a hotel to view room capacity.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:5010/api/views/capacity?hotel_id=${selectedHotel}`)

      if (response.ok) {
        const data = await response.json()
        setCapacityData(data)

        // Calculate total rooms
        const total = data.reduce((sum: number, item: CapacityData) => sum + item.count, 0)
        setTotalRooms(total)
      } else {
        throw new Error("Failed to fetch capacity data")
      }
    } catch (error) {
      console.error("Error fetching capacity data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch capacity data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Room Capacity by Hotel</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Hotel</CardTitle>
            <CardDescription>Choose a hotel to view room capacity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hotel">Hotel</Label>
              <Select value={selectedHotel} onValueChange={setSelectedHotel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hotel" />
                </SelectTrigger>
                <SelectContent>
                  {hotels.map((hotel) => (
                    <SelectItem key={hotel.hotel_id} value={hotel.hotel_id.toString()}>
                      {hotel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleSearch} disabled={loading}>
              {loading ? "Loading..." : "View Capacity"}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Room Capacity Distribution</CardTitle>
              <CardDescription>Distribution of room capacities in the selected hotel</CardDescription>
            </CardHeader>
            <CardContent>
              {capacityData.length > 0 ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{totalRooms}</div>
                    <div className="text-sm text-muted-foreground">Total Rooms</div>
                  </div>

                  <div className="space-y-4">
                    {capacityData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="text-sm font-medium">
                            {item.capacity === 1 ? "Single" : item.capacity === 2 ? "Double" : "Triple"} Rooms
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.count} rooms ({Math.round((item.count / totalRooms) * 100)}%)
                          </div>
                        </div>
                        <Progress value={(item.count / totalRooms) * 100} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {loading ? "Loading capacity data..." : "No capacity data found. Please select a hotel."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

