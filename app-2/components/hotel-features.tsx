import { Check } from "lucide-react"

export function HotelFeatures() {
  const features = [
    "Multiple hotel chains to choose from",
    "Hotels ranging from 1-star to 5-star",
    "Various room types with different capacities",
    "Rooms with sea, mountain, or city views",
    "Extendable rooms for additional guests",
    "Multiple amenities including TV, air conditioning, and more",
    "Real-time availability checking",
    "Easy online booking system",
    "Secure payment processing",
    "Employee management portal",
  ]

  return (
    <section className="py-16 rounded-3xl bg-gradient-to-r from-hotel-600 to-hotel-800 text-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features & Amenities</h2>
            <p className="mx-auto max-w-[700px] text-hotel-100 md:text-xl">
              Our hotel booking platform offers a wide range of features to make your stay comfortable and convenient.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 bg-white/10 p-4 rounded-xl">
              <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm md:text-base">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

