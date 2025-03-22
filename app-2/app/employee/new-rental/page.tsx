import type { Metadata } from "next"
import { NewRentalForm } from "@/components/new-rental-form"

export const metadata: Metadata = {
  title: "Create New Rental - Hotel Booking App",
  description: "Create a new direct rental for a walk-in guest.",
}

export default function NewRentalPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Rental</h1>
        <p className="text-gray-500 mb-8">
          Use this form to create a direct rental for a walk-in guest without a prior reservation.
        </p>

        <NewRentalForm />
      </div>
    </div>
  )
}

