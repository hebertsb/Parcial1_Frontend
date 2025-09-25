/**
 * Página para que el inquilino vea los detalles de su residencia
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Calendar,
  ArrowLeft,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function MiResidencia() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      
      {/* Header con botón de regreso */}
      <div className="flex items-center gap-4">
        <Link href="/inquilino/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Residencia</h1>
          <p className="text-muted-foreground">
            Detalles de tu unidad de vivienda
          </p>
        </div>
      </div>

      {/* Información de la Unidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Detalles de la Unidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-500" />
              Información de la Unidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Número de Unidad:</span>
              <span>Apt 204-B</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Piso:</span>
              <span>2do Piso</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tipo:</span>
              <span>Apartamento</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Área:</span>
              <span>85 m²</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Habitaciones:</span>
              <span>3</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Baños:</span>
              <span>2</span>
            </div>
          </CardContent>
        </Card>

        {/* Información del Propietario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              Propietario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Nombre:</span>
              <span>María González</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Teléfono:</span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                +591 7123-4567
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Email:</span>
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                maria.gonzalez@email.com
              </span>
            </div>
            <Button className="w-full mt-4" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Contactar Propietario
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* Información del Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Información del Contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium text-sm text-muted-foreground">Fecha de Inicio</span>
              <p className="text-lg">01/01/2024</p>
            </div>
            <div>
              <span className="font-medium text-sm text-muted-foreground">Fecha de Vencimiento</span>
              <p className="text-lg">31/12/2024</p>
            </div>
            <div>
              <span className="font-medium text-sm text-muted-foreground">Alquiler Mensual</span>
              <p className="text-lg font-semibold text-green-600">$450</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            Ubicación del Condominio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Dirección:</strong> Av. Principal #123, Torre Residencial</p>
            <p><strong>Barrio:</strong> Centro Urbano</p>
            <p><strong>Ciudad:</strong> Santa Cruz, Bolivia</p>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Si tienes alguna pregunta sobre tu residencia o necesitas reportar algún problema, 
          puedes contactar a la administración o usar la sección de solicitudes.
        </AlertDescription>
      </Alert>

    </div>
  );
}