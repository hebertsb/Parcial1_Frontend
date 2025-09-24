/**
 * Página para que propietarios gestionen sus inquilinos
 * Solo accesible para usuarios con rol de propietario
 */

import { RegistroInquilinosForm } from '@/components/propietarios/registro-inquilinos-form';

export default function MisInquilinosPage() {
  return (
    <div className="container mx-auto py-6">
      <RegistroInquilinosForm />
    </div>
  );
}