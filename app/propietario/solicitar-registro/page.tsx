/**
 * Página para que propietarios registren inquilinos
 * Solo accesible para usuarios autenticados con rol de propietario
 */

import { RegistroInquilinoForm } from '@/components/inquilinos/registro-inquilino-form';

export default function RegistrarInquilinoPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Registrar Nuevo Inquilino</h1>
          <p className="text-muted-foreground">
            Formulario unificado para registrar inquilinos con credenciales y foto para control de acceso.
            Usado por todos los propietarios del sistema.
          </p>
        </div>
        
        <RegistroInquilinoForm />
      </div>
    </div>
  );
}