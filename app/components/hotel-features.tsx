import { CheckCircle2 } from "lucide-react"

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
    <section className="py-12 bg-muted/50 rounded-lg">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features & Amenities</h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Our hotel booking platform offers a wide range of features to make your stay comfortable and convenient.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

