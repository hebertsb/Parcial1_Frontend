'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { User, Mail, Phone, IdCard, AlertCircle, Loader2, Eye, EyeOff, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Datos de la persona
  const [personaData, setPersonaData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    documento_identidad: '',
    tipo_persona: '',
    activo: true
  })

  // Datos de usuario del sistema (credenciales)
  const [usuarioData, setUsuarioData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '', // Se sincroniza con persona
    is_active: true,
    is_staff: false
  })

  const tiposPersona = [
    { value: 'propietario', label: 'Propietario' },
    { value: 'inquilino', label: 'Inquilino' },
    { value: 'administrador', label: 'Administrador' },
    { value: 'seguridad', label: 'Seguridad' }
  ]

  const handlePersonaChange = (field: string, value: string | boolean) => {
    setPersonaData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Sincronizar email entre persona y usuario
    if (field === 'email') {
      setUsuarioData(prev => ({
        ...prev,
        email: value as string
      }))
    }
    
    // Auto-generar username basado en email
    if (field === 'email' && typeof value === 'string') {
      const emailUsername = value.split('@')[0]
      setUsuarioData(prev => ({
        ...prev,
        username: emailUsername
      }))
    }
    
    // Configurar permisos según tipo de persona
    if (field === 'tipo_persona') {
      setUsuarioData(prev => ({
        ...prev,
        is_staff: value === 'administrador'
      }))
    }
    
    // Limpiar error al cambiar campos
    if (error) setError(null)
  }

  const handleUsuarioChange = (field: string, value: string | boolean) => {
    setUsuarioData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error al cambiar campos
    if (error) setError(null)
  }

  const validarFormulario = () => {
    const errores = []
    
    // Validar datos de persona
    if (!personaData.nombre.trim()) {
      errores.push('El nombre es requerido')
    }
    
    if (!personaData.apellido.trim()) {
      errores.push('El apellido es requerido')
    }
    
    if (!personaData.email.trim()) {
      errores.push('El email es requerido')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personaData.email)) {
      errores.push('El email no tiene un formato válido')
    }
    
    if (!personaData.documento_identidad.trim()) {
      errores.push('El documento de identidad es requerido')
    }
    
    if (!personaData.tipo_persona) {
      errores.push('El tipo de persona es requerido')
    }
    
    if (personaData.telefono && !/^\d{7,15}$/.test(personaData.telefono.replace(/\s/g, ''))) {
      errores.push('El teléfono debe tener entre 7 y 15 dígitos')
    }

    // Validar datos de usuario
    if (!usuarioData.username.trim()) {
      errores.push('El nombre de usuario es requerido')
    } else if (usuarioData.username.length < 3) {
      errores.push('El nombre de usuario debe tener al menos 3 caracteres')
    }
    
    if (!usuarioData.password.trim()) {
      errores.push('La contraseña es requerida')
    } else if (usuarioData.password.length < 6) {
      errores.push('La contraseña debe tener al menos 6 caracteres')
    }
    
    if (usuarioData.password !== usuarioData.confirmPassword) {
      errores.push('Las contraseñas no coinciden')
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
      // Combinar datos para enviar al backend
      const datosCompletos = {
        // Datos de persona
        persona: personaData,
        // Datos de usuario del sistema
        usuario: {
          username: usuarioData.username,
          password: usuarioData.password,
          email: usuarioData.email,
          is_active: usuarioData.is_active,
          is_staff: usuarioData.is_staff
        }
      }
      
      const success = await onCrear(datosCompletos)
      
      if (success) {
        // Limpiar formulario
        setPersonaData({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          documento_identidad: '',
          tipo_persona: '',
          activo: true
        })
        setUsuarioData({
          username: '',
          password: '',
          confirmPassword: '',
          email: '',
          is_active: true,
          is_staff: false
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
    setPersonaData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      documento_identidad: '',
      tipo_persona: '',
      activo: true
    })
    setUsuarioData({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      is_active: true,
      is_staff: false
    })
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#0a0a0a] border-[#1f1f1f] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Crear Nuevo Usuario del Sistema
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete los datos personales y las credenciales de acceso al sistema
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert className="bg-red-950 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="persona" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a]">
              <TabsTrigger value="persona" className="text-white data-[state=active]:bg-blue-600">
                📄 Datos Personales
              </TabsTrigger>
              <TabsTrigger value="usuario" className="text-white data-[state=active]:bg-blue-600">
                🔐 Credenciales de Acceso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="persona" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-gray-300">
                    Nombre *
                  </Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={personaData.nombre}
                    onChange={(e) => handlePersonaChange('nombre', e.target.value)}
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
                    value={personaData.apellido}
                    onChange={(e) => handlePersonaChange('apellido', e.target.value)}
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
                  Email * (se usará para el login)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={personaData.email}
                  onChange={(e) => handlePersonaChange('email', e.target.value)}
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
                    value={personaData.telefono}
                    onChange={(e) => handlePersonaChange('telefono', e.target.value)}
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
                    value={personaData.documento_identidad}
                    onChange={(e) => handlePersonaChange('documento_identidad', e.target.value)}
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
                  value={personaData.tipo_persona}
                  onValueChange={(value) => handlePersonaChange('tipo_persona', value)}
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
            </TabsContent>

            <TabsContent value="usuario" className="space-y-4">
              <Alert className="bg-blue-950 border-blue-800">
                <Key className="h-4 w-4" />
                <AlertDescription className="text-blue-200">
                  Estas credenciales permitirán al usuario acceder al sistema.
                </AlertDescription>
              </Alert>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre de Usuario *
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={usuarioData.username}
                  onChange={(e) => handleUsuarioChange('username', e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  placeholder="Ej: juan.perez"
                  required
                />
                <p className="text-xs text-gray-400">
                  Mínimo 3 caracteres. Se genera automáticamente del email.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={usuarioData.password}
                      onChange={(e) => handleUsuarioChange('password', e.target.value)}
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">
                    Confirmar Contraseña *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={usuarioData.confirmPassword}
                      onChange={(e) => handleUsuarioChange('confirmPassword', e.target.value)}
                      className="bg-[#1a1a1a] border-[#2a2a2a] text-white pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Mínimo 6 caracteres. La contraseña debe ser segura.
              </p>

              {/* Permisos */}
              <div className="bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
                <h4 className="text-white font-medium mb-2">Permisos del Sistema</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Acceso al sistema:</span>
                    <span className="text-green-400">✓ Habilitado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Permisos de administrador:</span>
                    <span className={personaData.tipo_persona === 'administrador' ? 'text-green-400' : 'text-red-400'}>
                      {personaData.tipo_persona === 'administrador' ? '✓ Habilitado' : '✗ Deshabilitado'}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Información adicional para propietarios/inquilinos */}
          {(personaData.tipo_persona === 'propietario' || personaData.tipo_persona === 'inquilino') && (
            <Alert className="bg-yellow-950 border-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-yellow-200">
                {personaData.tipo_persona === 'propietario' 
                  ? 'Los datos de la propiedad se configurarán posteriormente en la sección de Unidades.'
                  : 'La asignación de unidad se realizará posteriormente en la sección de Inquilinos.'
                }
              </AlertDescription>
            </Alert>
          )}

          <Separator className="bg-[#2a2a2a]" />

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
                  Creando Usuario...
                </>
              ) : (
                'Crear Usuario del Sistema'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}