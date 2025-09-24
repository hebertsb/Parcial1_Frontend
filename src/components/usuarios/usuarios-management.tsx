"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUsuarios } from "@/hooks/useUsuarios"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react"

export function UsuariosManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  
  // Hook personalizado para gestión de usuarios
  const {
    usuarios,
    roles,
    loading,
    error,
    totalPages,
    currentPage,
    totalCount,
    filters,
    setFilters,
    refetch,
    cambiarEstadoUsuario,
    eliminarUsuario
  } = useUsuarios();

  // Función para actualizar búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({
      ...filters,
      search: term,
      page: 1 // Reset a primera página
    });
  };

  // Función para cambiar página
  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page
    });
  };

  // Función para formatear nombre completo
  const formatNombreCompleto = (usuario: any) => {
    // Primero intentar usar el campo nombre_completo de persona (nueva guía)
    if (usuario.persona?.nombre_completo) {
      return usuario.persona.nombre_completo;
    }
    
    // Fallback a campos individuales
    if (usuario.nombres || usuario.apellidos) {
      return `${usuario.nombres || ''} ${usuario.apellidos || ''}`.trim();
    }
    
    if (usuario.persona?.nombre || usuario.persona?.apellido) {
      return `${usuario.persona.nombre || ''} ${usuario.persona.apellido || ''}`.trim();
    }
    
    return 'Sin nombre';
  };

  // Función para obtener rol principal
  const getRolPrincipal = (usuario: any) => {
    if (!usuario.roles || usuario.roles.length === 0) return 'Sin rol';
    return usuario.roles[0].nombre;
  };

  // Función para obtener unidad principal
  const getUnidadPrincipal = (usuario: any) => {
    if (!usuario.propiedades || usuario.propiedades.length === 0) return 'Sin unidad';
    return usuario.propiedades[0].vivienda.numero_casa;
  };

  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Función para obtener initiales para avatar
  const getInitials = (usuario: any) => {
    const nombre = formatNombreCompleto(usuario);
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'US';
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usuarios</h1>
          <p className="text-gray-400 text-sm mt-1">Cargando usuarios...</p>
        </div>
        <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando datos de usuarios...</p>
        </div>
      </div>
    );
  }

  // Mostrar errores
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usuarios</h1>
          <p className="text-gray-400 text-sm mt-1">Error al cargar usuarios</p>
        </div>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
          <p className="text-red-200 mb-4">{error}</p>
          <Button onClick={refetch} className="bg-red-600 hover:bg-red-700">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Usuarios</h1>
        <p className="text-gray-400 text-sm mt-1">Gestión de usuarios del condominio</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-80 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-400 pl-10"
            />
          </div>
          <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            <Filter className="w-4 h-4 mr-2" />
            Columnas
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button className="bg-white text-black hover:bg-gray-200">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Usuario
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111111] border border-[#1f1f1f] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
              <TableHead className="text-gray-300 font-medium">Nombre</TableHead>
              <TableHead className="text-gray-300 font-medium">Email</TableHead>
              <TableHead className="text-gray-300 font-medium">Teléfono</TableHead>
              <TableHead className="text-gray-300 font-medium">Rol</TableHead>
              <TableHead className="text-gray-300 font-medium">Unidad</TableHead>
              <TableHead className="text-gray-300 font-medium">Profesión</TableHead>
              <TableHead className="text-gray-300 font-medium">Estado</TableHead>
              <TableHead className="text-gray-300 font-medium">Fecha Registro</TableHead>
              <TableHead className="text-gray-300 font-medium w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id} className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                <TableCell className="text-white">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-[#2a2a2a] text-white text-xs">
                        {getInitials(usuario)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{formatNombreCompleto(usuario)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{usuario.email}</TableCell>
                <TableCell className="text-gray-300">{usuario.persona?.telefono || usuario.telefono || 'N/A'}</TableCell>
                <TableCell>
                  <Badge
                    variant={getRolPrincipal(usuario) === "Propietario" ? "default" : "secondary"}
                    className={
                      getRolPrincipal(usuario) === "Propietario"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }
                  >
                    {getRolPrincipal(usuario)}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300 font-mono">{getUnidadPrincipal(usuario)}</TableCell>
                <TableCell className="text-gray-300">N/A</TableCell>
                <TableCell>
                  <Badge
                    variant={usuario.estado === 'ACTIVO' ? "default" : "destructive"}
                    className={
                      usuario.estado === 'ACTIVO'
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }
                  >
                    {usuario.estado === 'ACTIVO' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{formatFecha(usuario.created_at)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                      <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-[#2a2a2a]">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-blue-400 hover:bg-[#2a2a2a]"
                        onClick={() => cambiarEstadoUsuario(usuario.id, usuario.estado !== 'ACTIVO')}
                      >
                        {usuario.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-400 hover:bg-[#2a2a2a]"
                        onClick={() => {
                          if (confirm('¿Estás seguro de eliminar este usuario?')) {
                            eliminarUsuario(usuario.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Página {currentPage} de {totalPages} - Total: {totalCount} usuarios
        </p>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <span className="text-sm text-gray-400 px-2">
            {currentPage} / {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
