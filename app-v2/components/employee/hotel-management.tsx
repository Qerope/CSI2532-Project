"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
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
import { Plus, Trash } from "lucide-react"

interface HotelChain {
  chain_id: number
  name: string
  central_address: string
  num_hotels: number
  contact_email: string
  telephone: string
}

interface Hotel {
  hotel_id: number
  chain_id: number
  name: string
  classification: number
  num_rooms: number
  address: string
  contact_email: string
  telephone: string
  chain_name?: string
}

interface Room {
  room_id: number
  hotel_id: number
  price: number
  capacity: number
  view: string
  extendable: boolean
  condition: string
  amenities: string
  hotel_name?: string
}

export function HotelManagement() {
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("chains")

  const [hotelChains, setHotelChains] = useState<HotelChain[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [rooms, setRooms] = useState<Room[]>([])

  const [selectedChain, setSelectedChain] = useState<HotelChain | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  const [isAddingChain, setIsAddingChain] = useState(false)
  const [isAddingHotel, setIsAddingHotel] = useState(false)
  const [isAddingRoom, setIsAddingRoom] = useState(false)

  const [newChain, setNewChain] = useState<Partial<HotelChain>>({})
  const [newHotel, setNewHotel] = useState<Partial<Hotel>>({})
  const [newRoom, setNewRoom] = useState<Partial<Room>>({})

  useEffect(() => {
    fetchHotelChains()
    fetchHotels()
    fetchRooms()
  }, [])

  const fetchHotelChains = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/hotelChains")
      if (response.ok) {
        const data = await response.json()
        setHotelChains(data)
      } else {
        throw new Error("Failed to fetch hotel chains")
      }
    } catch (error) {
      console.error("Error fetching hotel chains:", error)
      toast({
        title: "Error",
        description: "Failed to fetch hotel chains. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/hotels")
      if (response.ok) {
        const data = await response.json()
        setHotels(data)
      } else {
        throw new Error("Failed to fetch hotels")
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
      toast({
        title: "Error",
        description: "Failed to fetch hotels. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/rooms")
      if (response.ok) {
        const data = await response.json()
        setRooms(data)
      } else {
        throw new Error("Failed to fetch rooms")
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast({
        title: "Error",
        description: "Failed to fetch rooms. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddChain = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/hotelChain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChain),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hotel chain added successfully.",
        })
        setIsAddingChain(false)
        setNewChain({})
        fetchHotelChains()
      } else {
        throw new Error("Failed to add hotel chain")
      }
    } catch (error) {
      console.error("Error adding hotel chain:", error)
      toast({
        title: "Error",
        description: "Failed to add hotel chain. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddHotel = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/hotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newHotel),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hotel added successfully.",
        })
        setIsAddingHotel(false)
        setNewHotel({})
        fetchHotels()
      } else {
        throw new Error("Failed to add hotel")
      }
    } catch (error) {
      console.error("Error adding hotel:", error)
      toast({
        title: "Error",
        description: "Failed to add hotel. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddRoom = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Room added successfully.",
        })
        setIsAddingRoom(false)
        setNewRoom({})
        fetchRooms()
      } else {
        throw new Error("Failed to add room")
      }
    } catch (error) {
      console.error("Error adding room:", error)
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteChain = async (chainId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/HotelChain/${chainId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hotel chain deleted successfully.",
        })
        fetchHotelChains()
      } else {
        throw new Error("Failed to delete hotel chain")
      }
    } catch (error) {
      console.error("Error deleting hotel chain:", error)
      toast({
        title: "Error",
        description: "Failed to delete hotel chain. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteHotel = async (hotelId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/Hotel/${hotelId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hotel deleted successfully.",
        })
        fetchHotels()
      } else {
        throw new Error("Failed to delete hotel")
      }
    } catch (error) {
      console.error("Error deleting hotel:", error)
      toast({
        title: "Error",
        description: "Failed to delete hotel. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRoom = async (roomId: number) => {
    try {
      const response = await fetch(`http://localhost:5010/api/Room/${roomId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Room deleted successfully.",
        })
        fetchRooms()
      } else {
        throw new Error("Failed to delete room")
      }
    } catch (error) {
      console.error("Error deleting room:", error)
      toast({
        title: "Error",
        description: "Failed to delete room. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <Tabs defaultValue="chains" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="chains">Hotel Chains</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="chains">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Hotel Chains</h2>
            <Dialog open={isAddingChain} onOpenChange={setIsAddingChain}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hotel Chain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Hotel Chain</DialogTitle>
                  <DialogDescription>Enter the details for the new hotel chain.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newChain.name || ""}
                      onChange={(e) => setNewChain({ ...newChain, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Central Address
                    </Label>
                    <Input
                      id="address"
                      value={newChain.central_address || ""}
                      onChange={(e) => setNewChain({ ...newChain, central_address: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="num_hotels" className="text-right">
                      Number of Hotels
                    </Label>
                    <Input
                      id="num_hotels"
                      type="number"
                      value={newChain.num_hotels || ""}
                      onChange={(e) => setNewChain({ ...newChain, num_hotels: Number.parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Contact Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newChain.contact_email || ""}
                      onChange={(e) => setNewChain({ ...newChain, contact_email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telephone" className="text-right">
                      Telephone
                    </Label>
                    <Input
                      id="telephone"
                      value={newChain.telephone || ""}
                      onChange={(e) => setNewChain({ ...newChain, telephone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingChain(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddChain}>Add Chain</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Central Address</TableHead>
                  <TableHead>Number of Hotels</TableHead>
                  <TableHead>Contact Email</TableHead>
                  <TableHead>Telephone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelChains.map((chain) => (
                  <TableRow key={chain.chain_id}>
                    <TableCell>{chain.chain_id}</TableCell>
                    <TableCell>{chain.name}</TableCell>
                    <TableCell>{chain.central_address}</TableCell>
                    <TableCell>{chain.num_hotels}</TableCell>
                    <TableCell>{chain.contact_email}</TableCell>
                    <TableCell>{chain.telephone}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteChain(chain.chain_id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {hotelChains.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No hotel chains found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="hotels">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Hotels</h2>
            <Dialog open={isAddingHotel} onOpenChange={setIsAddingHotel}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hotel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Hotel</DialogTitle>
                  <DialogDescription>Enter the details for the new hotel.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chain_id" className="text-right">
                      Hotel Chain
                    </Label>
                    <Select
                      value={newHotel.chain_id?.toString() || ""}
                      onValueChange={(value) => setNewHotel({ ...newHotel, chain_id: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a hotel chain" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotelChains.map((chain) => (
                          <SelectItem key={chain.chain_id} value={chain.chain_id.toString()}>
                            {chain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newHotel.name || ""}
                      onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="classification" className="text-right">
                      Classification
                    </Label>
                    <Select
                      value={newHotel.classification?.toString() || ""}
                      onValueChange={(value) => setNewHotel({ ...newHotel, classification: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="num_rooms" className="text-right">
                      Number of Rooms
                    </Label>
                    <Input
                      id="num_rooms"
                      type="number"
                      value={newHotel.num_rooms || ""}
                      onChange={(e) => setNewHotel({ ...newHotel, num_rooms: Number.parseInt(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={newHotel.address || ""}
                      onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Contact Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newHotel.contact_email || ""}
                      onChange={(e) => setNewHotel({ ...newHotel, contact_email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telephone" className="text-right">
                      Telephone
                    </Label>
                    <Input
                      id="telephone"
                      value={newHotel.telephone || ""}
                      onChange={(e) => setNewHotel({ ...newHotel, telephone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingHotel(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddHotel}>Add Hotel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Number of Rooms</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.hotel_id}>
                    <TableCell>{hotel.hotel_id}</TableCell>
                    <TableCell>{hotel.chain_name || hotel.chain_id}</TableCell>
                    <TableCell>{hotel.name}</TableCell>
                    <TableCell>{hotel.classification} Star</TableCell>
                    <TableCell>{hotel.num_rooms}</TableCell>
                    <TableCell>{hotel.address}</TableCell>
                    <TableCell>
                      <div>{hotel.contact_email}</div>
                      <div>{hotel.telephone}</div>
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteHotel(hotel.hotel_id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {hotels.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No hotels found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Rooms</h2>
            <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Room</DialogTitle>
                  <DialogDescription>Enter the details for the new room.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hotel_id" className="text-right">
                      Hotel
                    </Label>
                    <Select
                      value={newRoom.hotel_id?.toString() || ""}
                      onValueChange={(value) => setNewRoom({ ...newRoom, hotel_id: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a hotel" />
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price per Night
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={newRoom.price || ""}
                      onChange={(e) => setNewRoom({ ...newRoom, price: Number.parseFloat(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">
                      Capacity
                    </Label>
                    <Select
                      value={newRoom.capacity?.toString() || ""}
                      onValueChange={(value) => setNewRoom({ ...newRoom, capacity: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Single (1 person)</SelectItem>
                        <SelectItem value="2">Double (2 people)</SelectItem>
                        <SelectItem value="3">Triple (3 people)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="view" className="text-right">
                      View
                    </Label>
                    <Select
                      value={newRoom.view || ""}
                      onValueChange={(value) => setNewRoom({ ...newRoom, view: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sea View">Sea View</SelectItem>
                        <SelectItem value="Mountain View">Mountain View</SelectItem>
                        <SelectItem value="City View">City View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="extendable" className="text-right">
                      Extendable
                    </Label>
                    <div className="col-span-3 flex items-center space-x-2">
                      <Switch
                        id="extendable"
                        checked={newRoom.extendable || false}
                        onCheckedChange={(checked) => setNewRoom({ ...newRoom, extendable: checked })}
                      />
                      <Label htmlFor="extendable">{newRoom.extendable ? "Yes" : "No"}</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="condition" className="text-right">
                      Condition
                    </Label>
                    <Select
                      value={newRoom.condition || ""}
                      onValueChange={(value) => setNewRoom({ ...newRoom, condition: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Good Condition">Good Condition</SelectItem>
                        <SelectItem value="In Repair">In Repair</SelectItem>
                        <SelectItem value="Damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amenities" className="text-right">
                      Amenities
                    </Label>
                    <Textarea
                      id="amenities"
                      value={newRoom.amenities || ""}
                      onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                      placeholder="TV, Air Conditioning, Refrigerator, etc."
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingRoom(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRoom}>Add Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>View</TableHead>
                  <TableHead>Extendable</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Amenities</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.room_id}>
                    <TableCell>{room.room_id}</TableCell>
                    <TableCell>{room.hotel_name || room.hotel_id}</TableCell>
                    <TableCell>${room.price}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.view}</TableCell>
                    <TableCell>{room.extendable ? "Yes" : "No"}</TableCell>
                    <TableCell>{room.condition}</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={room.amenities}>
                        {room.amenities}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRoom(room.room_id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No rooms found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

