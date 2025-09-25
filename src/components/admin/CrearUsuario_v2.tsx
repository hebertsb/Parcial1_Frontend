'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { User, Mail, Phone, IdCard, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CrearUsuarioProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCrear: (userData: any) => Promise<boolean>
}

export function CrearUsuario({ 
  open, 
  onOpenChange, 
  onCrear
}: CrearUsuarioProps) {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpiar error al cambiar campos
    if (error) setError(null)
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
    
    const errores = validarFormulario()
    if (errores.length > 0) {
      setError(errores.join(', '))
      return
    }

    setCreating(true)
    setError(null)

    try {
      const success = await onCrear(formData)
      
      if (success) {
        // Limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          documento_identidad: '',
          tipo_persona: '',
          activo: true
        })
        onOpenChange(false)
      } else {
        setError('Error al crear usuario. Inténtalo nuevamente.')
      }
    } catch (err) {
      console.error('Error creando usuario:', err)
      setError('Error inesperado al crear usuario')
    } finally {
      setCreating(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      documento_identidad: '',
      tipo_persona: '',
      activo: true
    })
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-[#1f1f1f]">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Crear Nuevo Usuario
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="bg-red-950 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {error}
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

          {/* Información adicional para propietarios/inquilinos */}
          {(formData.tipo_persona === 'propietario' || formData.tipo_persona === 'inquilino') && (
            <Alert className="bg-blue-950 border-blue-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                {formData.tipo_persona === 'propietario' 
                  ? 'Los datos de la propiedad se configurarán posteriormente en la sección de Unidades.'
                  : 'La asignación de unidad se realizará posteriormente en la sección de Inquilinos.'
                }
              </AlertDescription>
            </Alert>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={creating}
              className="bg-transparent border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={creating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Usuario'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}