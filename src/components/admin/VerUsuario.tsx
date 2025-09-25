'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { UsuarioSistema } from "@/core/types"
import { Eye, User, Mail, Phone, Calendar, MapPin, IdCard, Users } from "lucide-react"

interface VerUsuarioProps {
  usuarioId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerDetalle: (id: number) => Promise<UsuarioSistema | null>
}

export function VerUsuario({ 
  usuarioId, 
  open, 
  onOpenChange, 
  onVerDetalle 
}: VerUsuarioProps) {
  const [usuario, setUsuario] = useState<UsuarioSistema | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && usuarioId) {
      cargarUsuario()
    }
  }, [open, usuarioId])

  const cargarUsuario = async () => {
    if (!usuarioId) return
    
    setLoading(true)
    try {
      const data = await onVerDetalle(usuarioId)
      setUsuario(data)
    } catch (error) {
      console.error('Error cargando usuario:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return 'No especificada'
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'INACTIVO':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerColorRol = (rol: string) => {
    switch (rol?.toLowerCase()) {
      case 'propietario':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'inquilino': 
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'administrador':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Detalles del Usuario
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : usuario ? (
          <div className="space-y-6">
            {/* Información Principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Nombre Completo:</span>
                </div>
                <p className="text-gray-700 pl-6">
                  {usuario.persona?.nombre_completo || `${usuario.nombres} ${usuario.apellidos}`}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                </div>
                <p className="text-gray-700 pl-6">{usuario.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Documento:</span>
                </div>
                <p className="text-gray-700 pl-6">
                  {usuario.persona?.documento_identidad || 'No especificado'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Teléfono:</span>
                </div>
                <p className="text-gray-700 pl-6">
                  {usuario.telefono || usuario.persona?.telefono || 'No especificado'}
                </p>
              </div>
            </div>

            {/* Estado y Roles */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Estado:</span>
                <Badge className={obtenerColorEstado(usuario.estado)}>
                  {usuario.estado}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Roles:</span>
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {usuario.roles?.map((rol, index) => (
                    <Badge 
                      key={index} 
                      className={obtenerColorRol(rol.nombre)}
                    >
                      {rol.nombre}
                    </Badge>
                  )) || <span className="text-gray-500 text-sm">Sin roles asignados</span>}
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium text-lg">Información Personal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Fecha de Nacimiento:</span>
                  </div>
                  <p className="text-gray-700 pl-6">
                    {formatearFecha(usuario.fecha_nacimiento || usuario.persona?.fecha_nacimiento)}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-medium">Género:</span>
                  <p className="text-gray-700 pl-4">
                    {usuario.genero || usuario.persona?.genero || 'No especificado'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">País:</span>
                  </div>
                  <p className="text-gray-700 pl-6">
                    {usuario.persona?.pais || 'Bolivia'}
                  </p>
                </div>

                {usuario.persona?.direccion && (
                  <div className="space-y-2">
                    <span className="font-medium">Dirección:</span>
                    <p className="text-gray-700 pl-4">{usuario.persona.direccion}</p>
                  </div>
                )}

                {usuario.persona?.edad && (
                  <div className="space-y-2">
                    <span className="font-medium">Edad:</span>
                    <p className="text-gray-700 pl-4">{usuario.persona.edad} años</p>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium text-lg">Información del Sistema</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <span className="font-medium">ID del Usuario:</span>
                  <p className="text-gray-600">{usuario.id}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-medium">Fecha de Registro:</span>
                  <p className="text-gray-600">{formatearFecha(usuario.created_at)}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-medium">Última Actualización:</span>
                  <p className="text-gray-600">{formatearFecha(usuario.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No se pudieron cargar los datos del usuario</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}