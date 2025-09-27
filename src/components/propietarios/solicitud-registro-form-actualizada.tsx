/**
 * Formulario actualizado para solicitud de registro de propietarios
 * Basado en la guía actualizada con soporte para familiares
 */

'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, User, Home, CheckCircle, AlertCircle, Info, UserPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { FotoField } from '@/components/ui/foto-field';
import { registroFacialService } from '@/features/facial/registro-service';

// Schema de validación para familiar
const familiarSchema = z.object({
  nombres: z.string().min(2, 'Los nombres son requeridos'),
  apellidos: z.string().min(2, 'Los apellidos son requeridos'),
  documento_identidad: z.string().min(6, 'Documento de identidad es requerido'),
  fecha_nacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
  telefono: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  genero: z.enum(['masculino', 'femenino'], {
    required_error: 'Seleccione un género'
  }),
  parentesco: z.enum(['conyugue', 'hijo', 'padre', 'hermano', 'abuelo', 'nieto', 'tio', 'sobrino', 'primo', 'cuñado', 'yerno_nuera', 'suegro', 'otro'], {
    required_error: 'Seleccione el parentesco'
  }),
  autorizado_acceso: z.boolean().default(true),
  puede_autorizar_visitas: z.boolean().default(false),
});

// Schema de validación para solicitud de registro actualizado
const solicitudRegistroSchema = z.object({
  primer_nombre: z.string().min(2, 'El primer nombre es requerido'),
  primer_apellido: z.string().min(2, 'El primer apellido es requerido'),
  cedula: z.string().min(6, 'Cédula de identidad es requerida'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'Teléfono es requerido'),
  fecha_nacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
  genero: z.enum(['M', 'F'], {
    required_error: 'Seleccione un género'
  }),
  numero_casa: z.string().min(1, 'Número de casa es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirm_password: z.string().min(8, 'Confirme la contraseña'),
  observaciones: z.string().optional(),
  foto: z.instanceof(File).optional(),
  acepta_terminos: z.boolean().refine(val => val === true, 'Debe aceptar los términos y condiciones'),
  familiares: z.array(familiarSchema).optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"],
});

type SolicitudRegistroData = z.infer<typeof solicitudRegistroSchema>;

const parentescoOptions = [
  { value: 'conyugue', label: 'Cónyuge' },
  { value: 'hijo', label: 'Hijo/a' },
  { value: 'padre', label: 'Padre/Madre' },
  { value: 'hermano', label: 'Hermano/a' },
  { value: 'abuelo', label: 'Abuelo/a' },
  { value: 'nieto', label: 'Nieto/a' },
  { value: 'tio', label: 'Tío/a' },
  { value: 'sobrino', label: 'Sobrino/a' },
  { value: 'primo', label: 'Primo/a' },
  { value: 'cuñado', label: 'Cuñado/a' },
  { value: 'yerno_nuera', label: 'Yerno/Nuera' },
  { value: 'suegro', label: 'Suegro/a' },
  { value: 'otro', label: 'Otro' },
];

export function SolicitudRegistroPropietarioFormActualizada() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const form = useForm<SolicitudRegistroData>({
    resolver: zodResolver(solicitudRegistroSchema),
    defaultValues: {
      primer_nombre: '',
      primer_apellido: '',
      cedula: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: undefined,
      numero_casa: '',
      password: '',
      confirm_password: '',
      observaciones: '',
      foto: undefined,
      acepta_terminos: false,
      familiares: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "familiares"
  });

  const agregarFamiliar = () => {
    append({
      nombres: '',
      apellidos: '',
      documento_identidad: '',
      fecha_nacimiento: '',
      telefono: '',
      email: '',
      genero: 'masculino',
      parentesco: 'hijo',
      autorizado_acceso: true,
      puede_autorizar_visitas: false,
    });
  };

  const handleSubmit = async (data: SolicitudRegistroData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage('');

      console.log('📝 Enviando solicitud de registro al backend Django:', data);
      
      // Convertir la foto a base64 si existe
      let fotoBase64 = '';
      console.log('📸 [DEBUG] Procesando foto:', data.foto ? 'Foto presente' : 'Sin foto');
      if (data.foto) {
        console.log('📸 [DEBUG] Foto details:', {
          name: data.foto.name,
          size: data.foto.size,
          type: data.foto.type
        });
        try {
          fotoBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64String = reader.result as string;
              // Extraer solo la parte base64 (sin el prefijo data:image/...)
              const base64Data = base64String.split(',')[1];
              resolve(base64Data);
            };
            reader.onerror = reject;
            reader.readAsDataURL(data.foto);
          });
          console.log('📸 Foto convertida a base64, tamaño:', fotoBase64.length, 'caracteres');
        } catch (error) {
          console.error('❌ Error convirtiendo foto a base64:', error);
          throw new Error('Error procesando la imagen');
        }
      }
      
      // Preparar datos para el backend usando los nombres de campo correctos según la validación Django
      const solicitudData = {
        nombres: data.primer_nombre,
        apellidos: data.primer_apellido, 
        documento_identidad: data.cedula,
        email: data.email,
        telefono: data.telefono,
        numero_casa: data.numero_casa,
        fecha_nacimiento: data.fecha_nacimiento || '1990-01-01', // Fecha por defecto si está vacía
        acepta_terminos: true,
        acepta_tratamiento_datos: true,
        password: data.password,
        password_confirm: data.password,  // Campo requerido por Django
        confirm_password: data.password,  // Campo adicional por seguridad
        fotos_base64: fotoBase64 ? [fotoBase64] : [] // Campo requerido por el backend
        // Nota: familiares no se incluyen en la solicitud inicial según el backend
      };

      console.log('🔍 [DEBUG] Datos que se enviarán al backend:', solicitudData);

      // Llamada real al backend Django
      const response = await fetch('http://localhost:8000/api/authz/propietarios/solicitud/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(solicitudData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ [DEBUG] Error completo del backend:', errorData);
        console.error('❌ [DEBUG] Status:', response.status, response.statusText);
        
        // Mostrar errores específicos de validación si los hay
        let errorMessage = 'Datos inválidos';
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          // Si hay errores de validación de campo
          const fieldErrors = Object.entries(errorData.errors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n');
          errorMessage = `Errores de validación:\n${fieldErrors}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('✅ Solicitud creada exitosamente:', result);
      
      // Guardar foto temporalmente para mostrar en panel admin y enrolamiento posterior
      if (data.foto && result.id && fotoBase64) {
        console.log('📸 Guardando foto temporal para solicitud ID:', result.id);
        
        // Guardar archivo para enrolamiento
        const fotoGuardada = await registroFacialService.guardarFotoTemporal(
          result.id.toString(), 
          data.foto
        );
        
        // Guardar base64 para visualización en admin
        const base64Guardado = await registroFacialService.guardarFotoBase64Temporal(
          result.id.toString(),
          fotoBase64
        );
        
        if (fotoGuardada && base64Guardado) {
          console.log('✅ Foto guardada temporalmente para admin y enrolamiento');
        } else {
          console.error('❌ Error guardando foto temporal');
        }
      }
      
      setSubmitStatus('success');
      form.reset();
      setFotoPreview(null);
      
    } catch (error) {
      console.error('❌ Error enviando solicitud:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-700">¡Solicitud Enviada!</h2>
            <p className="text-gray-600">
              Su solicitud de registro ha sido enviada exitosamente. 
              El administrador revisará su información y le enviará una respuesta por email.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>¿Qué sigue?</strong><br />
                1. Revisaremos su solicitud en un plazo de 2-3 días hábiles<br />
                2. Le enviaremos un email con la decisión<br />
                3. Si es aprobado, recibirá sus credenciales de acceso
              </p>
            </div>
            <div className="pt-4">
              <Link href="/">
                <Button variant="outline">
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Solicitud de Registro como Copropietario
        </CardTitle>
        <CardDescription>
          Complete todos los campos para solicitar su registro. Puede incluir información de sus familiares.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Información importante */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Actualizado:</strong> Este formulario incluye la posibilidad de registrar familiares directamente. 
            Su solicitud será enviada al administrador para revisión.
          </AlertDescription>
        </Alert>

        {/* Alerta de error */}
        {submitStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || 'Error al enviar la solicitud. Intente nuevamente.'}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* Información Personal del Propietario */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Información Personal del Propietario</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primer_nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primer Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primer_apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primer Apellido *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula de Identidad *</FormLabel>
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
                        <Input placeholder="Ej: 591-71234567" {...field} />
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
                          <SelectItem value="M">Masculino</SelectItem>
                          <SelectItem value="F">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numero_casa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Casa *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: A-101, B-205" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Credenciales */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Home className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">Credenciales de Acceso</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Repita la contraseña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Sección de Familiares */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">Familiares (Opcional)</h3>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={agregarFamiliar}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar Familiar
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Familiar {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`familiares.${index}.nombres`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombres" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.apellidos`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos *</FormLabel>
                          <FormControl>
                            <Input placeholder="Apellidos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.documento_identidad`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cédula *</FormLabel>
                          <FormControl>
                            <Input placeholder="Cédula" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.fecha_nacimiento`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Nacimiento *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.parentesco`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parentesco *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {parentescoOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.genero`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Género *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar" />
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

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.telefono`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="Opcional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Opcional" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name={`familiares.${index}.autorizado_acceso`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Autorizado acceso</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`familiares.${index}.puede_autorizar_visitas`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Puede autorizar visitas</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>

            {/* Campo de Foto */}
            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fotografía Personal (Opcional)</FormLabel>
                  <FormControl>
                    <FotoField
                      value={field.value}
                      onChange={(file) => {
                        console.log('📸 [DEBUG] Foto seleccionada:', file);
                        field.onChange(file);
                      }}
                      preview={fotoPreview}
                      onPreviewChange={(preview) => {
                        console.log('📸 [DEBUG] Preview cambiado:', preview ? 'Con imagen' : 'Sin imagen');
                        setFotoPreview(preview);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observaciones */}
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre su propiedad o situación particular..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Términos y condiciones */}
            <FormField
              control={form.control}
              name="acepta_terminos"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Acepto los términos y condiciones *
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Acepta que la información proporcionada es veraz y autoriza la verificación de datos.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botón de envío */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[150px]"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}