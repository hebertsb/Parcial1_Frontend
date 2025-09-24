"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, Home, AlertCircle, CheckCircle, Clock, Plus, Eye } from "lucide-react"

// Mock data for tenant dashboard
const tenantStats = [
  {
    title: "Monthly Rent",
    value: "$2,100",
    status: "paid",
    dueDate: "Feb 1, 2024",
    icon: CreditCard,
  },
  {
    title: "Lease Status",
    value: "Active",
    details: "Expires Dec 2024",
    icon: Home,
  },
  {
    title: "Expenses Share",
    value: "$180",
    status: "pending",
    dueDate: "Feb 1, 2024",
    icon: CreditCard,
  },
  {
    title: "Reservations",
    value: "1",
    details: "This month",
    icon: Calendar,
  },
]

const paymentHistory = [
  { id: "1", description: "Monthly Rent - January", amount: 2100, date: "2024-01-01", status: "paid" },
  { id: "2", description: "Expenses Share - January", amount: 180, date: "2024-01-01", status: "paid" },
  { id: "3", description: "Monthly Rent - December", amount: 2100, date: "2023-12-01", status: "paid" },
  { id: "4", description: "Expenses Share - December", amount: 175, date: "2023-12-01", status: "paid" },
]

const upcomingPayments = [
  { id: "1", description: "Monthly Rent - February", amount: 2100, dueDate: "2024-02-01", status: "pending" },
  { id: "2", description: "Expenses Share - February", amount: 180, dueDate: "2024-02-01", status: "pending" },
]

const reservations = [
  { id: "1", facility: "Gym", date: "2024-02-08", time: "19:00 - 20:00", status: "confirmed", guests: 1 },
]

const notifications = [
  { id: "1", title: "Rent Reminder", message: "February rent due in 3 days", type: "warning", date: "2024-01-29" },
  {
    id: "2",
    title: "Gym Schedule Update",
    message: "New operating hours: 6 AM - 10 PM",
    type: "info",
    date: "2024-01-26",
  },
  {
    id: "3",
    title: "Building Maintenance",
    message: "Water will be shut off Feb 12, 9-11 AM",
    type: "info",
    date: "2024-01-28",
  },
]

const leaseInfo = {
  unitNumber: "B-205",
  leaseStart: "Jan 1, 2024",
  leaseEnd: "Dec 31, 2024",
  monthlyRent: 2100,
  securityDeposit: 2100,
  landlord: "Property Management Co.",
  emergencyContact: "+1 (555) 123-4567",
}

export function TenantDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Tenant Dashboard</h1>
          <p className="text-muted-foreground">Manage your rental and community access</p>
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
        {tenantStats.map((stat) => (
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

      {/* Payments */}
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

      {/* Lease Info and Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lease Information */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Lease Information</CardTitle>
            <CardDescription>Your rental agreement details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Unit Number</p>
                  <p className="font-medium">{leaseInfo.unitNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium">${leaseInfo.monthlyRent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lease Start</p>
                  <p className="font-medium">{leaseInfo.leaseStart}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lease End</p>
                  <p className="font-medium">{leaseInfo.leaseEnd}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Security Deposit</p>
                  <p className="font-medium">${leaseInfo.securityDeposit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Contact</p>
                  <p className="font-medium">{leaseInfo.emergencyContact}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="space-y-1">
                      <p className="font-medium">{reservation.facility}</p>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {reservation.date} • {reservation.time}
                        </p>
                        <p>{reservation.guests} guest(s)</p>
                      </div>
                    </div>
                    <Badge variant={reservation.status === "confirmed" ? "default" : "secondary"}>
                      {reservation.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming reservations</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Book a facility
                  </Button>
                </div>
              )}
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
