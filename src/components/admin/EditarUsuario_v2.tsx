'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, IdCard, AlertCircle, Loader2, Edit, Home } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

interface EditarUsuarioProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditar: (id: number, userData: any) => Promise<boolean>
  onObtener: (id: number) => Promise<any>
  onTransferirPropiedad?: (usuarioId: number, accionPropietarioAnterior: 'desactivar' | 'inquilino' | 'mantener') => Promise<any>
  usuarioId: number | null
}

export function EditarUsuario({ 
  open, 
  onOpenChange, 
  onEditar,
  onObtener,
  onTransferirPropiedad,
  usuarioId
}: EditarUsuarioProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tipoOriginal, setTipoOriginal] = useState<string>('')
  const [showTransferOptions, setShowTransferOptions] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento_identidad: '',
    tipo_persona: '',
    activo: true
  })

  const tiposPersona = [
    { value: 'propietario', label: 'Propietario' },
    { value: 'inquilino', label: 'Inquilino' },
    { value: 'administrador', label: 'Administrador' },
    { value: 'seguridad', label: 'Seguridad' }
  ]

  useEffect(() => {
    if (open && usuarioId) {
      cargarUsuario()
    }
  }, [open, usuarioId])

  const cargarUsuario = async () => {
    if (!usuarioId) return

    setLoading(true)
    setError(null)

    try {
      const usuario = await onObtener(usuarioId)
      
      if (usuario) {
        const tipoPersona = usuario.persona?.tipo_persona || ''
        setTipoOriginal(tipoPersona)
        
        setFormData({
          nombre: usuario.persona?.nombre || usuario.nombres || '',
          apellido: usuario.persona?.apellido || usuario.apellidos || '',
          email: usuario.email || '',
          telefono: usuario.persona?.telefono || usuario.telefono || '',
          documento_identidad: usuario.persona?.documento_identidad || usuario.documento_identidad || '',
          tipo_persona: tipoPersona,
          activo: usuario.activo !== false
        })
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpiar error al cambiar campos
    if (error) setError(null)
  }

  const getTipoCambioAlert = () => {
    if (!tipoOriginal || !formData.tipo_persona || tipoOriginal === formData.tipo_persona) {
      return null
    }

    const scenarios = {
      'inquilino-propietario': {
        condition: tipoOriginal === 'inquilino' && formData.tipo_persona === 'propietario',
        message: '🏠 ¡TRANSFERENCIA AUTOMÁTICA DISPONIBLE! Este inquilino puede convertirse en propietario automáticamente. El sistema manejará la transferencia de propiedad, desactivará al propietario anterior y preservará todas las conexiones existentes.',
        type: 'success',
        showTransferButton: true
      },
      'propietario-inquilino': {
        condition: tipoOriginal === 'propietario' && formData.tipo_persona === 'inquilino',
        message: '⚠️ Cambio de Propietario a Inquilino: Esta persona ya no será dueña. Verifica que haya transferido la propiedad y actualiza los registros correspondientes.',
        type: 'warning',
        showTransferButton: false
      },
      'to-admin': {
        condition: ['inquilino', 'propietario'].includes(tipoOriginal) && formData.tipo_persona === 'administrador',
        message: '🔑 Cambio a Administrador: Se otorgarán permisos administrativos completos. Este usuario podrá gestionar todo el sistema del condominio.',
        type: 'warning',
        showTransferButton: false
      },
      'from-admin': {
        condition: tipoOriginal === 'administrador' && ['inquilino', 'propietario'].includes(formData.tipo_persona),
        message: '⚠️ Removiendo permisos de Administrador: Se revocarán todos los permisos administrativos. El usuario solo tendrá acceso básico.',
        type: 'warning',
        showTransferButton: false
      }
    }

    for (const scenario of Object.values(scenarios)) {
      if (scenario.condition) {
        return scenario
      }
    }

    return {
      message: `📝 Cambio de tipo: De ${tiposPersona.find(t => t.value === tipoOriginal)?.label} a ${tiposPersona.find(t => t.value === formData.tipo_persona)?.label}`,
      type: 'info',
      showTransferButton: false
    }
  }

  const validarFormulario = () => {
    const errores = []
    
    if (!formData.nombre.trim()) {
      errores.push('El nombre es requerido')
    }
    
    if (!formData.apellido.trim()) {
      errores.push('El apellido es requerido')
    }
    
    if (!formData.email.trim()) {
      errores.push('El email es requerido')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errores.push('El email no tiene un formato válido')
    }
    
    if (!formData.documento_identidad.trim()) {
      errores.push('El documento de identidad es requerido')
    }
    
    if (!formData.tipo_persona) {
      errores.push('El tipo de persona es requerido')
    }
    
    if (formData.telefono && !/^\d{7,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
      errores.push('El teléfono debe tener entre 7 y 15 dígitos')
    }

    return errores
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!usuarioId) {
      setError('ID de usuario no válido')
      return
    }

    const errores = validarFormulario()
    if (errores.length > 0) {
      setError(errores.join(', '))
      return
    }

    setEditing(true)
    setError(null)

    try {
      const success = await onEditar(usuarioId, formData)
      
      if (success) {
        onOpenChange(false)
      } else {
        setError('Error al actualizar usuario. Inténtalo nuevamente.')
      }
    } catch (err: any) {
      console.error('Error editando usuario:', err)
      
      // Mostrar mensaje más específico si es error de backend
      if (err.message && err.message.includes('Backend no permite actualizaciones')) {
        setError('⚠️ El backend no permite actualizar usuarios. Contacta al administrador del sistema para habilitar las actualizaciones.')
      } else {
        setError(err.message || 'Error inesperado al actualizar usuario')
      }
    } finally {
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setError(null)
    onOpenChange(false)
  }

  const handleTransferenciaAutomatica = async () => {
    if (!usuarioId || !onTransferirPropiedad) return

    try {
      setEditing(true)
      setError(null)

      console.log('🏠 Iniciando transferencia automática para usuario:', usuarioId)
      
      // Llamar función de transferencia con acción por defecto 'desactivar'
      const resultado = await onTransferirPropiedad(usuarioId, 'desactivar')
      
      if (resultado) {
        console.log('✅ Transferencia completada:', resultado)
        
        // Si el usuario transferido es el usuario actual, redirigir a su nuevo panel
        if (user && user.id === usuarioId.toString()) {
          console.log('🎯 Usuario actual transferido, redirigiendo a panel de propietario...')
          router.push('/propietario/dashboard')
        }
        
        onOpenChange(false)
      } else {
        setError('No se pudo completar la transferencia automática')
      }
    } catch (err: any) {
      console.error('❌ Error en transferencia automática:', err)
      setError(err.message || 'Error en la transferencia automática')
    } finally {
      setEditing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-[#1f1f1f]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Editar Usuario
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Modifica la información del usuario. Los cambios de tipo mostrarán alertas contextuales.
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-300">Cargando datos...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="bg-red-950 border-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {getTipoCambioAlert() && (
              <Alert className={
                getTipoCambioAlert()?.type === 'warning' 
                  ? "bg-yellow-950 border-yellow-800" 
                  : getTipoCambioAlert()?.type === 'success'
                    ? "bg-green-950 border-green-800"
                    : "bg-blue-950 border-blue-800"
              }>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className={
                  getTipoCambioAlert()?.type === 'warning' 
                    ? "text-yellow-200" 
                    : getTipoCambioAlert()?.type === 'success'
                      ? "text-green-200"
                      : "text-blue-200"
                }>
                  {getTipoCambioAlert()?.message}
                  
                  {getTipoCambioAlert()?.showTransferButton && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleTransferenciaAutomatica()}
                        disabled={editing}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm h-8"
                      >
                        🏠 Transferencia Automática
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowTransferOptions(!showTransferOptions)}
                        disabled={editing}
                        variant="outline"
                        className="border-green-600 text-green-200 hover:bg-green-600/10 text-sm h-8"
                      >
                        ⚙️ Opciones
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-gray-300">
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  placeholder="Ej: Juan"
                  required
                />
              </div>

              {/* Apellido */}
              <div className="space-y-2">
                <Label htmlFor="apellido" className="text-gray-300">
                  Apellido *
                </Label>
                <Input
                  id="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  placeholder="Ej: Pérez"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                placeholder="ejemplo@condominio.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  placeholder="70000000"
                />
              </div>

              {/* Documento */}
              <div className="space-y-2">
                <Label htmlFor="documento_identidad" className="text-gray-300 flex items-center gap-2">
                  <IdCard className="w-4 h-4" />
                  CI/Documento *
                </Label>
                <Input
                  id="documento_identidad"
                  type="text"
                  value={formData.documento_identidad}
                  onChange={(e) => handleInputChange('documento_identidad', e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  placeholder="12345678"
                  required
                />
              </div>
            </div>

            {/* Tipo de Persona */}
            <div className="space-y-2">
              <Label htmlFor="tipo_persona" className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" />
                Tipo de Usuario *
              </Label>
              <Select
                value={formData.tipo_persona}
                onValueChange={(value) => handleInputChange('tipo_persona', value)}
              >
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Seleccionar tipo de usuario" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                  {tiposPersona.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value} className="text-white hover:bg-[#2a2a2a]">
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado Activo */}
            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <div>
                <Label className="text-gray-300 font-medium">Estado del Usuario</Label>
                <p className="text-sm text-gray-400 mt-1">
                  {formData.activo ? 'Usuario activo en el sistema' : 'Usuario desactivado'}
                </p>
              </div>
              <Switch
                checked={formData.activo}
                onCheckedChange={(checked) => handleInputChange('activo', checked)}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={editing}
                className="bg-transparent border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={editing}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {editing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}