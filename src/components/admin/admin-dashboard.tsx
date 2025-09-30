"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Building2,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Plus,
  Bell,
  ClipboardList,
  UserCheck,
  Home,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { useSolicitudesRegistro } from "@/hooks/useSolicitudesRegistro"
import { useEstadisticasAdmin } from "@/hooks/useEstadisticasAdmin"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
} from "recharts"
import { CoOwnersManagement } from "../unidades/co-owners-management"

// Enhanced mock data with more realistic information
const stats = [
  {
    title: "Total Unidades",
    value: "156",
    change: "+2.5%",
    trend: "up",
    icon: Building2,
    description: "4 torres, 39 viviendas promedio por torre",
    link: "/admin/unidades",
  },
  {
    title: "Usuarios del Sistema",
    value: "342",
    change: "+5.2%",
    trend: "up",
    icon: Users,
    description: "Propietarios e inquilinos registrados",
    link: "/admin/usuarios",
  },
  {
    title: "Ingresos Mensuales",
    value: "$45,230",
    change: "-1.8%",
    trend: "down",
    icon: CreditCard,
    description: "Incluye cuotas de mantenimiento y amenidades",
    link: "/admin/finanzas",
  },
  {
    title: "Problemas Pendientes",
    value: "8",
    change: "+12.5%",
    trend: "up",
    icon: AlertTriangle,
    description: "Reportes de mantenimiento y reparaciones",
  },
]

const revenueData = [
  { month: "Ene", revenue: 42000, expenses: 28000, maintenance: 8000, utilities: 12000 },
  { month: "Feb", revenue: 45000, expenses: 30000, maintenance: 9000, utilities: 11500 },
  { month: "Mar", revenue: 43000, expenses: 29000, maintenance: 8500, utilities: 12200 },
  { month: "Abr", revenue: 47000, expenses: 31000, maintenance: 9500, utilities: 11800 },
  { month: "May", revenue: 45230, expenses: 30500, maintenance: 8800, utilities: 12100 },
]

const buildingStatus = [
  {
    building: "Torre A",
    occupied: 38,
    total: 40,
    image: "/modern-residential-tower-building-a.jpg",
    amenities: ["Piscina", "Gimnasio", "Jardín en Azotea"],
    issues: 2,
  },
  {
    building: "Torre B",
    occupied: 35,
    total: 38,
    image: "/modern-residential-tower-building-b.jpg",
    amenities: ["Spa", "Centro de Negocios", "Parque Infantil"],
    issues: 1,
  },
  {
    building: "Torre C",
    occupied: 33,
    total: 42,
    image: "/modern-residential-tower-building-c.jpg",
    amenities: ["Biblioteca", "Sala de Juegos", "Área BBQ"],
    issues: 3,
  },
  {
    building: "Torre D",
    occupied: 32,
    total: 36,
    image: "/modern-residential-tower-building-d.jpg",
    amenities: ["Estudio de Yoga", "Coworking", "Parque para Mascotas"],
    issues: 2,
  },
]

const recentActivities = [
  {
    id: "1",
    type: "payment",
    user: "María González",
    unit: "A-301",
    description: "Cuota de mantenimiento mensual pagada",
    amount: "$450",
    time: "hace 2 horas",
    avatar: "/professional-woman-headshot.png",
    status: "completado",
  },
  {
    id: "2",
    type: "maintenance",
    user: "Equipo de Mantenimiento",
    unit: "B-205",
    description: "Mantenimiento de ascensor completado",
    time: "hace 4 horas",
    avatar: "/maintenance-worker-headshot.jpg",
    status: "completado",
  },
  {
    id: "3",
    type: "security",
    user: "Alerta de Seguridad",
    unit: "Estacionamiento",
    description: "Intento de acceso no autorizado detectado",
    time: "hace 6 horas",
    avatar: "/security-guard-headshot.jpg",
    status: "investigando",
  },
  {
    id: "4",
    type: "reservation",
    user: "Carlos Rodríguez",
    unit: "C-102",
    description: "Área de piscina reservada para fiesta",
    time: "hace 1 día",
    avatar: "/professional-man-headshot.png",
    status: "aprobado",
  },
]

const utilityData = [
  { name: "Electricidad", value: 35, color: "#8884d8" },
  { name: "Agua", value: 25, color: "#82ca9d" },
  { name: "Gas", value: 20, color: "#ffc658" },
  { name: "Internet", value: 15, color: "#ff7300" },
  { name: "Otros", value: 5, color: "#00ff00" },
]

export default function AdminDashboard() {
  const { obtenerContadorPendientes, cargarSolicitudes } = useSolicitudesRegistro();
  const { estadisticas, loading, error, recargar } = useEstadisticasAdmin();
  const solicitudesPendientes = obtenerContadorPendientes();

  // Cargar solicitudes al montar el componente  
  React.useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  // Estadísticas dinámicas con datos reales - con validaciones para evitar errores
  const statsConDatos = [
    {
      title: "Total Unidades",
      value: estadisticas?.totalUnidades?.toString() || "0",
      change: estadisticas?.totalUnidades > 0 ? `${estadisticas.unidadesOcupadas} ocupadas` : "0",
      trend: "up",
      icon: Building2,
      description: `${estadisticas?.unidadesDisponibles || 0} disponibles, ${estadisticas?.unidadesAlquiladas || 0} alquiladas`,
      link: "/admin/unidades",
    },
    {
      title: "Usuarios Registrados",
      value: estadisticas?.totalUsuarios?.toString() || "0",
      change: `${estadisticas?.totalPropietarios || 0} propietarios`,
      trend: "up",
      icon: Users,
      description: `${estadisticas?.totalInquilinos || 0} inquilinos registrados en el sistema`,
      link: "/admin/usuarios",
    },
    {
      title: "Solicitudes Pendientes", 
      value: estadisticas?.solicitudesPendientes?.toString() || "0",
      change: (estadisticas?.solicitudesPendientes || 0) > 0 ? `+${estadisticas.solicitudesPendientes}` : "0",
      trend: (estadisticas?.solicitudesPendientes || 0) > 0 ? "up" : "neutral",
      icon: ClipboardList,
      description: "Nuevas solicitudes de registro esperando aprobación",
      link: "/admin/solicitudes",
    },
    {
      title: "Ingresos Mensuales",
      value: (estadisticas?.ingresosMensuales || 0) > 0 ? `Bs ${estadisticas.ingresosMensuales.toLocaleString()}` : "Por implementar",
      change: "+12.8%",
      trend: "up",
      icon: CreditCard,
      description: "Incluye cuotas de mantenimiento y amenidades",
      link: "/admin/finanzas",
    },
  ];

  // Mostrar estado de carga mientras se cargan las estadísticas
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Cargando estadísticas del dashboard...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si ocurre alguno
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-white mb-4">Error al cargar el dashboard: {error}</p>
          <Button onClick={recargar} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0a0a0a] text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance text-white">Panel de Administración</h1>
          <p className="text-gray-400">Vista general completa de la gestión del condominio</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
            <Calendar className="w-4 h-4 mr-2" />
            Calendario
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
            <Bell className="w-4 h-4 mr-2" />
            Alertas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConDatos.map((stat) => {
          const StatCard = (
            <Card className={`bg-[#111111] border-[#1f1f1f] hover:shadow-lg transition-shadow ${(stat as any).link ? 'cursor-pointer hover:bg-[#151515]' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                  <span className="ml-1">del mes pasado</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
                {(stat as any).link && (
                  <p className="text-xs text-blue-400 mt-2">Click para gestionar →</p>
                )}
              </CardContent>
            </Card>
          );
          
          return (stat as any).link ? (
            <Link key={stat.title} href={(stat as any).link}>
              {StatCard}
            </Link>
          ) : (
            <div key={stat.title}>
              {StatCard}
            </div>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-[#111111] border-[#1f1f1f]">
          <TabsTrigger
            value="overview"
            className="text-gray-300 data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white"
          >
            Resumen
          </TabsTrigger>
          <TabsTrigger
            value="buildings"
            className="text-gray-300 data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white"
          >
            Viviendas
          </TabsTrigger>
          <TabsTrigger
            value="finances"
            className="text-gray-300 data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white"
          >
            Finanzas
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="text-gray-300 data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white"
          >
            Usuarios
          </TabsTrigger>
          <TabsTrigger
            value="co-owners"
            className="text-gray-300 data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white"
          >
            Copropietarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="bg-[#111111] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-white">Resumen Financiero</CardTitle>
                <CardDescription className="text-gray-400">Ingresos mensuales, gastos y desglose</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111111",
                        border: "1px solid #1f1f1f",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Ingresos" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Utility Distribution */}
            <Card className="bg-[#111111] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-white">Distribución de Servicios</CardTitle>
                <CardDescription className="text-gray-400">Desglose de costos mensuales de servicios</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={utilityData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {utilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111111",
                        border: "1px solid #1f1f1f",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card className="bg-[#111111] border-[#1f1f1f]">
            <CardHeader>
              <CardTitle className="text-white">Actividades Recientes</CardTitle>
              <CardDescription className="text-gray-400">Últimas actividades en el condominio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-[#1a1a1a]">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                      <AvatarFallback className="bg-[#2a2a2a] text-white">
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-white">{activity.user}</p>
                        <span className="text-sm text-gray-400">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-400">{activity.description}</p>
                      <div className="flex items-center space-x-2">
                        {activity.unit && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {activity.unit}
                          </Badge>
                        )}
                        <Badge
                          variant={
                            activity.status === "completado"
                              ? "default"
                              : activity.status === "aprobado"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                        {activity.amount && (
                          <span className="text-sm font-medium text-green-400">{activity.amount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buildings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buildingStatus.map((building) => (
              <Card key={building.building} className="bg-[#111111] border-[#1f1f1f] hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">{building.building}</CardTitle>
                    <Badge
                      variant={building.issues > 2 ? "destructive" : building.issues > 0 ? "secondary" : "default"}
                      className="text-xs"
                    >
                      {building.issues} problemas
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={building.image || "/placeholder.svg?height=128&width=400&query=modern residential building"}
                    alt={building.building}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-white">Ocupación</span>
                      <span className="text-gray-400">
                        {Math.round((building.occupied / building.total) * 100)}% ({building.occupied}/{building.total})
                      </span>
                    </div>
                    <Progress value={(building.occupied / building.total) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-white">Amenidades:</span>
                    <div className="flex flex-wrap gap-1">
                      {building.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finances" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-[#111111] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-white">Tendencia de Ingresos</CardTitle>
                <CardDescription className="text-gray-400">Seguimiento de ingresos y gastos mensuales</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111111",
                        border: "1px solid #1f1f1f",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Ingresos" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Gastos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="bg-[#111111] border-[#1f1f1f]">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas Financieras Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Total Ingresos</span>
                    <span className="font-medium text-white">$222,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Total Gastos</span>
                    <span className="font-medium text-white">$148,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Beneficio Neto</span>
                    <span className="font-medium text-green-400">$73,730</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-600">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Tasa de Cobro</span>
                      <span className="font-medium text-white">94.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Pendientes</span>
                      <span className="font-medium text-red-400">$12,450</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Gestión de Usuarios</h3>
            <p className="text-gray-400 mb-4">Administra propietarios, inquilinos y usuarios del sistema</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.location.href = '/admin/usuarios'}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ver Gestión de Usuarios
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="co-owners">
          <CoOwnersManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
