'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { UsuarioSistema, Rol } from "@/core/types"
import { Edit, User, Mail, Phone, Calendar, MapPin, IdCard, Users } from "lucide-react"

interface EditarUsuarioProps {
  usuarioId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerDetalle: (id: number) => Promise<UsuarioSistema | null>
  onActualizar: (id: number, userData: any) => Promise<boolean>
  roles: Rol[]
}

export function EditarUsuario({ 
  usuarioId, 
  open, 
  onOpenChange, 
  onVerDetalle,
  onActualizar,
  roles
}: EditarUsuarioProps) {
  const [usuario, setUsuario] = useState<UsuarioSistema | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    documento_identidad: '',
    fecha_nacimiento: '',
    genero: 'no_especificado',
    direccion: '',
    pais: 'Bolivia',
    estado: 'ACTIVO',
    roles: [] as number[]
  })

  useEffect(() => {
    if (open && usuarioId) {
      cargarUsuario()
    } else if (!open) {
      // Limpiar formulario cuando se cierra
      setUsuario(null)
      setFormData({
        nombres: '',
        apellidos: '',
        email: '',
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
  }, [open, usuarioId])

  const cargarUsuario = async () => {
    if (!usuarioId) return
    
    setLoading(true)
    try {
      const data = await onVerDetalle(usuarioId)
      if (data) {
        setUsuario(data)
        // Llenar formulario con datos existentes
        setFormData({
          nombres: data.nombres || data.persona?.nombre || '',
          apellidos: data.apellidos || data.persona?.apellido || '',
          email: data.email,
          telefono: data.telefono || data.persona?.telefono || '',
          documento_identidad: data.persona?.documento_identidad || '',
          fecha_nacimiento: data.fecha_nacimiento || data.persona?.fecha_nacimiento || '',
          genero: data.genero || data.persona?.genero || 'no_especificado',
          direccion: data.persona?.direccion || '',
          pais: data.persona?.pais || 'Bolivia',
          estado: data.estado,
          roles: data.roles?.map(r => r.id) || []
        })
      }
    } catch (error) {
      console.error('Error cargando usuario:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!usuarioId) return

    setSaving(true)
    try {
      // Preparar datos para el backend
      const userData = {
        first_name: formData.nombres,
        last_name: formData.apellidos,
        email: formData.email,
        phone: formData.telefono,
        document_id: formData.documento_identidad,
        birth_date: formData.fecha_nacimiento || null,
        gender: formData.genero,
        address: formData.direccion,
        country: formData.pais,
        is_active: formData.estado === 'ACTIVO',
        roles: formData.roles
      }

      const success = await onActualizar(usuarioId, userData)
      
      if (success) {
        onOpenChange(false)
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Usuario
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
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

            {/* Información de Contacto */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-medium text-lg flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Información de Contacto
              </h4>
              
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
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={saving}
                className="min-w-[100px]"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Guardando...
                  </div>
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