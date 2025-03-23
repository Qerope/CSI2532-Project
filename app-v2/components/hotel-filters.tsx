"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  MapPin,
  Star,
  Building,
  DollarSign,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Car,
  Utensils,
  Dumbbell,
  ArrowUpDown,
  Loader2,
  BedDouble,
  Briefcase,
  Accessibility,
  Baby,
  PawPrint,
} from "lucide-react"

// Updated interface to match database schema
interface HotelChain {
  chain_id: number
  name: string
  central_address: string
  num_hotels: number
  contact_email: string
  telephone: string
}

interface HotelFiltersProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function HotelFilters({ searchParams }: HotelFiltersProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [hotelChains, setHotelChains] = useState<HotelChain[]>([])

  // Filter states
  const [location, setLocation] = useState((searchParams.location as string) || "")
  const [priceRange, setPriceRange] = useState([
    Number.parseInt((searchParams.minPrice as string) || "0"),
    Number.parseInt((searchParams.maxPrice as string) || "500"),
  ])
  const [selectedChains, setSelectedChains] = useState<string[]>(
    Array.isArray(searchParams.chains)
      ? searchParams.chains
      : searchParams.chains
        ? [searchParams.chains as string]
        : [],
  )
  const [stars, setStars] = useState<string[]>(
    Array.isArray(searchParams.stars) ? searchParams.stars : searchParams.stars ? [searchParams.stars as string] : [],
  )
  const [amenities, setAmenities] = useState<string[]>(
    Array.isArray(searchParams.amenities)
      ? searchParams.amenities
      : searchParams.amenities
        ? [searchParams.amenities as string]
        : [],
  )
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    Array.isArray(searchParams.propertyTypes)
      ? searchParams.propertyTypes
      : searchParams.propertyTypes
        ? [searchParams.propertyTypes as string]
        : [],
  )
  const [accessibility, setAccessibility] = useState<string[]>(
    Array.isArray(searchParams.accessibility)
      ? searchParams.accessibility
      : searchParams.accessibility
        ? [searchParams.accessibility as string]
        : [],
  )
  const [sortBy, setSortBy] = useState((searchParams.sortBy as string) || "recommended")

  // Fetch hotel chains
  useEffect(() => {
    const fetchHotelChains = async () => {
      try {
        const response = await fetch("http://localhost:5010/api/hotelChains")

        if (!response.ok) {
          throw new Error("Failed to fetch hotel chains")
        }

        const data = await response.json()
        setHotelChains(data)
      } catch (error) {
        console.error("Error fetching hotel chains:", error)
      }
    }

    fetchHotelChains()
  }, [])

  // Handle checkbox changes
  const handleChainChange = (chainId: string, checked: boolean) => {
    if (checked) {
      setSelectedChains([...selectedChains, chainId])
    } else {
      setSelectedChains(selectedChains.filter((id) => id !== chainId))
    }
  }

  const handleStarChange = (star: string, checked: boolean) => {
    if (checked) {
      setStars([...stars, star])
    } else {
      setStars(stars.filter((s) => s !== star))
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity])
    } else {
      setAmenities(amenities.filter((a) => a !== amenity))
    }
  }

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPropertyTypes([...propertyTypes, type])
    } else {
      setPropertyTypes(propertyTypes.filter((t) => t !== type))
    }
  }

  const handleAccessibilityChange = (feature: string, checked: boolean) => {
    if (checked) {
      setAccessibility([...accessibility, feature])
    } else {
      setAccessibility(accessibility.filter((f) => f !== feature))
    }
  }

  // Apply filters
  const applyFilters = () => {
    setIsLoading(true)

    const params = new URLSearchParams()

    if (location) params.append("location", location)

    params.append("minPrice", priceRange[0].toString())
    params.append("maxPrice", priceRange[1].toString())

    selectedChains.forEach((chain) => params.append("chains", chain))
    stars.forEach((star) => params.append("stars", star))
    amenities.forEach((amenity) => params.append("amenities", amenity))
    propertyTypes.forEach((type) => params.append("propertyTypes", type))
    accessibility.forEach((feature) => params.append("accessibility", feature))

    if (sortBy) params.append("sortBy", sortBy)

    router.push(`/hotels?${params.toString()}`)

    // Simulate loading state
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Reset filters
  const resetFilters = () => {
    setLocation("")
    setPriceRange([0, 500])
    setSelectedChains([])
    setStars([])
    setAmenities([])
    setPropertyTypes([])
    setAccessibility([])
    setSortBy("recommended")

    router.push("/hotels")
  }

  // Count active filters
  const activeFilterCount = [
    location ? 1 : 0,
    selectedChains.length,
    stars.length,
    amenities.length,
    propertyTypes.length,
    accessibility.length,
    priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <Card className="border-none hotel-card-shadow rounded-xl overflow-hidden sticky top-24">
      <CardHeader className="bg-gradient-to-r from-hotel-600 to-hotel-800 text-white p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Hotel Filters
          </CardTitle>
          {activeFilterCount > 0 && <Badge className="bg-white text-hotel-700">{activeFilterCount} active</Badge>}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-hotel-500" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="City, state, or area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border-hotel-200 focus:border-hotel-500 focus:ring-hotel-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-hotel-500" />
              Price Range ($ per night)
            </Label>
            <div className="pt-6">
              <Slider
                value={priceRange}
                max={1000}
                step={10}
                onValueChange={setPriceRange}
                className="[&>span]:bg-hotel-500"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Accordion type="multiple" defaultValue={["chains", "stars", "amenities"]} className="space-y-4">
            <AccordionItem value="chains" className="border-b-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Building className="h-4 w-4 text-hotel-500" />
                  Hotel Chains
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <div className="space-y-2">
                  {hotelChains.map((chain) => (
                    <div key={chain.chain_id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`chain-${chain.chain_id}`}
                        checked={selectedChains.includes(chain.chain_id.toString())}
                        onCheckedChange={(checked) => handleChainChange(chain.chain_id.toString(), checked as boolean)}
                        className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                      />
                      <label htmlFor={`chain-${chain.chain_id}`} className="text-sm">
                        {chain.name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stars" className="border-b-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Star className="h-4 w-4 text-hotel-500" />
                  Star Rating
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center space-x-2">
                      <Checkbox
                        id={`star-${star}`}
                        checked={stars.includes(star.toString())}
                        onCheckedChange={(checked) => handleStarChange(star.toString(), checked as boolean)}
                        className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                      />
                      <label htmlFor={`star-${star}`} className="text-sm flex items-center">
                        <div className="flex">
                          {Array(star)
                            .fill(0)
                            .map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="amenities" className="border-b-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Coffee className="h-4 w-4 text-hotel-500" />
                  Amenities
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <div className="space-y-2">
                  {[
                    { id: "wifi", label: "WiFi", icon: Wifi },
                    { id: "tv", label: "TV", icon: Tv },
                    { id: "ac", label: "Air Conditioning", icon: Wind },
                    { id: "parking", label: "Free Parking", icon: Car },
                    { id: "restaurant", label: "Restaurant", icon: Utensils },
                    { id: "gym", label: "Fitness Center", icon: Dumbbell },
                    { id: "pool", label: "Swimming Pool", icon: Coffee },
                    { id: "spa", label: "Spa", icon: Coffee },
                  ].map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.id}`}
                        checked={amenities.includes(amenity.id)}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.id, checked as boolean)}
                        className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                      />
                      <label htmlFor={`amenity-${amenity.id}`} className="text-sm flex items-center gap-2">
                        <amenity.icon className="h-3 w-3 text-hotel-500" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="property-type" className="border-b-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <BedDouble className="h-4 w-4 text-hotel-500" />
                  Property Type
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <div className="space-y-2">
                  {[
                    { id: "hotel", label: "Hotel" },
                    { id: "resort", label: "Resort" },
                    { id: "boutique", label: "Boutique Hotel" },
                    { id: "business", label: "Business Hotel" },
                    { id: "extended-stay", label: "Extended Stay" },
                  ].map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.id}`}
                        checked={propertyTypes.includes(type.id)}
                        onCheckedChange={(checked) => handlePropertyTypeChange(type.id, checked as boolean)}
                        className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                      />
                      <label htmlFor={`type-${type.id}`} className="text-sm">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accessibility" className="border-b-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Accessibility className="h-4 w-4 text-hotel-500" />
                  Accessibility & Special Features
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <div className="space-y-2">
                  {[
                    { id: "wheelchair", label: "Wheelchair Accessible", icon: Accessibility },
                    { id: "elevator", label: "Elevator Access", icon: Accessibility },
                    { id: "family", label: "Family Friendly", icon: Baby },
                    { id: "pet-friendly", label: "Pet Friendly", icon: PawPrint },
                    { id: "business-center", label: "Business Center", icon: Briefcase },
                  ].map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature.id}`}
                        checked={accessibility.includes(feature.id)}
                        onCheckedChange={(checked) => handleAccessibilityChange(feature.id, checked as boolean)}
                        className="text-hotel-600 border-hotel-300 data-[state=checked]:bg-hotel-600 data-[state=checked]:border-hotel-600"
                      />
                      <label htmlFor={`feature-${feature.id}`} className="text-sm flex items-center gap-2">
                        <feature.icon className="h-3 w-3 text-hotel-500" />
                        {feature.label}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sort" className="border-b-0">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <ArrowUpDown className="h-4 w-4 text-hotel-500" />
                  Sort Results
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-0">
                <div className="space-y-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="rounded-lg border-hotel-200">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-hotel-200">
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Guest Rating</SelectItem>
                      <SelectItem value="stars-high">Stars: High to Low</SelectItem>
                      <SelectItem value="stars-low">Stars: Low to High</SelectItem>
                      <SelectItem value="distance">Distance from Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={applyFilters}
              className="flex-1 bg-gradient-to-r from-hotel-600 to-hotel-800 hover:from-hotel-700 hover:to-hotel-900 text-white rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Applying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Apply Filters
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-hotel-200 hover:bg-hotel-50 hover:text-hotel-700 rounded-lg"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

