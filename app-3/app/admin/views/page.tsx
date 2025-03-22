import type { Metadata } from "next"
import { AvailableRoomsByArea } from "@/components/views/available-rooms-by-area"
import { RoomCapacityByHotel } from "@/components/views/room-capacity-by-hotel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Database Views - Hotel Booking App",
  description: "View database reports and statistics.",
}

export default function ViewsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Database Views</h1>

      <Tabs defaultValue="available-rooms">
        <TabsList className="mb-6">
          <TabsTrigger value="available-rooms">Available Rooms by Area</TabsTrigger>
          <TabsTrigger value="room-capacity">Room Capacity by Hotel</TabsTrigger>
        </TabsList>

        <TabsContent value="available-rooms">
          <AvailableRoomsByArea />
        </TabsContent>

        <TabsContent value="room-capacity">
          <RoomCapacityByHotel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

