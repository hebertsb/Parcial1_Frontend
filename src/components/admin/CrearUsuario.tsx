'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Rol } from "@/core/types"
import { Plus, User, Mail, Phone, IdCard, Users, Eye, EyeOff } from "lucide-react"

interface CrearUsuarioProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCrear: (userData: any) => Promise<boolean>
  roles: Rol[]
}

export function CrearUsuario({ 
  open, 
  onOpenChange, 
  onCrear,
  roles
}: CrearUsuarioProps) {
  const [creating, setCreating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    documento_identidad: '',
    fecha_nacimiento: '',
    genero: 'no_especificado',
    direccion: '',
    pais: 'Bolivia',
    estado: 'ACTIVO',
    roles: [] as number[]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRoleChange = (roleId: string) => {
    const id = parseInt(roleId)
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(id) 
        ? prev.roles.filter(r => r !== id)
        : [...prev.roles, id]
    }))
  }

  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      confirmPassword: '',
      telefono: '',
      documento_identidad: '',
      fecha_nacimiento: '',
      genero: 'no_especificado',
      direccion: '',
      pais: 'Bolivia',
      estado: 'ACTIVO',
      roles: []
    })
  }

  const validateForm = () => {
    if (!formData.nombres.trim()) {
      alert('El nombre es requerido')
      return false
    }
    if (!formData.apellidos.trim()) {
      alert('Los apellidos son requeridos')
      return false
    }
    if (!formData.email.trim()) {
      alert('El email es requerido')
      return false
    }
    if (!formData.password.trim()) {
      alert('La contraseña es requerida')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden')
      return false
    }
    if (formData.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setCreating(true)
    try {
      // Preparar datos para el backend
      const userData = {
        first_name: formData.nombres,
        last_name: formData.apellidos,
        email: formData.email,
        password: formData.password,
        username: formData.email, // Usar email como username
        phone: formData.telefono,
        document_id: formData.documento_identidad,
        birth_date: formData.fecha_nacimiento || null,
        gender: formData.genero,
        address: formData.direccion,
        country: formData.pais,
        is_active: formData.estado === 'ACTIVO',
        roles: formData.roles
      }

      const success = await onCrear(userData)
      
      if (success) {
        resetForm()
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error creando usuario:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Crear Nuevo Usuario
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Personal
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                  placeholder="Ingrese los nombres"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  placeholder="Ingrese los apellidos"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento_identidad">Documento de Identidad</Label>
                <Input
                  id="documento_identidad"
                  value={formData.documento_identidad}
                  onChange={(e) => handleInputChange('documento_identidad', e.target.value)}
                  placeholder="Ej: 12345678"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                  placeholder="Ej: +591 70123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Género</Label>
                <Select
                  value={formData.genero}
                  onValueChange={(value) => handleInputChange('genero', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                    <SelectItem value="no_especificado">Prefiero no especificar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Textarea
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange('direccion', e.target.value)}
                placeholder="Ingrese la dirección completa"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pais">País</Label>
              <Input
                id="pais"
                value={formData.pais}
                onChange={(e) => handleInputChange('pais', e.target.value)}
                placeholder="País de residencia"
              />
            </div>
          </div>

          {/* Información de Acceso */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium text-lg flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Información de Acceso
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Repetir contraseña"
                  required
                />
              </div>
            </div>
          </div>

          {/* Estado y Roles */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-medium text-lg flex items-center gap-2">
              <Users className="h-4 w-4" />
              Estado y Roles
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange('estado', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVO">Activo</SelectItem>
                    <SelectItem value="INACTIVO">Inactivo</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                  {roles.map((rol) => (
                    <label key={rol.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(rol.id)}
                        onChange={() => handleRoleChange(rol.id.toString())}
                        className="rounded"
                      />
                      <span className="text-sm">{rol.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={creating}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={creating}
              className="min-w-[100px]"
            >
              {creating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </div>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}