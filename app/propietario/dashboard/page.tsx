/**
 * Dashboard principal para propietarios
 * Permite acceder a todas las funcionalidades de propietario
 */

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  Plus,
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function PropietarioDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Propietario</h1>
        <p className="text-muted-foreground">
          Gestiona tus propiedades e inquilinos desde aquí
        </p>
      </div>

      {/* Bienvenida */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Bienvenido a tu panel de propietario. Desde aquí puedes solicitar tu registro oficial y gestionar tus inquilinos.
        </AlertDescription>
      </Alert>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Registrar Nuevo Inquilino */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Registrar Inquilino
            </CardTitle>
            <CardDescription>
              Registra un nuevo inquilino en una de tus propiedades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/propietario/solicitar-registro">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Inquilino
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Gestionar Inquilinos */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Mis Inquilinos
            </CardTitle>
            <CardDescription>
              Registra y gestiona los inquilinos de tus propiedades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/propietario/mis-inquilinos">
              <Button className="w-full" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Gestionar Inquilinos
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Mis Propiedades */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-500" />
              Mis Propiedades
            </CardTitle>
            <CardDescription>
              Ve el estado y detalles de tus unidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/propietario/mis-propiedades">
              <Button className="w-full" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Ver Propiedades
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Estados de Cuenta */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-500" />
              Estados de Cuenta
            </CardTitle>
            <CardDescription>
              Consulta tus pagos y expensas pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/propietario/estados-cuenta">
              <Button className="w-full" variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Ver Estados
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Comunicados */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Comunicados
            </CardTitle>
            <CardDescription>
              Lee los comunicados de la administración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/propietario/comunicados">
              <Button className="w-full" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ver Comunicados
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Reservas */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Reservas
            </CardTitle>
            <CardDescription>
              Reserva espacios comunes del condominio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/propietario/reservas">
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Hacer Reserva
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Resumen/Estado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Estado de Solicitudes */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de mis Solicitudes</CardTitle>
            <CardDescription>
              Seguimiento de tus solicitudes pendientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Registro de Copropietario</span>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Pendiente
                </span>
              </div>
              
              {/* Aquí se mostrarían las solicitudes reales del usuario */}
              <p className="text-sm text-muted-foreground">
                No tienes solicitudes pendientes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones Recientes */}
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones Recientes</CardTitle>
            <CardDescription>
              Últimas actualizaciones importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Nuevo comunicado disponible</p>
                <p className="text-xs text-muted-foreground">
                  "Mantenimiento de áreas comunes" - Hace 2 horas
                </p>
              </div>
              
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Estado de cuenta actualizado</p>
                <p className="text-xs text-muted-foreground">
                  Expensas del mes de Septiembre - Hace 1 día
                </p>
              </div>
              
              <Link href="/propietario/notificaciones">
                <Button variant="link" className="p-0 h-auto">
                  Ver todas las notificaciones
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}