/**
 * Página de administración de solicitudes de propietarios
 * Solo accesible para administradores
 */

import { SolicitudesAdminPanel } from '@/components/propietarios/solicitudes-admin-panel';

export default function SolicitudesPropietariosPage() {
  return (
    <div className="container mx-auto py-6">
      <SolicitudesAdminPanel />
    </div>
  );
}