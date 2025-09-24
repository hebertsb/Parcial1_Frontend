"use client"

import { GestionSolicitudesRegistro } from "@/components/admin/gestion-solicitudes-registro"

export default function SolicitudesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Solicitudes de Registro</h1>
      <GestionSolicitudesRegistro />
    </div>
  )
}