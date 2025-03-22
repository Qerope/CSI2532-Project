import type { Metadata } from "next"
import { HotelFilters } from "@/components/hotel-filters"
import { HotelList } from "@/components/hotel-list"
import { HotelMap } from "@/components/hotel-map"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import { HotelListSkeleton } from "@/components/hotel-list-skeleton"
import { MapPin, Hotel, Star, Building } from "lucide-react"

export const metadata: Metadata = {
  title: "Hotels | LuxStay",
  description: "Browse and search for hotels across our premium hotel chains",
}

export default function HotelsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-hotel-900">Find Your Perfect Hotel</h1>
          <p className="text-hotel-600 mt-2">Browse through our collection of premium hotels across North America</p>
        </div>
        <div className="flex items-center space-x-2 bg-hotel-50 p-2 rounded-lg">
          <div className="flex items-center space-x-1 text-hotel-700 text-sm px-3 py-1 rounded-md bg-white">
            <Hotel className="h-4 w-4 text-hotel-500" />
            <span>Hotels</span>
          </div>
          <div className="flex items-center space-x-1 text-hotel-600 text-sm px-3 py-1 rounded-md hover:bg-white cursor-pointer transition-colors">
            <Building className="h-4 w-4" />
            <span>Chains</span>
          </div>
          <div className="flex items-center space-x-1 text-hotel-600 text-sm px-3 py-1 rounded-md hover:bg-white cursor-pointer transition-colors">
            <Star className="h-4 w-4" />
            <span>Top Rated</span>
          </div>
          <div className="flex items-center space-x-1 text-hotel-600 text-sm px-3 py-1 rounded-md hover:bg-white cursor-pointer transition-colors">
            <MapPin className="h-4 w-4" />
            <span>Near Me</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <HotelFilters searchParams={searchParams} />
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="list" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 bg-hotel-50 p-1 rounded-xl">
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-white data-[state=active]:text-hotel-700 data-[state=active]:shadow-sm rounded-lg"
              >
                List View
              </TabsTrigger>
              <TabsTrigger
                value="map"
                className="data-[state=active]:bg-white data-[state=active]:text-hotel-700 data-[state=active]:shadow-sm rounded-lg"
              >
                Map View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="mt-6">
              <Suspense fallback={<HotelListSkeleton />}>
                <HotelList searchParams={searchParams} />
              </Suspense>
            </TabsContent>

            <TabsContent value="map" className="mt-6">
              <HotelMap searchParams={searchParams} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

