import type { Metadata } from "next"
import BookingsClientPage from "./BookingsClientPage"

export const metadata: Metadata = {
  title: "My Bookings - Hotel Booking App",
  description: "View and manage your hotel bookings.",
}

export default function BookingsPage() {
  return <BookingsClientPage />
}

