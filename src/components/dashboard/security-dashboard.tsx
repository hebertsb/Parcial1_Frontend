"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, Users, AlertTriangle, Clock, Eye, Plus, CheckCircle, XCircle } from "lucide-react"

// Mock data for security dashboard
const securityStats = [
  {
    title: "Active Cameras",
    value: "24",
    status: "operational",
    icon: Camera,
  },
  {
    title: "Visitors Today",
    value: "18",
    change: "+3 from yesterday",
    icon: Users,
  },
  {
    title: "Security Alerts",
    value: "2",
    status: "pending",
    icon: AlertTriangle,
  },
  {
    title: "Guard Shifts",
    value: "3",
    status: "active",
    icon: Clock,
  },
]

const recentVisitors = [
  {
    id: "1",
    name: "John Doe",
    unit: "A-301",
    purpose: "Delivery",
    timeIn: "14:30",
    timeOut: "14:45",
    status: "completed",
  },
  { id: "2", name: "Jane Smith", unit: "B-205", purpose: "Guest", timeIn: "15:20", timeOut: null, status: "active" },
  {
    id: "3",
    name: "Mike Johnson",
    unit: "C-102",
    purpose: "Maintenance",
    timeIn: "13:15",
    timeOut: "16:30",
    status: "completed",
  },
  { id: "4", name: "Sarah Wilson", unit: "D-404", purpose: "Guest", timeIn: "16:45", timeOut: null, status: "active" },
]

const securityIncidents = [
  {
    id: "1",
    type: "Unauthorized Access",
    location: "Parking Garage",
    time: "12:30",
    severity: "high",
    status: "investigating",
  },
  {
    id: "2",
    type: "Noise Complaint",
    location: "Building B - Floor 3",
    time: "22:15",
    severity: "medium",
    status: "resolved",
  },
  {
    id: "3",
    type: "Suspicious Activity",
    location: "Main Entrance",
    time: "18:45",
    severity: "low",
    status: "monitoring",
  },
]

const cameraFeeds = [
  { id: "1", location: "Main Entrance", status: "online", lastUpdate: "2 min ago" },
  { id: "2", location: "Parking Garage", status: "online", lastUpdate: "1 min ago" },
  { id: "3", location: "Pool Area", status: "offline", lastUpdate: "15 min ago" },
  { id: "4", location: "Gym", status: "online", lastUpdate: "3 min ago" },
  { id: "5", location: "Lobby", status: "online", lastUpdate: "1 min ago" },
  { id: "6", location: "Rooftop", status: "online", lastUpdate: "4 min ago" },
]

export function SecurityDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage building security</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Log Incident
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Add Visitor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityStats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.status && (
                <Badge
                  variant={stat.status === "operational" || stat.status === "active" ? "default" : "secondary"}
                  className="mt-2"
                >
                  {stat.status}
                </Badge>
              )}
              {stat.change && <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Camera Feeds */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Security Cameras</CardTitle>
          <CardDescription>Live camera feed status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameraFeeds.map((camera) => (
              <div key={camera.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{camera.location}</h4>
                  <div className="flex items-center space-x-2">
                    {camera.status === "online" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <Badge variant={camera.status === "online" ? "default" : "destructive"}>{camera.status}</Badge>
                  </div>
                </div>
                <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Updated: {camera.lastUpdate}</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visitors and Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visitors */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Visitors</CardTitle>
              <CardDescription>Today's visitor log</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisitors.map((visitor) => (
                <div key={visitor.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium">{visitor.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Unit {visitor.unit}</span>
                      <span>•</span>
                      <span>{visitor.purpose}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      In: {visitor.timeIn} {visitor.timeOut && `• Out: ${visitor.timeOut}`}
                    </div>
                  </div>
                  <Badge variant={visitor.status === "active" ? "default" : "secondary"}>{visitor.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Incidents */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Security Incidents</CardTitle>
              <CardDescription>Recent security events</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="space-y-1">
                    <p className="font-medium">{incident.type}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{incident.location}</span>
                      <span>•</span>
                      <span>{incident.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        incident.severity === "high"
                          ? "destructive"
                          : incident.severity === "medium"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline">{incident.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
