import type { Metadata } from "next"
import { RentalTable } from "@/components/rental-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Manage Rentals - Hotel Booking App",
  description: "View and manage active rentals.",
}

export default function RentalsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Check for success messages from redirects
  const success = searchParams.success as string
  const id = searchParams.id as string

  let successMessage = null
  if (success === "checkin") {
    successMessage = `Guest successfully checked in for reservation ${id}`
  } else if (success === "payment") {
    successMessage = `Payment processed successfully for rental ${id}`
  } else if (success === "created") {
    successMessage = "New rental created successfully"
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Rentals</h1>
          <p className="text-gray-500">View and manage active rentals</p>
        </div>
        <Button asChild>
          <Link href="/employee/new-rental">Create New Rental</Link>
        </Button>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <RentalTable />
    </div>
  )
}

