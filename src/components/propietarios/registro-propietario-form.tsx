'use client'

/**
 * Formulario de registro público para propietarios
 * Permite a nuevos propietarios solicitar su registro en el sistema
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Home, User, Key } from 'lucide-react';
import { usePropietarios } from '@/hooks/usePropietarios';
import type { SolicitudRegistroPropietario } from '@/features/propietarios/services';
import { FotoReconocimientoCapture } from '@/components/facial/foto-reconocimiento-capture';

export function RegistroPropietarioForm() {
  const { enviarSolicitudRegistro, loading, error } = usePropietarios();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<SolicitudRegistroPropietario>({
    nombres: '',
    apellidos: '',
    documento_identidad: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: 'masculino',
    direccion: '',
    numero_unidad: '',
    tipo_unidad: '',
    observaciones: '',
    // NUEVO: Reconocimiento facial
    fotos_base64: [],
    acepta_terminos: false,
    password: '',
    confirm_password: ''
  });

  const handleInputChange = (field: keyof SolicitudRegistroPropietario) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectChange = (field: keyof SolicitudRegistroPropietario) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFotosChange = (fotos: string[]) => {
    setFormData(prev => ({
      ...prev,
      fotos_base64: fotos
    }));
  };

  const handleTerminosChange = (acepta: boolean) => {
    setFormData(prev => ({
      ...prev,
      acepta_terminos: acepta
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones adicionales
    if (!formData.acepta_terminos) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    if ((formData.fotos_base64?.length || 0) < 1) {
      alert('Debes tomar al menos una foto para el reconocimiento facial');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    const resultado = await enviarSolicitudRegistro(formData);
    
    if (resultado) {
      setSuccess(true);
      // Limpiar formulario
      setFormData({
        nombres: '',
        apellidos: '',
        documento_identidad: '',
        email: '',
        telefono: '',
        fecha_nacimiento: '',
        genero: 'masculino',
        direccion: '',
        numero_unidad: '',
        tipo_unidad: '',
        observaciones: '',
        fotos_base64: [],
        acepta_terminos: false,
        password: '',
        confirm_password: ''
      });
    }
  };

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-700">
                ¡Solicitud Enviada Exitosamente!
              </h3>
              <p className="text-gray-600 mt-2">
                Tu solicitud de registro ha sido enviada al administrador. 
                Recibirás una notificación por email cuando sea revisada.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSuccess(false)}
            >
              Enviar otra solicitud
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-6 w-6" />
          Registro de Propietario
        </CardTitle>
        <CardDescription>
          Complete el formulario para solicitar su registro como propietario. 
          Su solicitud será revisada por el administrador.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Información Personal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <User className="h-5 w-5" />
              <h3 className="font-semibold">Información Personal</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange('nombres')}
                  placeholder="Ej: Juan Carlos"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange('apellidos')}
                  placeholder="Ej: Pérez López"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="documento_identidad">Documento de Identidad *</Label>
                <Input
                  id="documento_identidad"
                  value={formData.documento_identidad}
                  onChange={handleInputChange('documento_identidad')}
                  placeholder="Ej: 12345678"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="Ej: juan@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange('telefono')}
                  placeholder="Ej: 71234567"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange('fecha_nacimiento')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="genero">Género *</Label>
                <Select value={formData.genero} onValueChange={handleSelectChange('genero')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange('direccion')}
                  placeholder="Ej: Av. América #123, Zona Central"
                  required
                />
              </div>
            </div>
          </div>

          {/* Información de la Propiedad */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Home className="h-5 w-5" />
              <h3 className="font-semibold">Información de la Propiedad</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numero_unidad">Número de Unidad</Label>
                <Input
                  id="numero_unidad"
                  value={formData.numero_unidad}
                  onChange={handleInputChange('numero_unidad')}
                  placeholder="Ej: 101, A-15, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="tipo_unidad">Tipo de Unidad</Label>
                <Select value={formData.tipo_unidad} onValueChange={handleSelectChange('tipo_unidad')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                    <SelectItem value="local_comercial">Local Comercial</SelectItem>
                    <SelectItem value="estacionamiento">Estacionamiento</SelectItem>
                    <SelectItem value="deposito">Depósito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Reconocimiento Facial - NUEVA SECCIÓN */}
          <div className="space-y-4">
            <FotoReconocimientoCapture 
              onFotosChange={handleFotosChange}
              fotos={formData.fotos_base64 || []}
              maxFotos={3}
              requeridas={true}
            />
          </div>

          {/* Seguridad - NUEVA SECCIÓN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Key className="h-5 w-5" />
              <h3 className="font-semibold">Configuración de Seguridad</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirm_password">Confirmar Contraseña *</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  value={formData.confirm_password}
                  onChange={handleInputChange('confirm_password')}
                  placeholder="Repetir contraseña"
                  required
                />
              </div>
            </div>
          </div>

          {/* Términos y Condiciones - NUEVA SECCIÓN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <CheckCircle className="h-5 w-5" />
              <h3 className="font-semibold">Términos y Condiciones</h3>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 text-sm text-gray-700 max-h-32 overflow-y-auto">
                <p><strong>Reconocimiento Facial:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Autorizo el uso de mi imagen facial para fines de autenticación y seguridad</li>
                  <li>Las imágenes serán procesadas para generar patrones biométricos únicos</li>
                  <li>Los datos biométricos se almacenarán de forma segura y encriptada</li>
                  <li>Solo se utilizarán para acceso al sistema y control de seguridad del edificio</li>
                </ul>
                
                <p><strong>Protección de Datos:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Mis datos personales serán tratados conforme a la ley de protección de datos</li>
                  <li>Solo se compartirán con personal autorizado del edificio</li>
                  <li>Puedo solicitar la eliminación de mis datos en cualquier momento</li>
                </ul>
              </div>
              
              <div className="mt-4 flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="acepta_terminos"
                  checked={formData.acepta_terminos}
                  onChange={(e) => handleTerminosChange(e.target.checked)}
                  className="mt-0.5"
                  required
                />
                <Label htmlFor="acepta_terminos" className="text-sm">
                  Acepto los términos y condiciones, incluyendo el uso de reconocimiento facial *
                </Label>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange('observaciones')}
              placeholder="Información adicional que considere relevante..."
              rows={3}
            />
          </div>

          {/* Alerta de error */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Información adicional */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Información Importante:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Su solicitud será revisada por el administrador</li>
              <li>• Las fotos de reconocimiento facial son obligatorias</li>
              <li>• Sus imágenes se almacenarán de forma segura y encriptada</li>
              <li>• Recibirá una notificación por email sobre el estado de su solicitud</li>
              <li>• Una vez aprobada, podrá acceder con reconocimiento facial</li>
              <li>• Los campos marcados con (*) son obligatorios</li>
            </ul>
          </div>

          {/* Botón de envío */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando Solicitud...
              </>
            ) : (
              'Enviar Solicitud de Registro'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default RegistroPropietarioForm;