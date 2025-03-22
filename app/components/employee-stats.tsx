import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CalendarCheck, CalendarX, DollarSign } from "lucide-react"

export function EmployeeStats() {
  // In a real application, this data would come from your database
  const stats = [
    {
      title: "Total Guests",
      value: "42",
      description: "Currently in hotel",
      icon: Users,
      change: "+12% from last week",
    },
    {
      title: "Today's Check-ins",
      value: "8",
      description: "Reservations",
      icon: CalendarCheck,
      change: "2 pending",
    },
    {
      title: "Today's Check-outs",
      value: "5",
      description: "Rooms to be vacated",
      icon: CalendarX,
      change: "All on schedule",
    },
    {
      title: "Revenue",
      value: "$12,450",
      description: "This week",
      icon: DollarSign,
      change: "+18% from last week",
    },
  ]

  return (
    <>
      {stats.slice(0, 3).map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

