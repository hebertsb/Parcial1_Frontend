/**
 * Formulario para registro de inquilinos por parte de propietarios
 * Permite a propietarios registrar inquilinos en sus propiedades
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Home, CheckCircle, AlertCircle } from 'lucide-react';
import { useInquilinos } from '@/hooks/useInquilinos';
import { type RegistroInquilinoData } from '@/features/inquilinos/services';

// Schema de validación para registro de inquilinos actualizado
const registroInquilinoSchema = z.object({
  // Información personal
  nombre: z.string().min(2, 'El nombre es requerido'),
  apellido: z.string().min(2, 'El apellido es requerido'),
  documento_identidad: z.string().min(6, 'Documento de identidad es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono es requerido'),
  fecha_nacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
  genero: z.enum(['M', 'F'], {
    required_error: 'Seleccione un género'
  }),
  
  // Información del contrato
  vivienda_id: z.number().min(1, 'Seleccione una vivienda').optional(), // Se obtendrá del contexto
  fecha_inicio: z.string().min(1, 'Fecha de inicio es requerida'),
  fecha_fin: z.string().optional(),
  monto_alquiler: z.number().min(0, 'Monto de alquiler debe ser mayor a 0'),
  observaciones: z.string().optional(),
});

export function RegistroInquilinoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { registrarInquilino } = useInquilinos();

  const form = useForm<RegistroInquilinoData>({
    resolver: zodResolver(registroInquilinoSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      documento_identidad: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: undefined,
      vivienda_id: undefined,
      fecha_inicio: '',
      fecha_fin: '',
      monto_alquiler: 0,
      observaciones: '',
    },
  });

  const handleSubmit = async (data: RegistroInquilinoData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage('');

      await registrarInquilino(data);
      
      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      console.error('Error registrando inquilino:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Registro de Inquilino
        </CardTitle>
        <CardDescription>
          Complete el formulario para registrar un inquilino en una de sus propiedades.
          El inquilino será registrado directamente en el sistema.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Alertas de estado */}
        {submitStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Inquilino registrado exitosamente. Ya puede acceder al sistema.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || 'Error al registrar el inquilino. Intente nuevamente.'}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Información Personal */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Información Personal</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan Carlos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Pérez López" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="documento_identidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento de Identidad *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 12345678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Ej: juan@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 71234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_nacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="genero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>

            {/* Información del Contrato */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Home className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Información del Contrato</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vivienda_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de Vivienda *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Ej: 101"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="monto_alquiler"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto de Alquiler *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Ej: 1500"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_inicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Inicio *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fecha_fin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Fin</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Información adicional que considere relevante..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Información Importante */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Información Importante:</strong>
                <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                  <li>El inquilino será registrado directamente en el sistema</li>
                  <li>Se enviará un email de confirmación al inquilino</li>
                  <li>El inquilino podrá acceder a su panel inmediatamente</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Botón de envío */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  'Registrar Inquilino'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}