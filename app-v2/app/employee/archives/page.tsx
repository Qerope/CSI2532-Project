import type { Metadata } from "next"
import { ArchivedRecords } from "@/components/employee/archived-records"

export const metadata: Metadata = {
  title: "Archived Records - Hotel Booking App",
  description: "View archived reservations and rentals.",
}

export default function ArchivesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Archived Records</h1>
      <p className="text-gray-500 mb-8">View historical data for completed reservations and rentals.</p>

      <ArchivedRecords />
    </div>
  )
}

