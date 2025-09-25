'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Trash2, AlertTriangle, Loader2, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EliminarUsuarioProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEliminar: (id: number) => Promise<boolean>
  onObtener: (id: number) => Promise<any>
  usuarioId: number | null
}

export function EliminarUsuario({ 
  open, 
  onOpenChange, 
  onEliminar,
  onObtener,
  usuarioId
}: EliminarUsuarioProps) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    if (open && usuarioId) {
      cargarUsuario()
    } else {
      setUsuario(null)
      setError(null)
    }
  }, [open, usuarioId])

  const cargarUsuario = async () => {
    if (!usuarioId) return

    setLoading(true)
    setError(null)

    try {
      const usuarioData = await onObtener(usuarioId)
      
      if (usuarioData) {
        setUsuario(usuarioData)
      } else {
        setError('No se pudo cargar la información del usuario')
      }
    } catch (err) {
      console.error('Error cargando usuario:', err)
      setError('Error al cargar los datos del usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async () => {
    if (!usuarioId) {
      setError('ID de usuario no válido')
      return
    }

    setDeleting(true)
    setError(null)

    try {
      const success = await onEliminar(usuarioId)
      
      if (success) {
        onOpenChange(false)
      } else {
        setError('Error al eliminar usuario. Inténtalo nuevamente.')
      }
    } catch (err) {
      console.error('Error eliminando usuario:', err)
      setError('Error inesperado al eliminar usuario')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
  }

  const getNombreCompleto = () => {
    if (!usuario) return 'Usuario'
    
    if (usuario.persona?.nombre_completo) {
      return usuario.persona.nombre_completo
    }
    
    const nombre = usuario.persona?.nombre || usuario.nombres || ''
    const apellido = usuario.persona?.apellido || usuario.apellidos || ''
    
    return `${nombre} ${apellido}`.trim() || 'Usuario'
  }

  const getTipoPersona = () => {
    if (!usuario) return ''
    
    const tipo = usuario.persona?.tipo_persona || ''
    
    const tipoMap = {
      'administrador': 'Administrador',
      'propietario': 'Propietario',
      'inquilino': 'Inquilino',
      'seguridad': 'Seguridad'
    }
    
    return tipoMap[tipo] || tipo
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-[#0a0a0a] border-[#1f1f1f]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Eliminar Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Esta acción desactivará el usuario de forma lógica, preservando el historial
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-300">Cargando datos...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <Alert className="bg-red-950 border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Alert className="bg-red-950 border-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                <strong>¡Atención!</strong> Esta acción desactivará el usuario en el sistema.
                El usuario ya no podrá acceder pero sus datos se conservarán.
              </AlertDescription>
            </Alert>

            {usuario && (
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start gap-3">
                  <div className="bg-[#2a2a2a] p-2 rounded-full">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-lg">
                      {getNombreCompleto()}
                    </h3>
                    <div className="space-y-1 mt-2">
                      <p className="text-gray-400 text-sm">
                        <span className="font-medium">Email:</span> {usuario.email || 'N/A'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-medium">Tipo:</span> {getTipoPersona()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-medium">Documento:</span> {usuario.persona?.documento_identidad || usuario.documento_identidad || 'N/A'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-medium">Estado actual:</span> 
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${
                          usuario.activo 
                            ? 'bg-green-900 text-green-200' 
                            : 'bg-red-900 text-red-200'
                        }`}>
                          {usuario.activo ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-yellow-950 border border-yellow-800 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-200 text-sm font-medium">
                    Eliminación Lógica
                  </p>
                  <p className="text-yellow-300 text-sm mt-1">
                    El usuario será marcado como inactivo pero sus datos se mantendrán 
                    en el sistema para fines de auditoría e historial.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={deleting}
                className="bg-transparent border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEliminar}
                disabled={deleting || !usuario}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar Usuario
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}