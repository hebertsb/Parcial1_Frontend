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
import { VerUsuario } from "@/components/admin/VerUsuario_v2"
import { EditarUsuario } from "@/components/admin/EditarUsuario_v2"
import { EliminarUsuario } from "@/components/admin/EliminarUsuario_v2"
import { CrearUsuario } from "@/components/admin/CrearUsuario_v3"
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
  Users,
  RefreshCw,
} from "lucide-react"

export function UsuariosManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  
  // Estados para modales
  const [verModalOpen, setVerModalOpen] = useState(false)
  const [editarModalOpen, setEditarModalOpen] = useState(false)
  const [eliminarModalOpen, setEliminarModalOpen] = useState(false)
  const [crearModalOpen, setCrearModalOpen] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null)
  
  // Hook personalizado para gestión de usuarios
  const {
    usuarios,
    loading,
    error,
    cargarUsuarios,
    verUsuario,
    eliminarUsuario,
    transferirPropiedad,
    cambiarTipoPersona,
    mapearTipoPersonaARol
  } = useUsuarios();

  // Estados adicionales que necesitamos manejar localmente
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({});

  // Funciones que necesitamos crear localmente
  const refetch = () => cargarUsuarios();
  const crearUsuario = async (usuarioData: any): Promise<boolean> => {
    console.log('⚠️ crearUsuario no implementado aún');
    return Promise.resolve(true);
  };
  const actualizarUsuario = async (id: number, usuarioData: any): Promise<boolean> => {
    console.log('⚠️ actualizarUsuario no implementado aún');
    return Promise.resolve(true);
  };
  const cambiarEstadoUsuario = async (id: number, estado: string | boolean): Promise<boolean> => {
    console.log('⚠️ cambiarEstadoUsuario no implementado aún');
    return Promise.resolve(true);
  };
  const editarUsuario = async (id: number, usuarioData: any): Promise<boolean> => {
    console.log('⚠️ editarUsuario no implementado aún');
    return Promise.resolve(true);
  };

  // Roles mock para compatibilidad
  const roles = [
    { id: 1, nombre: 'Administrador', descripcion: 'Acceso completo al sistema', activo: true },
    { id: 2, nombre: 'Seguridad', descripcion: 'Personal de seguridad', activo: true },
    { id: 3, nombre: 'Propietario', descripcion: 'Propietario de unidad', activo: true },
    { id: 4, nombre: 'Inquilino', descripcion: 'Inquilino de unidad', activo: true }
  ];

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
    // Primero intentar con los nuevos campos del backend
    if (usuario.unit_number && usuario.unit_number !== 'Sin unidad') {
      return usuario.unit_number;
    }
    
    // Fallback a estructura anterior
    if (usuario.propiedades && usuario.propiedades.length > 0) {
      return usuario.propiedades[0].vivienda?.numero_casa || 'Sin unidad';
    }
    
    return 'Sin unidad';
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

  // Funciones para manejar modales
  const handleVerUsuario = (id: number) => {
    setUsuarioSeleccionado(id)
    setVerModalOpen(true)
  }

  const handleEditarUsuario = (id: number) => {
    setUsuarioSeleccionado(id)
    setEditarModalOpen(true)
  }

  const handleEliminarUsuario = (id: number) => {
    setUsuarioSeleccionado(id)
    setEliminarModalOpen(true)
  }

  const handleCrearUsuario = () => {
    setCrearModalOpen(true)
  }

  // Función para cambiar estado con confirmación
  const handleCambiarEstado = async (id: number, activar: boolean) => {
    const accion = activar ? 'activar' : 'desactivar'
    if (confirm(`¿Estás seguro de ${accion} este usuario?`)) {
      await cambiarEstadoUsuario(id, activar)
    }
  }

  // Función para obtener color del estado
  const obtenerColorEstado = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'ACTIVO':
        return 'bg-green-600 text-white hover:bg-green-700'
      case 'INACTIVO':
        return 'bg-red-600 text-white hover:bg-red-700'
      case 'PENDIENTE':
        return 'bg-yellow-600 text-white hover:bg-yellow-700'
      default:
        return 'bg-gray-600 text-white hover:bg-gray-700'
    }
  }

  // Función para obtener color del rol
  const obtenerColorRol = (rol: string) => {
    switch (rol?.toLowerCase()) {
      case 'propietario':
        return 'bg-blue-600 text-white hover:bg-blue-700'
      case 'inquilino':
        return 'bg-purple-600 text-white hover:bg-purple-700'
      case 'administrador':
        return 'bg-orange-600 text-white hover:bg-orange-700'
      case 'usuario':
        return 'bg-gray-600 text-white hover:bg-gray-700'
      default:
        return 'bg-gray-600 text-white hover:bg-gray-700'
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Users className="h-6 w-6" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Administrar propietarios, inquilinos y usuarios del sistema
          </p>
        </div>
        {totalCount > 0 && (
          <div className="text-right">
            <p className="text-white font-medium">{totalCount}</p>
            <p className="text-gray-400 text-sm">Usuarios registrados</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-80 bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder-gray-400 pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button 
            className="bg-white text-black hover:bg-gray-200"
            onClick={handleCrearUsuario}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
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
              <TableHead className="text-gray-300 font-medium">Tipo</TableHead>
              <TableHead className="text-gray-300 font-medium">Documento</TableHead>
              <TableHead className="text-gray-300 font-medium">Estado</TableHead>
              <TableHead className="text-gray-300 font-medium">Fecha Registro</TableHead>
              <TableHead className="text-gray-300 font-medium text-center w-32">Acciones</TableHead>
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
                <TableCell className="text-gray-300">{usuario.telefono || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={obtenerColorRol(getRolPrincipal(usuario))}>
                    {getRolPrincipal(usuario)}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300 font-mono">{usuario.documento_identidad || 'N/A'}</TableCell>
                <TableCell>
                  <Badge className={obtenerColorEstado(usuario.estado)}>
                    {usuario.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-300">{formatFecha(usuario.fecha_nacimiento || new Date().toISOString())}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-8 w-8 p-0"
                      onClick={() => handleVerUsuario(usuario.id)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 h-8 w-8 p-0"
                      onClick={() => handleEditarUsuario(usuario.id)}
                      title="Editar usuario"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                      onClick={() => handleEliminarUsuario(usuario.id)}
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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

      {/* Modales */}
      <VerUsuario
        usuarioId={usuarioSeleccionado}
        open={verModalOpen}
        onOpenChange={setVerModalOpen}
        onObtener={verUsuario}
        onEditar={handleEditarUsuario}
        onEliminar={handleEliminarUsuario}
      />

      <EditarUsuario
        usuarioId={usuarioSeleccionado}
        open={editarModalOpen}
        onOpenChange={setEditarModalOpen}
        onEditar={editarUsuario}
        onObtener={verUsuario}
        onTransferirPropiedad={transferirPropiedad}
      />

      <EliminarUsuario
        usuarioId={usuarioSeleccionado}
        open={eliminarModalOpen}
        onOpenChange={setEliminarModalOpen}
        onEliminar={eliminarUsuario}
        onObtener={verUsuario}
      />

      <CrearUsuario
        open={crearModalOpen}
        onOpenChange={setCrearModalOpen}
        onCrear={crearUsuario}
      />
    </div>
  )
}
