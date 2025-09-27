/**
 * Página de cambio de contraseña del administrador
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Save,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CambiarPasswordAdmin() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors([]);
    setSuccess(false);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Validaciones
      const validationErrors: string[] = [];

      if (!formData.currentPassword) {
        validationErrors.push('Debes ingresar tu contraseña actual');
      }

      if (!formData.newPassword) {
        validationErrors.push('Debes ingresar la nueva contraseña');
      } else {
        const passwordErrors = validatePassword(formData.newPassword);
        validationErrors.push(...passwordErrors);
      }

      if (formData.newPassword !== formData.confirmPassword) {
        validationErrors.push('Las contraseñas no coinciden');
      }

      if (formData.currentPassword === formData.newPassword) {
        validationErrors.push('La nueva contraseña debe ser diferente a la actual');
      }

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      // Simular cambio de contraseña (aquí integrarías con tu API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        router.push('/admin/perfil');
      }, 2000);

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setErrors(['Error al cambiar la contraseña. Inténtalo de nuevo.']);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'Débil', color: 'bg-red-500', width: '33%' };
    if (strength <= 3) return { level: 'Media', color: 'bg-yellow-500', width: '66%' };
    return { level: 'Fuerte', color: 'bg-green-500', width: '100%' };
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/perfil">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Cambiar Contraseña</h1>
            <p className="text-gray-400">
              Actualiza tu contraseña de administrador
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Alertas */}
        {success && (
          <Alert className="mb-6 bg-green-900/20 border-green-500 text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              ¡Contraseña cambiada exitosamente! Redirigiendo...
            </AlertDescription>
          </Alert>
        )}

        {errors.length > 0 && (
          <Alert className="mb-6 bg-red-900/20 border-red-500 text-red-300">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
        <Card className="bg-[#111111] border-[#2a2a2a]">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Key className="mr-2 h-5 w-5" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription className="text-gray-400">
              Ingresa tu contraseña actual y la nueva contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contraseña Actual */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-gray-300">
                  Contraseña Actual
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white pr-10"
                    placeholder="Tu contraseña actual"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-gray-300">
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white pr-10"
                    placeholder="Tu nueva contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {/* Indicador de Fuerza */}
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Fuerza de la contraseña</span>
                      <span className={`font-medium ${
                        passwordStrength.level === 'Fuerte' ? 'text-green-400' :
                        passwordStrength.level === 'Media' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {passwordStrength.level}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: passwordStrength.width }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white pr-10"
                    placeholder="Confirma tu nueva contraseña"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Requisitos de Contraseña */}
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                <h4 className="text-sm font-medium text-white mb-2 flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-blue-400" />
                  Requisitos de Contraseña
                </h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Al menos 8 caracteres</li>
                  <li>• Una letra mayúscula y una minúscula</li>
                  <li>• Al menos un número</li>
                  <li>• Al menos un carácter especial (!@#$%^&*)</li>
                </ul>
              </div>

              {/* Botones */}
              <div className="flex space-x-4 pt-4">
                <Button variant="outline" type="button" className="flex-1" asChild>
                  <Link href="/admin/perfil">
                    Cancelar
                  </Link>
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}