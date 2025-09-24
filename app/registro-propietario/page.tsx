/**
 * Página pública para registro de propietarios
 * Los usuarios pueden solicitar su registro sin necesidad de estar logueados
 */

import { RegistroPropietarioForm } from '@/components/propietarios/registro-propietario-form';

export default function RegistroPropietarioPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Registro de Propietario
          </h1>
          <p className="text-lg text-gray-600">
            Solicite su registro como propietario en el sistema de gestión del condominio
          </p>
        </div>
        
        <RegistroPropietarioForm />
      </div>
    </div>
  );
}