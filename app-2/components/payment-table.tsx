"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, TrendingUp } from "lucide-react"

interface PaymentSummary {
  totalPayments: number
  totalamount: number
  recentPayments: number
  averagePayment: number
}

export function PaymentSummary() {
  const [summary, setSummary] = useState<PaymentSummary>({
    totalPayments: 0,
    totalamount: 0,
    recentPayments: 0,
    averagePayment: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPaymentSummary = async () => {
      try {
        const response = await fetch("http://localhost:5010/api/payments/summary")

        if (response.ok) {
          const data = await response.json()
          setSummary(data)
        } else {
          throw new Error("Failed to fetch payment summary")
        }
      } catch (error) {
        console.error("Error fetching payment summary:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentSummary()
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.totalamount.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">From {summary.totalPayments} payments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.recentPayments}</div>
          <p className="text-xs text-muted-foreground">In the last 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summary.averagePayment.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>
    </>
  )
}

