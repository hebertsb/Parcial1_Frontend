/**
 * Página para que propietarios gestionen sus inquilinos
 * Solo accesible para usuarios con rol de propietario
 */

import { GestionInquilinos } from '@/components/inquilinos/gestion-inquilinos';

export default function MisInquilinosPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-7xl mx-auto">
        <GestionInquilinos />
      </div>
    </div>
  );
}