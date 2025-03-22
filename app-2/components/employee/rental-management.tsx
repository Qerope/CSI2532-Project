"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RentalTable } from "@/components/rental-table"
import { ReservationTable } from "@/components/reservation-table"
import { useRouter } from "next/navigation"
import { PaymentSummary } from "../payment-summary"

export function RentalManagement() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Rental Management</h2>
        <Button onClick={() => router.push("/employee/new-rental")}>Create New Rental</Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Rentals</TabsTrigger>
          <TabsTrigger value="checkout">Today's Check-outs</TabsTrigger>
          <TabsTrigger value="reservations">Pending Reservations</TabsTrigger>
          <TabsTrigger value="checkin">Today's Check-ins</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <RentalTable type="all" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkout">
          <Card>
            <CardHeader>
              <CardTitle>Today's Check-outs</CardTitle>
            </CardHeader>
            <CardContent>
              <RentalTable type="checkout" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reservations</CardTitle>
            </CardHeader>
            <CardContent>
              <ReservationTable type="all" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkin">
          <Card>
            <CardHeader>
              <CardTitle>Today's Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <ReservationTable type="checkin" />
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

