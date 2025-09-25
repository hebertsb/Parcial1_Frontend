'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { User, Mail, Phone, IdCard, Calendar, Shield, Building, Loader2, Eye, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

interface VerUsuarioProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onObtener: (id: number) => Promise<any>
  onEditar?: (id: number) => void
  onEliminar?: (id: number) => void
  usuarioId: number | null
}

export function VerUsuario({ 
  open, 
  onOpenChange, 
  onObtener,
  onEditar,
  onEliminar,
  usuarioId
}: VerUsuarioProps) {
  const [loading, setLoading] = useState(false)
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

  const getColorTipo = (tipo: string) => {
    switch (tipo?.toLowerCase()) {
      case 'administrador':
        return 'bg-orange-600 text-white'
      case 'propietario':
        return 'bg-blue-600 text-white'
      case 'inquilino':
        return 'bg-purple-600 text-white'
      case 'seguridad':
        return 'bg-green-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getColorEstado = (activo: boolean) => {
    return activo 
      ? 'bg-green-600 text-white'
      : 'bg-red-600 text-white'
  }

  const formatFecha = (fecha: string) => {
    if (!fecha) return 'N/A'
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getInitials = () => {
    const nombre = getNombreCompleto()
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'US'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a] border-[#1f1f1f] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Detalles del Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Información completa del usuario seleccionado
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-300">Cargando información del usuario...</span>
          </div>
        ) : error ? (
          <Alert className="bg-red-950 border-red-800">
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        ) : usuario ? (
          <div className="space-y-6">
            {/* Header con avatar y nombre */}
            <div className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <Avatar className="w-16 h-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-[#2a2a2a] text-white text-lg font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {getNombreCompleto()}
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={getColorTipo(usuario.persona?.tipo_persona)}>
                    {getTipoPersona()}
                  </Badge>
                  <Badge className={getColorEstado(usuario.activo)}>
                    {usuario.activo ? 'ACTIVO' : 'INACTIVO'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Registrado: {formatFecha(usuario.persona?.created_at || new Date().toISOString())}</span>
                </div>
              </div>
            </div>

            {/* Información Personal */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Información Personal
              </h4>
              
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Nombre</label>
                    <p className="text-white mt-1">{usuario.persona?.nombre || usuario.nombres || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Apellido</label>
                    <p className="text-white mt-1">{usuario.persona?.apellido || usuario.apellidos || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <IdCard className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-400">Documento de Identidad</label>
                      <p className="text-white mt-1 font-mono">
                        {usuario.persona?.documento_identidad || usuario.documento_identidad || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <label className="text-sm font-medium text-gray-400">Teléfono</label>
                      <p className="text-white mt-1">
                        {usuario.persona?.telefono || usuario.telefono || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-400">Correo Electrónico</label>
                    <p className="text-white mt-1">{usuario.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Sistema */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Información del Sistema
              </h4>
              
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a] space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Tipo de Usuario</label>
                    <div className="mt-2">
                      <Badge className={getColorTipo(usuario.persona?.tipo_persona)}>
                        {getTipoPersona()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Estado</label>
                    <div className="mt-2">
                      <Badge className={getColorEstado(usuario.activo)}>
                        {usuario.activo ? 'ACTIVO' : 'INACTIVO'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">ID Usuario</label>
                    <p className="text-white mt-1 font-mono">#{usuario.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Última Actualización</label>
                    <p className="text-white mt-1 text-sm">
                      {formatFecha(usuario.persona?.updated_at || new Date().toISOString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información Contextual según Tipo */}
            {(usuario.persona?.tipo_persona === 'propietario' || usuario.persona?.tipo_persona === 'inquilino') && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-white flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Información de Vivienda
                </h4>
                
                <Alert className="bg-blue-950 border-blue-800">
                  <Building className="h-4 w-4" />
                  <AlertDescription className="text-blue-200">
                    {usuario.persona?.tipo_persona === 'propietario' 
                      ? 'La información de las propiedades se gestiona en la sección de Unidades.'
                      : 'La información del contrato y unidad asignada se gestiona en la sección de Inquilinos.'
                    }
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <Separator className="bg-[#2a2a2a]" />

            {/* Acciones */}
            <div className="flex justify-between items-center pt-4">
              <div className="text-xs text-gray-400">
                ID: {usuario.id} • Tipo: {getTipoPersona()} • 
                Estado: {usuario.activo ? 'Activo' : 'Inactivo'}
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-transparent border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
                >
                  Cerrar
                </Button>
                
                {onEditar && (
                  <Button
                    onClick={() => {
                      onOpenChange(false)
                      onEditar(usuario.id)
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Usuario
                  </Button>
                )}
                
                {onEliminar && usuario.activo && (
                  <Button
                    onClick={() => {
                      onOpenChange(false)
                      onEliminar(usuario.id)
                    }}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-400">
            No se encontró información del usuario
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}