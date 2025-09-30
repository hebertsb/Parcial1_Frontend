"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, UserPlus, Shield, Camera, Key } from 'lucide-react'

const usuariosEjemplo = [
  {
    id: 1,
    nombre: "Carlos Mendoza",
    email: "carlos.mendoza@gmail.com",
    rol: "propietario",
    unidad: "Torre A - Apt 301",
    estado: "activo",
    reconocimientoFacial: true,
    ultimoAcceso: "2024-12-28 14:30",
    avatar: "https://i.pravatar.cc/64?img=1"
  },
  {
    id: 2,
    nombre: "Ana García",
    email: "ana.garcia@hotmail.com",
    rol: "inquilino",
    unidad: "Torre B - Apt 205",
    estado: "activo",
    reconocimientoFacial: true,
    ultimoAcceso: "2024-12-28 13:15",
    avatar: "https://i.pravatar.cc/64?img=2"
  },
  {
    id: 3,
    nombre: "Luis Morales",
    email: "luis.morales@outlook.com",
    rol: "propietario",
    unidad: "Torre A - Apt 102",
    estado: "inactivo",
    reconocimientoFacial: false,
    ultimoAcceso: "2024-12-25 09:20",
    avatar: "https://i.pravatar.cc/64?img=3"
  },
  {
    id: 4,
    nombre: "María Rodríguez",
    email: "maria.rodriguez@gmail.com",
    rol: "inquilino",
    unidad: "Torre C - Apt 401",
    estado: "activo",
    reconocimientoFacial: true,
    ultimoAcceso: "2024-12-28 15:45",
    avatar: "https://i.pravatar.cc/64?img=4"
  }
]

export default function UsuariosPage() {
  const getRolColor = (rol: string) => {
    switch (rol) {
      case 'propietario': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'inquilino': return 'bg-green-100 text-green-800 border-green-200'
      case 'administrador': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactivo': return 'bg-red-100 text-red-800 border-red-200'
      case 'suspendido': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Usuarios</h1>
          <p className="text-gray-400 mt-2">Administrar residentes y accesos del sistema</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar Usuario
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">157</div>
            <p className="text-xs text-gray-400">Residentes activos</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Con Reconocimiento</CardTitle>
            <Camera className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">142</div>
            <p className="text-xs text-gray-400">90% cobertura</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Propietarios</CardTitle>
            <Key className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">89</div>
            <p className="text-xs text-gray-400">57% del total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Inquilinos</CardTitle>
            <Shield className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">68</div>
            <p className="text-xs text-gray-400">43% del total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Buscar por nombre, email o unidad..." 
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Filtrar por Rol
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Estado
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usuariosEjemplo.map((usuario) => (
              <div key={usuario.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={usuario.avatar} 
                    alt={usuario.nombre}
                    className="w-12 h-12 rounded-full border-2 border-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-white">{usuario.nombre}</h3>
                    <p className="text-sm text-gray-400">{usuario.email}</p>
                    <p className="text-sm text-gray-400">{usuario.unidad}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getRolColor(usuario.rol)}>
                        {usuario.rol}
                      </Badge>
                      <Badge className={getEstadoColor(usuario.estado)}>
                        {usuario.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      {usuario.reconocimientoFacial ? (
                        <><Camera className="h-3 w-3 text-green-400" /> Reconocimiento activo</>
                      ) : (
                        <><Camera className="h-3 w-3 text-gray-500" /> Sin reconocimiento</>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Último acceso: {usuario.ultimoAcceso}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}