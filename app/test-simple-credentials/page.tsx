'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SimpleInquilinoForm {
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  password: string;
}

export default function TestSimpleCredentialsPage() {
  const [formData, setFormData] = useState<SimpleInquilinoForm>({
    nombres: '',
    apellidos: '', 
    email: '',
    username: '',
    password: ''
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  const handleInputChange = (field: keyof SimpleInquilinoForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Prueba Simple: Campos de Credenciales</CardTitle>
            <CardDescription>
              Formulario básico para verificar que los campos de credenciales funcionan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange('nombres')}
                  placeholder="Ingresa nombres"
                />
              </div>
              
              <div>
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange('apellidos')}
                  placeholder="Ingresa apellidos"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="email@ejemplo.com"
                />
              </div>

              {/* Separador para Credenciales */}
              <div className="col-span-2">
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm text-blue-700 mb-3 flex items-center gap-2">
                    🔐 Credenciales de Acceso al Sistema
                  </h4>
                </div>
              </div>
              
              <div>
                <Label htmlFor="username">Usuario (Para Login) *</Label>
                <Input
                  id="username"
                  value={formData.username || formData.email}
                  onChange={handleInputChange('username')}
                  placeholder="Deja vacío para usar el email"
                />
                <p className="text-xs text-gray-500 mt-1">🔐 Por defecto se usa el email como usuario</p>
              </div>
              
              <div>
                <Label htmlFor="password">Contraseña (Para Login) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Se generará automáticamente si está vacío"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generatePassword}
                    className="px-3"
                    title="Generar contraseña automática"
                  >
                    🎲
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">🔐 Mínimo 8 caracteres</p>
              </div>

              <div className="col-span-2">
                <Button type="button" className="w-full">
                  ✅ Probar Formulario
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-800 mb-2">Estado del Formulario:</h5>
              <pre className="text-xs text-blue-700 bg-white p-2 rounded">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}