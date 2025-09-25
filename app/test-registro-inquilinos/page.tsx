'use client'

/**
 * Página de prueba para verificar el formulario de registro de inquilinos
 * Específicamente para verificar que los campos de credenciales aparezcan
 */

import { RegistroInquilinoForm } from '@/components/inquilinos/registro-inquilino-form';

export default function TestRegistroInquilinosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Prueba: Registro de Inquilinos
          </h1>
          <p className="text-gray-600">
            Verificando que aparezcan los campos de credenciales en el formulario
          </p>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Instrucciones:</strong>
            </p>
            <ol className="text-xs text-yellow-700 mt-2 list-decimal list-inside space-y-1">
              <li>Selecciona una unidad</li>
              <li>Haz clic en "Agregar Inquilino"</li>
              <li>Verifica que aparezcan los campos "Usuario (Para Login)" y "Contraseña (Para Login)"</li>
              <li>Prueba el botón 🎲 para generar contraseña automática</li>
            </ol>
          </div>
        </div>
        
        <RegistroInquilinoForm />
      </div>
    </div>
  );
}