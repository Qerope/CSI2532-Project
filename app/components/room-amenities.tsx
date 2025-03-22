import { Wifi, Tv, Wind, Refrigerator, Coffee, Bath } from "lucide-react"

interface RoomAmenitiesProps {
  amenities: string
}

export function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  const amenityList = amenities.split(", ")

  // Map of amenity names to their icons and descriptions
  const amenityDetails = [
    {
      name: "TV",
      icon: Tv,
      description: "Flat-screen TV with cable channels",
    },
    {
      name: "Air Conditioning",
      icon: Wind,
      description: "Climate control with adjustable temperature",
    },
    {
      name: "Refrigerator",
      icon: Refrigerator,
      description: "Mini refrigerator for your convenience",
    },
    {
      name: "WiFi",
      icon: Wifi,
      description: "High-speed wireless internet access",
    },
    {
      name: "Mini Bar",
      icon: Coffee,
      description: "Stocked mini bar with beverages and snacks",
    },
    {
      name: "Jacuzzi",
      icon: Bath,
      description: "Private jacuzzi tub",
    },
  ]

  // Filter amenity details to only include those in the amenity list
  const availableAmenities = amenityDetails.filter((detail) => amenityList.includes(detail.name))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Room Amenities</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableAmenities.map((amenity) => (
          <div key={amenity.name} className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <amenity.icon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium">{amenity.name}</h4>
              <p className="text-sm text-gray-500">{amenity.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Additional Amenities</h3>
        <ul className="list-disc pl-5 mt-2">
          <li>Iron and ironing board</li>
          <li>Hair dryer</li>
          <li>In-room safe</li>
          <li>Coffee maker</li>
          <li>Complimentary toiletries</li>
          <li>Desk and chair</li>
        </ul>
      </div>
    </div>
  )
}

