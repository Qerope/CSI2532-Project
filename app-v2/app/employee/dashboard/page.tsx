import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeStats } from "@/components/employee-stats"
import { ReservationTable } from "@/components/reservation-table"
import { RentalTable } from "@/components/rental-table"
import { PaymentSummary } from "@/components/payment-summary"

export const metadata: Metadata = {
  title: "Employee Dashboard - Hotel Booking App",
  description: "Manage hotel reservations and rentals.",
}

export default function EmployeeDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-gray-500">Manage reservations and rentals</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/employee/new-rental">Create New Rental</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EmployeeStats />
      </div>

      <Tabs defaultValue="reservations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reservations">Upcoming Reservations</TabsTrigger>
          <TabsTrigger value="checkins">Today's Check-ins</TabsTrigger>
          <TabsTrigger value="checkouts">Today's Check-outs</TabsTrigger>
          <TabsTrigger value="rentals">Active Rentals</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Reservations</CardTitle>
              <CardDescription>Manage upcoming guest reservations</CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkins" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Check-ins</CardTitle>
              <CardDescription>Guests checking in today</CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationTable type="checkin" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkouts" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Today's Check-outs</CardTitle>
              <CardDescription>Guests checking out today</CardDescription>
            </CardHeader>
            <CardContent>
              <RentalTable type="checkout" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rentals" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Rentals</CardTitle>
              <CardDescription>Currently occupied rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <RentalTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Payments</CardTitle>
              <CardDescription>Manage Payments</CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentSummary />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

