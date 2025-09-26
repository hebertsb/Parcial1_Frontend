/**
 * Formulario Unificado para Registro de Inquilinos
 * Único formulario que usan todos los propietarios para registrar inquilinos
 * Incluye campos de credenciales y foto para control de acceso
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, User, Home, CheckCircle, AlertCircle, Key, RefreshCw, Camera, Upload, X, Image, Eye, EyeOff } from 'lucide-react';
import { useInquilinos } from '@/hooks/useInquilinos';

// Schema de validación unificado
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
  
  // Credenciales de acceso
  username: z.string()
    .email('Debe ser un correo electrónico válido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirm_password: z.string()
    .min(8, 'Confirmación de contraseña es requerida'),
  
  // Foto para control de acceso
  foto: z.any().optional(),
  
  // Información del contrato
  fecha_inicio: z.string().min(1, 'Fecha de inicio es requerida'),
  fecha_fin: z.string().optional(),
  monto_alquiler: z.string().min(1, 'Monto de alquiler es requerido').transform((val) => parseFloat(val)),
  observaciones: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

type RegistroInquilinoData = z.infer<typeof registroInquilinoSchema>;


interface RegistroInquilinoFormProps {
  viviendaId: number;
  onSuccess?: () => void;
}

export function RegistroInquilinoForm({ viviendaId, onSuccess }: RegistroInquilinoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string, password: string} | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  // Hook para registro de inquilinos
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
      username: '',
      password: '',
      confirm_password: '',
      foto: null,
      fecha_inicio: '',
      fecha_fin: '',
      monto_alquiler: 0,
      observaciones: '',
    },
  });

  // Sincronizar email con username automáticamente
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'email' && value.email) {
        form.setValue('username', value.email);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Funciones para manejar la foto
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFotoPreview(reader.result as string);
        form.setValue('foto', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFotoPreview(null);
    form.setValue('foto', null);
  };

  const handleTakePhoto = () => {
    // Por ahora redirige al selector de archivos con opción de cámara
    document.getElementById('foto-input')?.click();
  };

  const handleSubmit = async (data: RegistroInquilinoData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage('');

      // Usar email como username para login y recuperación de contraseña
      const username = data.email; // El email es el username para login
      const password = data.password || Math.random().toString(36).slice(-8);
      
      // Preparar datos para el servicio del hook
      const registroData = {
        nombre: data.nombre,
        apellido: data.apellido,
        documento_identidad: data.documento_identidad,
        email: data.email,
        telefono: data.telefono,
        fecha_nacimiento: data.fecha_nacimiento,
        genero: data.genero as 'M' | 'F',
        username,
        password,
        vivienda_id: viviendaId,
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || undefined,
        monto_alquiler: data.monto_alquiler,
        observaciones: data.observaciones || undefined,
      };

      console.log('📝 Registrando inquilino con formulario unificado:', registroData);
      
      // Usar el hook para registrar con la API real
      await registrarInquilino(registroData);
      
      setSubmitStatus('success');
      setGeneratedCredentials({ username, password });
      setFotoPreview(null);
      form.reset();
      
      // Llamar callback si existe
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error registrando inquilino:', error);
      console.error('Detalles completos del error:', error);
      setSubmitStatus('error');
      
      // Extraer mensaje específico del error de validación del backend
      let errorMsg = 'Error desconocido';
      
      if (error instanceof Error) {
        try {
          // Intentar extraer errores específicos del backend si están disponibles
          const errorData = (error as any).errors;
          console.log('Errores de validación del backend:', errorData);
          
          if (errorData) {
            if (errorData.documento_identidad) {
              errorMsg = `Documento de identidad: ${Array.isArray(errorData.documento_identidad) ? errorData.documento_identidad.join(', ') : errorData.documento_identidad}`;
            } else if (errorData.email) {
              errorMsg = `Email: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`;
            } else if (errorData.telefono) {
              errorMsg = `Teléfono: ${Array.isArray(errorData.telefono) ? errorData.telefono.join(', ') : errorData.telefono}`;
            } else {
              // Mostrar el primer error encontrado
              const firstError = Object.keys(errorData)[0];
              const firstErrorMsg = errorData[firstError];
              errorMsg = `${firstError}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg.join(', ') : firstErrorMsg}`;
            }
          } else {
            errorMsg = error.message;
          }
        } catch (parseError) {
          console.error('Error parseando errores del backend:', parseError);
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Registro de Inquilino
          </CardTitle>
          <CardDescription>
            Formulario unificado para registrar inquilinos. Incluye información personal, 
            credenciales de acceso y foto para control biométrico.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Alertas de estado */}
          {submitStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                ¡Inquilino registrado exitosamente! Se han generado las credenciales de acceso.
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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              
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
                          <Input placeholder="Ej: Ana Isabel" {...field} />
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
                          <Input placeholder="Ej: Mendoza" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="documento_identidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento de Identidad *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 99887766" {...field} />
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
                          <Input placeholder="Ej: ana.mendoza@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 591-73456789" {...field} />
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
                            <SelectItem value="M">Masculino</SelectItem>
                            <SelectItem value="F">Femenino</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Credenciales de Acceso */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Credenciales de Acceso</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico (Credencial de Acceso)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Se sincroniza automáticamente con el correo ingresado arriba"
                            {...field}
                            readOnly
                            className="bg-gray-50"
                          />
                        </FormControl>
                        <FormDescription>
                          El inquilino usará su correo electrónico para iniciar sesión y recuperar su contraseña. Se sincroniza automáticamente.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input 
                                type={showFormPassword ? "text" : "password"}
                                placeholder="Contraseña temporal"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFormPassword(!showFormPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-500 hover:text-gray-700"
                              >
                                {showFormPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const tempPassword = Math.random().toString(36).slice(-8);
                                form.setValue('password', tempPassword);
                                form.setValue('confirm_password', tempPassword);
                              }}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Contraseña temporal que el inquilino puede cambiar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirmar contraseña"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-500 hover:text-gray-700"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Debe coincidir con la contraseña anterior
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Key className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Tip:</strong> Use los botones de regenerar (🔄) para sincronizar el correo electrónico y generar automáticamente una contraseña.
                    El inquilino podrá cambiar estos datos después del primer acceso.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Foto para Control de Acceso */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Foto para Control de Acceso</h3>
                </div>

                <FormField
                  control={form.control}
                  name="foto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto del Inquilino</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {/* Vista previa de la foto */}
                          {fotoPreview ? (
                            <div className="relative inline-block">
                              <img
                                src={fotoPreview}
                                alt="Vista previa"
                                className="w-32 h-32 object-cover rounded-lg border-2 border-dashed border-gray-300"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={handleRemovePhoto}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                              <div className="text-center">
                                <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-xs text-gray-500">Sin foto</p>
                              </div>
                            </div>
                          )}

                          {/* Botones para agregar foto */}
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('foto-input')?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Subir Archivo
                            </Button>
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleTakePhoto}
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              Tomar Foto
                            </Button>

                            {fotoPreview && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemovePhoto}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Quitar
                              </Button>
                            )}
                          </div>

                          {/* Input oculto para archivos */}
                          <input
                            id="foto-input"
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        📸 Esta foto se usará para el sistema de control de acceso. 
                        Puede tomar una foto nueva o subir una desde sus archivos.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert className="bg-orange-50 border-orange-200">
                  <Camera className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Funcionalidad Futura:</strong> Este campo de foto está preparado para integrarse 
                    con el sistema de control de acceso biométrico cuando esté implementado.
                  </AlertDescription>
                </Alert>
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
                    name="fecha_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Inicio *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>Fecha de Fin (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                            step="0.01"
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
                          placeholder="Información adicional sobre el contrato..."
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
                    <li>Se generarán credenciales de acceso automáticamente</li>
                    <li>La foto será almacenada para el sistema de control de acceso</li>
                    <li>Se enviará un email de confirmación al inquilino</li>
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

      {/* Modal de Credenciales Generadas */}
      <Dialog 
        open={!!generatedCredentials} 
        onOpenChange={(open) => !open && setGeneratedCredentials(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🎉 ¡Inquilino Registrado Exitosamente!
            </DialogTitle>
            <DialogDescription>
              Se han generado las siguientes credenciales de acceso para el inquilino
            </DialogDescription>
          </DialogHeader>
          
          {generatedCredentials && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="space-y-3">
                  <div>
                    <p className="font-medium text-green-800">Credenciales de Acceso:</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded border space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Correo Electrónico (para iniciar sesión y recuperar contraseña):
                      </p>
                      <div className="font-mono text-sm font-medium bg-gray-50 p-2 rounded">
                        {generatedCredentials.username}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Contraseña Temporal:</p>
                      <div className="font-mono text-sm font-medium bg-gray-50 p-2 rounded flex items-center justify-between">
                        <span>{showPassword ? generatedCredentials.password : '••••••••••••'}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="h-auto p-1 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <p>⚠️ <strong>Importante:</strong> Asegúrate de copiar estas credenciales y entregarlas al inquilino de forma segura.</p>
                    <p>💡 El inquilino debe usar su correo electrónico para iniciar sesión y podrá cambiar su contraseña después del primer acceso.</p>
                    <p>🔄 Para recuperar su contraseña, usará el mismo correo electrónico.</p>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Correo electrónico (para iniciar sesión): ${generatedCredentials.username}\nContraseña temporal: ${generatedCredentials.password}`
                    );
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  📋 Copiar Credenciales
                </Button>
                
                <Button
                  onClick={() => setGeneratedCredentials(null)}
                  className="flex-1"
                >
                  ✅ Entendido
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}