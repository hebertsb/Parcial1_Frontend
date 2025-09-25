/**
 * Componente para editar usuario de seguridad
 * Formulario modal para modificar información del usuario
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { 
  Edit3, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Loader2,
  Save,
  X
} from 'lucide-react';
import { useSeguridadUsuarios } from '@/src/features/admin/hooks/useSeguridadUsuarios';
import { useValidacionesSeguridadUsuarios } from '@/src/features/admin/hooks/useSeguridadUsuarios';
import type { UsuarioSeguridad } from '@/src/features/admin/services/seguridad';

interface EditarUsuarioSeguridadProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: number | null;
}

interface FormData {
  email: string;
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  direccion: string;
}

interface FormErrors {
  email?: string;
  nombre?: string;
  apellido?: string;
  ci?: string;
  telefono?: string;
}

export function EditarUsuarioSeguridad({ 
  isOpen, 
  onClose, 
  onSuccess,
  userId 
}: EditarUsuarioSeguridadProps) {
  const { verUsuario, editarUsuario } = useSeguridadUsuarios();
  const { validarEmail, validarCI, validarTelefono } = useValidacionesSeguridadUsuarios();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    nombre: '',
    apellido: '',
    ci: '',
    telefono: '',
    direccion: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && userId) {
      cargarUsuario();
    } else {
      // Resetear formulario cuando se cierra
      resetForm();
    }
  }, [isOpen, userId]);

  const cargarUsuario = async () => {
    if (!userId) return;
    
    try {
      setLoadingUsuario(true);
      setGeneralError(null);
      
      const usuario = await verUsuario(userId);
      
      if (usuario) {
        setFormData({
          email: usuario.email,
          nombre: usuario.persona.nombre,
          apellido: usuario.persona.apellido,
          ci: usuario.persona.ci,
          telefono: usuario.persona.telefono,
          direccion: usuario.persona.direccion || ''
        });
      } else {
        setGeneralError('No se pudo cargar la información del usuario');
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Error al cargar el usuario');
      console.error('Error cargando usuario para editar:', err);
    } finally {
      setLoadingUsuario(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      direccion: ''
    });
    setErrors({});
    setGeneralError(null);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo al empezar a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Limpiar error general
    if (generalError) {
      setGeneralError(null);
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: FormErrors = {};

    // Validar email
    const errorEmail = validarEmail(formData.email);
    if (errorEmail) nuevosErrores.email = errorEmail;

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    // Validar apellido
    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido es requerido';
    }

    // Validar CI
    const errorCI = validarCI(formData.ci);
    if (errorCI) nuevosErrores.ci = errorCI;

    // Validar teléfono
    const errorTelefono = validarTelefono(formData.telefono);
    if (errorTelefono) nuevosErrores.telefono = errorTelefono;

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async () => {
    if (!userId) return;
    
    if (!validarFormulario()) return;

    try {
      setLoading(true);
      setGeneralError(null);

      console.log('📝 EditarUsuarioSeguridad: Enviando datos...', formData);

      const success = await editarUsuario(userId, {
        email: formData.email,
        persona: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          ci: formData.ci,
          telefono: formData.telefono,
          direccion: formData.direccion.trim() || undefined
        }
      });

      if (success) {
        console.log('✅ EditarUsuarioSeguridad: Usuario editado exitosamente');
        onSuccess();
        onClose();
      } else {
        setGeneralError('Error al editar el usuario. Por favor, inténtalo de nuevo.');
      }
    } catch (err: any) {
      console.error('❌ EditarUsuarioSeguridad: Error:', err);
      setGeneralError(err.message || 'Error de conexión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-600" />
            Editar Usuario de Seguridad
          </DialogTitle>
        </DialogHeader>

        {loadingUsuario && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando información...</span>
          </div>
        )}

        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{generalError}</p>
          </div>
        )}

        {!loadingUsuario && (
          <div className="space-y-6">
            {/* Información de Cuenta */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Información de Cuenta
              </h3>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className={errors.email ? 'border-red-300' : ''}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Nombre"
                    className={errors.nombre ? 'border-red-300' : ''}
                  />
                  {errors.nombre && (
                    <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="apellido">Apellido *</Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleInputChange('apellido', e.target.value)}
                    placeholder="Apellido"
                    className={errors.apellido ? 'border-red-300' : ''}
                  />
                  {errors.apellido && (
                    <p className="text-red-600 text-sm mt-1">{errors.apellido}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ci" className="flex items-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    Cédula de Identidad *
                  </Label>
                  <Input
                    id="ci"
                    value={formData.ci}
                    onChange={(e) => handleInputChange('ci', e.target.value)}
                    placeholder="12345678"
                    className={errors.ci ? 'border-red-300' : ''}
                  />
                  {errors.ci && (
                    <p className="text-red-600 text-sm mt-1">{errors.ci}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefono" className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Teléfono *
                  </Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="70123456"
                    className={errors.telefono ? 'border-red-300' : ''}
                  />
                  {errors.telefono && (
                    <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="direccion" className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Dirección (Opcional)
                </Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  placeholder="Av. Principal #123"
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}