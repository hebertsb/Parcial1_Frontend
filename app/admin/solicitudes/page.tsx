/**
 * Página de gestión de solicitudes de registro
 * Solo accesible para administradores
 */

import { GestionSolicitudesRegistro } from '@/components/admin/gestion-solicitudes-registro';

export default function SolicitudesRegistroPage() {
  return (
    <div className="container mx-auto p-6">
      <GestionSolicitudesRegistro />
    </div>
  );
}