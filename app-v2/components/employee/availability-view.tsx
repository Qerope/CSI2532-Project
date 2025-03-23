"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AvailabilityData {
  hotel_address: string
  available_rooms: number
}

export function AvailabilityView() {
  const { toast } = useToast()

  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)

    try {
      const params = new URLSearchParams()

      if (startDate) {
        params.append("start_date", format(startDate, "yyyy-MM-dd"))
      }

      if (endDate) {
        params.append("end_date", format(endDate, "yyyy-MM-dd"))
      }

      const response = await fetch(`http://localhost:5010/api/views/availability?${params.toString()}`)

      if (response.ok) {
        const data = await response.json()
        setAvailabilityData(data)
      } else {
        throw new Error("Failed to fetch availability data")
      }
    } catch (error) {
      console.error("Error fetching availability data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch availability data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Room Availability by Area</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
            <CardDescription>Select date range to view availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button className="w-full" onClick={handleSearch} disabled={loading}>
              {loading ? "Loading..." : "View Availability"}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Rooms by Area</CardTitle>
              <CardDescription>Number of available rooms in each area for the selected date range</CardDescription>
            </CardHeader>
            <CardContent>
              {availabilityData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availabilityData.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold">{item.available_rooms} <span className="text-sm text-muted-foreground font-normal"> at <span className="text-lg font-bold text-foreground">{item.hotel_address}</span></span></div>
                        <div className="text-sm text-muted-foreground">Available rooms</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {loading
                      ? "Loading availability data..."
                      : "No availability data found. Try adjusting your date range."}
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

