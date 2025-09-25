'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { UsuarioSistema } from "@/core/types"
import { Trash2, AlertTriangle, User, Mail, IdCard } from "lucide-react"

interface EliminarUsuarioProps {
  usuarioId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerDetalle: (id: number) => Promise<UsuarioSistema | null>
  onEliminar: (id: number) => Promise<boolean>
}

export function EliminarUsuario({ 
  usuarioId, 
  open, 
  onOpenChange, 
  onVerDetalle,
  onEliminar
}: EliminarUsuarioProps) {
  const [usuario, setUsuario] = useState<UsuarioSistema | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (open && usuarioId) {
      cargarUsuario()
    } else if (!open) {
      setUsuario(null)
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

  const handleEliminar = async () => {
    if (!usuarioId) return

    setDeleting(true)
    try {
      const success = await onEliminar(usuarioId)
      
      if (success) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error)
    } finally {
      setDeleting(false)
    }
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Eliminar Usuario
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : usuario ? (
          <div className="space-y-6">
            {/* Advertencia */}
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-red-800">
                  ¿Estás seguro de que deseas eliminar este usuario?
                </p>
                <p className="text-sm text-red-600">
                  Esta acción desactivará el usuario en el sistema. Esta operación puede ser reversible cambiando el estado del usuario.
                </p>
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium">Información del Usuario a Eliminar:</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Nombre:</span>
                  <span className="text-gray-700">
                    {usuario.persona?.nombre_completo || `${usuario.nombres} ${usuario.apellidos}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span className="text-gray-700">{usuario.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <IdCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Documento:</span>
                  <span className="text-gray-700">
                    {usuario.persona?.documento_identidad || 'No especificado'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-medium">Estado:</span>
                  <Badge className={obtenerColorEstado(usuario.estado)}>
                    {usuario.estado}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <span className="font-medium">Roles:</span>
                  <div className="flex flex-wrap gap-2">
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
            </div>

            {/* Información Adicional */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-800 mb-1">Nota:</p>
              <p>El usuario será desactivado pero mantendrá su información en el sistema. Puedes reactivarlo posteriormente cambiando su estado a "Activo".</p>
            </div>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={handleEliminar}
                disabled={deleting}
                className="min-w-[100px]"
              >
                {deleting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Eliminando...
                  </div>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
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