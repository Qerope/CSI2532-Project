"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HotelManagement } from "@/components/employee/hotel-management"
import { RentalManagement } from "@/components/employee/rental-management"
import { GuestManagement } from "@/components/employee/guest-management"
import { EmployeeManagement } from "@/components/employee/employee-management"
import { PaymentManagement } from "@/components/employee/payment-management"
import { ArchivedRecords } from "@/components/employee/archived-records"
import { AvailabilityView } from "@/components/employee/availability-view"
import { RoomCapacityView } from "@/components/employee/room-capacity-view"
import { Archive, Building, CreditCard, Database, FileText, Users } from "lucide-react"

export default function EmployeePage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Employee Portal</h1>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-9 mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="capacity">Capacity</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Management</CardTitle>
                <CardDescription>Manage hotel chains, hotels, and rooms</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Add, update, or delete hotel chains, hotels, and rooms. Manage room details, amenities, and pricing.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("hotels")} className="w-full">
                  <Building className="h-4 w-4 mr-2" />
                  Manage Hotels
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rental Management</CardTitle>
                <CardDescription>Manage reservations and rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Convert reservations to rentals, create direct rentals, and manage existing rentals.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("rentals")} className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Rentals
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Management</CardTitle>
                <CardDescription>Manage guest information</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Add, update, or delete guest information. View guest history and manage guest profiles.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("guests")} className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Guests
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Employee Management</CardTitle>
                <CardDescription>Manage employee information</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Add, update, or delete employee information. Assign roles and manage employee profiles.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("employees")} className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Employees
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Manage payment records</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Add, update, or delete payment records. Track payments for rentals and view payment history.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("payments")} className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manage Payments
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Archived Records</CardTitle>
                <CardDescription>View archived reservations and rentals</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Access historical data for completed reservations and rentals. View detailed information about past
                  transactions.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("archives")} className="w-full">
                  <Archive className="h-4 w-4 mr-2" />
                  View Archives
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Availability</CardTitle>
                <CardDescription>View available rooms by area</CardDescription>
              </CardHeader>
              <CardContent>
                <p>View the number of available rooms by area. Filter by date range and other criteria.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("availability")} className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  View Availability
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Capacity</CardTitle>
                <CardDescription>View room capacity by hotel</CardDescription>
              </CardHeader>
              <CardContent>
                <p>View the capacity of all rooms in a specific hotel. Filter by hotel and other criteria.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("capacity")} className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  View Capacity
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>Generate reports and view analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Generate custom reports on occupancy, revenue, and other metrics. View analytics dashboards.</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hotels">
          <HotelManagement />
        </TabsContent>

        <TabsContent value="rentals">
          <RentalManagement />
        </TabsContent>

        <TabsContent value="guests">
          <GuestManagement />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="archives">
          <ArchivedRecords />
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilityView />
        </TabsContent>

        <TabsContent value="capacity">
          <RoomCapacityView />
        </TabsContent>
      </Tabs>
    </div>
  )
}

