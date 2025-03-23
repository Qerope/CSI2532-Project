import { Tv, Wifi, Wind, Coffee, Car, Utensils, Dumbbell, Droplet, Snowflake, Refrigerator } from "lucide-react"

interface RoomAmenitiesProps {
  amenities: string
}

export function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  // Parse amenities if it's a string
  const amenitiesList = typeof amenities === "string" ? amenities.split(",").map((item) => item.trim()) : []

  // Map amenities to icons
  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase()
    if (lowerAmenity.includes("tv")) return <Tv className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("wifi")) return <Wifi className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("air") || lowerAmenity.includes("ac")) return <Wind className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("coffee")) return <Coffee className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("parking")) return <Car className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("restaurant") || lowerAmenity.includes("dining"))
      return <Utensils className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("gym") || lowerAmenity.includes("fitness"))
      return <Dumbbell className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("pool") || lowerAmenity.includes("spa"))
      return <Droplet className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("refrigerator") || lowerAmenity.includes("fridge"))
      return <Refrigerator className="h-5 w-5 text-hotel-500" />
    if (lowerAmenity.includes("conditioning")) return <Snowflake className="h-5 w-5 text-hotel-500" />
    return <Coffee className="h-5 w-5 text-hotel-500" /> // Default icon
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-hotel-800">Room Amenities</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {amenitiesList.map((amenity, index) => (
          <div key={index} className="flex items-center bg-hotel-50 p-3 rounded-lg">
            {getAmenityIcon(amenity)}
            <span className="ml-3 text-hotel-700">{amenity}</span>
          </div>
        ))}

        {amenitiesList.length === 0 && (
          <div className="col-span-2 text-center py-4 text-hotel-500">No amenities information available.</div>
        )}
      </div>
    </div>
  )
}

