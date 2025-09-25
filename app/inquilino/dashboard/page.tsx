/**
 * Dashboard principal para inquilinos
 * Panel similar al de propietario pero sin funciones de gestión de inquilinos
 */

'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  FileText, 
  CreditCard, 
  Settings, 
  MessageSquare,
  Calendar,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';

export default function InquilinoDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Inquilino</h1>
        <p className="text-muted-foreground">
          Gestiona tu residencia y consulta información desde aquí
        </p>
      </div>

      {/* Bienvenida */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Bienvenido a tu panel de inquilino. Desde aquí puedes consultar el estado de tu residencia y realizar gestiones.
        </AlertDescription>
      </Alert>

      {/* Acciones Disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Mi Propiedad/Residencia */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-purple-500" />
              Mi Residencia
            </CardTitle>
            <CardDescription>
              Ve los detalles de tu unidad de residencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/inquilino/mi-residencia">
              <Button className="w-full" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Ver Mi Unidad
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
            <Link href="/inquilino/estados-cuenta">
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
            <Link href="/inquilino/comunicados">
              <Button className="w-full" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ver Comunicados
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Solicitudes */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Mis Solicitudes
            </CardTitle>
            <CardDescription>
              Realiza solicitudes de mantenimiento o reclamos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/inquilino/solicitudes">
              <Button className="w-full" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Ver Solicitudes
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Reservas */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              Reservas
            </CardTitle>
            <CardDescription>
              Reserva espacios comunes del condominio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/inquilino/reservas">
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Gestionar Reservas
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Perfil */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              Mi Perfil
            </CardTitle>
            <CardDescription>
              Actualiza tu información personal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/inquilino/perfil">
              <Button className="w-full" variant="outline">
                <User className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </Link>
          </CardContent>
        </Card>

      </div>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Información de Contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Administración:</strong> admin@condominio.com
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Emergencias:</strong> 911 - 24/7
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Mantenimiento:</strong> Lun-Vie 8:00-17:00
            </p>
          </CardContent>
        </Card>

        {/* Recordatorios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              Recordatorios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Recuerda pagar tus expensas antes del día 10 de cada mes para evitar recargos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}