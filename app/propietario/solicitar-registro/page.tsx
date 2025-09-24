/**
 * Página para que propietarios registren inquilinos
 * Solo accesible para usuarios autenticados con rol de propietario
 */

import { RegistroInquilinoFormActualizado } from '@/components/inquilinos/registro-inquilino-form-actualizado';

export default function RegistrarInquilinoPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Registrar Nuevo Inquilino</h1>
          <p className="text-muted-foreground">
            Complete el formulario para registrar un inquilino en una de sus propiedades.
            El inquilino será registrado directamente en el sistema.
          </p>
        </div>
        
        <RegistroInquilinoFormActualizado />
      </div>
    </div>
  );
}