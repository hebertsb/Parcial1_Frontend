"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, Home, Users, AlertCircle, CheckCircle, Clock, Plus, Eye } from "lucide-react"

// Mock data for owner dashboard
const ownerStats = [
  {
    title: "Monthly Expenses",
    value: "$1,250",
    status: "paid",
    dueDate: "Feb 1, 2024",
    icon: CreditCard,
  },
  {
    title: "Unit Status",
    value: "Occupied",
    details: "A-301",
    icon: Home,
  },
  {
    title: "Family Members",
    value: "4",
    details: "2 Adults, 2 Children",
    icon: Users,
  },
  {
    title: "Reservations",
    value: "2",
    details: "This month",
    icon: Calendar,
  },
]

const paymentHistory = [
  { id: "1", description: "Monthly Expenses - January", amount: 1250, date: "2024-01-01", status: "paid" },
  { id: "2", description: "Special Assessment - Elevator", amount: 150, date: "2024-01-15", status: "paid" },
  { id: "3", description: "Monthly Expenses - December", amount: 1250, date: "2023-12-01", status: "paid" },
  { id: "4", description: "Monthly Expenses - November", amount: 1200, date: "2023-11-01", status: "paid" },
]

const upcomingPayments = [
  { id: "1", description: "Monthly Expenses - February", amount: 1250, dueDate: "2024-02-01", status: "pending" },
  {
    id: "2",
    description: "Special Assessment - Pool Maintenance",
    amount: 200,
    dueDate: "2024-02-15",
    status: "pending",
  },
]

const reservations = [
  { id: "1", facility: "Community Room", date: "2024-02-10", time: "18:00 - 22:00", status: "confirmed", guests: 15 },
  { id: "2", facility: "Pool Area", date: "2024-02-15", time: "14:00 - 16:00", status: "pending", guests: 8 },
]

const familyMembers = [
  { id: "1", name: "John Owner", relationship: "Self", age: "Adult", status: "primary" },
  { id: "2", name: "Jane Owner", relationship: "Spouse", age: "Adult", status: "active" },
  { id: "3", name: "Mike Owner", relationship: "Son", age: "16", status: "active" },
  { id: "4", name: "Sarah Owner", relationship: "Daughter", age: "12", status: "active" },
]

const notifications = [
  {
    id: "1",
    title: "Pool Maintenance Scheduled",
    message: "Pool will be closed Feb 5-7 for maintenance",
    type: "info",
    date: "2024-01-25",
  },
  {
    id: "2",
    title: "Payment Reminder",
    message: "February expenses due in 5 days",
    type: "warning",
    date: "2024-01-27",
  },
  {
    id: "3",
    title: "Community Meeting",
    message: "Monthly meeting scheduled for Feb 20",
    type: "info",
    date: "2024-01-28",
  },
]

export function OwnerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your unit and community involvement</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <CreditCard className="w-4 h-4 mr-2" />
            Make Payment
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Book Facility
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ownerStats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.status && (
                <Badge variant={stat.status === "paid" ? "default" : "secondary"} className="mt-2">
                  {stat.status}
                </Badge>
              )}
              {stat.details && <p className="text-xs text-muted-foreground mt-1">{stat.details}</p>}
              {stat.dueDate && <p className="text-xs text-muted-foreground mt-1">Due: {stat.dueDate}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payments and Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment History */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Recent payment transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${payment.amount}</p>
                    <Badge variant="default" className="mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Payments */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Payments</CardTitle>
              <CardDescription>Payments due soon</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium">{payment.description}</p>
                    <p className="text-sm text-muted-foreground">Due: {payment.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${payment.amount}</p>
                    <Badge variant="secondary" className="mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations and Family */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservations */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Reservations</CardTitle>
              <CardDescription>Upcoming facility bookings</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium">{reservation.facility}</p>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {reservation.date} • {reservation.time}
                      </p>
                      <p>{reservation.guests} guests</p>
                    </div>
                  </div>
                  <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                    {reservation.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Family Members */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Family Members</CardTitle>
              <CardDescription>Registered household members</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium">{member.name}</p>
                    <div className="text-sm text-muted-foreground">
                      <span>{member.relationship}</span>
                      <span className="mx-2">•</span>
                      <span>{member.age}</span>
                    </div>
                  </div>
                  <Badge variant={member.status === "primary" ? "default" : "secondary"}>{member.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Important updates and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                <div className="mt-1">
                  {notification.type === "warning" ? (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
