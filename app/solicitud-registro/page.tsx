/**
 * Página pública para solicitud de registro de propietarios
 * No requiere autenticación - cualquier persona puede solicitar registro
 */

import { SolicitudRegistroPropietarioFormActualizada } from '@/components/propietarios/solicitud-registro-form-actualizada';

export default function SolicitudRegistroPublicaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
              Solicitud de Registro
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Solicita tu registro como copropietario
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Complete el formulario para solicitar su registro como copropietario. 
              Su solicitud será revisada por el administrador y recibirá una respuesta por email.
            </p>
          </div>
          
          <SolicitudRegistroPropietarioFormActualizada />
        </div>
      </div>
    </div>
  );
}