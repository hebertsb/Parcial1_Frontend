/**
 * Formulario para crear usuarios de seguridad
 * Siguiendo el estilo de los demás formularios del sistema
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CreditCard, 
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import { useSeguridadUsuarios, useValidacionesSeguridadUsuarios } from '@/features/admin/hooks/useSeguridadUsuarios';
import type { CrearUsuarioSeguridadRequest } from '@/features/admin/services/seguridad';

interface CrearUsuarioSeguridadProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CrearUsuarioSeguridad({ onSuccess, onCancel }: CrearUsuarioSeguridadProps) {
  const { crearUsuario } = useSeguridadUsuarios();
  const { validarFormulario } = useValidacionesSeguridadUsuarios();

  const [formData, setFormData] = useState<CrearUsuarioSeguridadRequest>({
    email: '',
    password: '',
    persona: {
      nombre: '',
      apellido: '',
      ci: '',
      telefono: '',
      direccion: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Manejar cambios en campos del formulario
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('persona.')) {
      const personaField = field.replace('persona.', '');
      setFormData(prev => ({
        ...prev,
        persona: {
          ...prev.persona,
          [personaField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validationErrors = validarFormulario(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setGeneralError(null);
    setErrors({});

    try {
      console.log('📝 CrearUsuarioSeguridad: Enviando datos...', formData);
      
      const exito = await crearUsuario(formData);
      
      if (exito) {
        setSuccess(true);
        console.log('✅ CrearUsuarioSeguridad: Usuario creado exitosamente');
        
        // Mostrar mensaje de éxito por 2 segundos
        setTimeout(() => {
          setSuccess(false);
          // Limpiar formulario
          setFormData({
            email: '',
            password: '',
            persona: {
              nombre: '',
              apellido: '',
              ci: '',
              telefono: '',
              direccion: ''
            }
          });
          
          if (onSuccess) {
            onSuccess();
          }
        }, 2000);
      } else {
        setGeneralError('Error al crear el usuario de seguridad. Por favor intente nuevamente.');
      }
    } catch (error) {
      console.error('❌ CrearUsuarioSeguridad: Error inesperado:', error);
      setGeneralError('Error de conexión. Verifique que el backend esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  // Generar contraseña temporal
  const generarPasswordTemporal = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    password += '123'; // Agregar números para cumplir requisitos
    
    setFormData(prev => ({
      ...prev,
      password: password
    }));
  };

  // Si el usuario fue creado exitosamente
  if (success) {
    return (
      <Card className="bg-[#111111] border-[#1f1f1f]">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">¡Usuario Creado Exitosamente!</h3>
              <p className="text-gray-400 mt-2">
                El usuario de seguridad ha sido creado y puede iniciar sesión inmediatamente.
              </p>
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">
                  <strong>Email:</strong> {formData.email}<br />
                  <strong>Contraseña Temporal:</strong> {formData.password}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Comparta estas credenciales de forma segura con el personal de seguridad.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#111111] border-[#1f1f1f]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <UserPlus className="w-5 h-5 text-blue-400" />
          <span>Crear Usuario de Seguridad</span>
        </CardTitle>
        <p className="text-gray-400 text-sm">
          Complete los datos para crear una nueva cuenta de personal de seguridad
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error general */}
          {generalError && (
            <Alert className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <AlertDescription className="text-red-200">
                {generalError}
              </AlertDescription>
            </Alert>
          )}

          {/* Credenciales de acceso */}
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Credenciales de Acceso</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario.seguridad@condominio.com"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Contraseña Temporal *
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="password"
                    type="text"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Contraseña temporal"
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generarPasswordTemporal}
                    className="border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]"
                    disabled={loading}
                  >
                    Generar
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Datos personales */}
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Datos Personales</span>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-gray-300">
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.persona.nombre}
                  onChange={(e) => handleInputChange('persona.nombre', e.target.value)}
                  placeholder="Nombre del empleado"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  disabled={loading}
                />
                {errors.nombre && (
                  <p className="text-red-400 text-sm">{errors.nombre}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-gray-300">
                  Apellido *
                </Label>
                <Input
                  id="apellido"
                  type="text"
                  value={formData.persona.apellido}
                  onChange={(e) => handleInputChange('persona.apellido', e.target.value)}
                  placeholder="Apellido del empleado"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  disabled={loading}
                />
                {errors.apellido && (
                  <p className="text-red-400 text-sm">{errors.apellido}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ci" className="text-gray-300">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  Cédula de Identidad *
                </Label>
                <Input
                  id="ci"
                  type="text"
                  value={formData.persona.ci}
                  onChange={(e) => handleInputChange('persona.ci', e.target.value)}
                  placeholder="12345678"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  disabled={loading}
                />
                {errors.ci && (
                  <p className="text-red-400 text-sm">{errors.ci}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-gray-300">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono *
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.persona.telefono}
                  onChange={(e) => handleInputChange('persona.telefono', e.target.value)}
                  placeholder="70123456"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  disabled={loading}
                />
                {errors.telefono && (
                  <p className="text-red-400 text-sm">{errors.telefono}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-gray-300">
                <MapPin className="w-4 h-4 inline mr-1" />
                Dirección (Opcional)
              </Label>
              <Textarea
                id="direccion"
                value={formData.persona.direccion}
                onChange={(e) => handleInputChange('persona.direccion', e.target.value)}
                placeholder="Dirección del empleado"
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                rows={2}
                disabled={loading}
              />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]"
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}