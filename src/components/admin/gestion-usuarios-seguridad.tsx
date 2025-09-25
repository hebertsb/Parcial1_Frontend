/**
 * Componente para listar y gestionar usuarios de seguridad
 * Permite ver, activar/desactivar y resetear contraseñas
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  RefreshCw, 
  Shield, 
  CheckCircle, 
  XCircle,
  Key,
  Eye,
  Loader2,
  AlertCircle,
  UserPlus,
  Edit3,
  Trash2
} from 'lucide-react';

import { useSeguridadUsuarios } from '@/features/admin/hooks/useSeguridadUsuarios';
import type { UsuarioSeguridad } from '@/features/admin/services/seguridad';
import { CrearUsuarioSeguridad } from './crear-usuario-seguridad';
import { VerUsuarioSeguridad } from './ver-usuario-seguridad';
import { EditarUsuarioSeguridad } from './editar-usuario-seguridad';
import { EliminarUsuarioSeguridad } from './eliminar-usuario-seguridad';

export function GestionUsuariosSeguridad() {
  const { usuarios, loading, error, totalCount, refetch, cambiarEstado, resetearPassword } = useSeguridadUsuarios();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsuarioSeguridad | null>(null);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Estados para los nuevos modales
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewUserId, setViewUserId] = useState<number | null>(null);
  const [editUserId, setEditUserId] = useState<number | null>(null);

  // Filtrar usuarios por término de búsqueda
  const filteredUsuarios = (usuarios || []).filter(usuario => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.email.toLowerCase().includes(searchLower) ||
      usuario.persona.nombre.toLowerCase().includes(searchLower) ||
      usuario.persona.apellido.toLowerCase().includes(searchLower) ||
      usuario.persona.ci.includes(searchTerm)
    );
  });

  // Manejar cambio de estado de usuario
  const handleCambiarEstado = async (usuario: UsuarioSeguridad) => {
    const nuevoEstado = !usuario.is_active;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    if (!confirm(`¿Está seguro de ${accion} al usuario ${usuario.persona.nombre} ${usuario.persona.apellido}?`)) {
      return;
    }

    setActionLoading(usuario.id);
    try {
      const exito = await cambiarEstado(usuario.id, nuevoEstado);
      if (exito) {
        console.log(`✅ Usuario ${accion}do exitosamente`);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Manejar reseteo de contraseña
  const handleResetPassword = async () => {
    if (!selectedUser || !resetPasswordForm.trim()) {
      return;
    }

    if (!confirm(`¿Está seguro de resetear la contraseña de ${selectedUser.persona.nombre} ${selectedUser.persona.apellido}?`)) {
      return;
    }

    setActionLoading(selectedUser.id);
    try {
      const exito = await resetearPassword(selectedUser.id, resetPasswordForm);
      if (exito) {
        alert('Contraseña reseteada exitosamente');
        setShowResetDialog(false);
        setResetPasswordForm('');
        setSelectedUser(null);
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Manejar ver usuario
  const handleVerUsuario = (usuario: UsuarioSeguridad) => {
    setViewUserId(usuario.id);
    setShowViewModal(true);
  };

  // Manejar editar usuario
  const handleEditarUsuario = (usuario: UsuarioSeguridad) => {
    setEditUserId(usuario.id);
    setShowEditModal(true);
  };

  // Manejar eliminar usuario
  const handleEliminarUsuario = (usuario: UsuarioSeguridad) => {
    setSelectedUser(usuario);
    setShowDeleteModal(true);
  };

  // Cerrar modales
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewUserId(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditUserId(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  // Manejar éxito en operaciones
  const handleSuccess = () => {
    refetch(); // Recargar la lista de usuarios
  };

  // Formatear fecha
  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Si está mostrando el formulario de creación
  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Crear Usuario de Seguridad</h1>
            <p className="text-gray-400 text-sm mt-1">Agregar nuevo personal de seguridad al sistema</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
            className="border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]"
          >
            Volver a Lista
          </Button>
        </div>
        
        <CrearUsuarioSeguridad
          onSuccess={() => {
            setShowCreateForm(false);
            refetch();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Usuarios de Seguridad</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestiona el personal de seguridad del condominio ({totalCount} usuarios)
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Crear Usuario
          </Button>
        </div>
      </div>

      {/* Búsqueda */}
      <Card className="bg-[#111111] border-[#1f1f1f]">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, email o cédula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Estado de carga */}
      {loading && (
        <Card className="bg-[#111111] border-[#1f1f1f]">
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <p className="text-gray-400">Cargando usuarios de seguridad...</p>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <AlertDescription className="text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de usuarios */}
      {!loading && !error && (
        <Card className="bg-[#111111] border-[#1f1f1f]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Shield className="w-5 h-5 text-blue-400" />
              <span>Personal de Seguridad</span>
              <Badge variant="outline" className="border-[#2a2a2a] text-gray-400">
                {filteredUsuarios.length} usuarios
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {filteredUsuarios.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios de seguridad'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Agrega el primer usuario de seguridad para comenzar'
                  }
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Crear Primer Usuario
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                      <TableHead className="text-gray-300 font-medium">Usuario</TableHead>
                      <TableHead className="text-gray-300 font-medium">Email</TableHead>
                      <TableHead className="text-gray-300 font-medium">Teléfono</TableHead>
                      <TableHead className="text-gray-300 font-medium">CI</TableHead>
                      <TableHead className="text-gray-300 font-medium">Estado</TableHead>
                      <TableHead className="text-gray-300 font-medium">Fecha Registro</TableHead>
                      <TableHead className="text-gray-300 font-medium text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsuarios.map((usuario) => (
                      <TableRow key={usuario.id} className="border-[#1f1f1f] hover:bg-[#1a1a1a]">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {usuario.persona.nombre} {usuario.persona.apellido}
                              </p>
                              <p className="text-gray-400 text-sm">Personal de Seguridad</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{usuario.email}</TableCell>
                        <TableCell className="text-gray-300">{usuario.persona.telefono}</TableCell>
                        <TableCell className="text-gray-300">{usuario.persona.ci}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={usuario.is_active ? "default" : "secondary"}
                            className={usuario.is_active 
                              ? "bg-green-500/20 text-green-400 border-green-500/20" 
                              : "bg-red-500/20 text-red-400 border-red-500/20"
                            }
                          >
                            {usuario.is_active ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Activo
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactivo
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          {formatFecha(usuario.date_joined)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                                disabled={actionLoading === usuario.id}
                              >
                                {actionLoading === usuario.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <MoreHorizontal className="w-4 h-4" />
                                )}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="end" 
                              className="bg-[#1a1a1a] border-[#2a2a2a]"
                            >
                              <DropdownMenuItem 
                                className="text-white hover:bg-[#2a2a2a]"
                                onClick={() => handleVerUsuario(usuario)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>

                              <DropdownMenuItem 
                                className="text-green-400 hover:bg-[#2a2a2a]"
                                onClick={() => handleEditarUsuario(usuario)}
                              >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar Usuario
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                className="text-blue-400 hover:bg-[#2a2a2a]"
                                onClick={() => handleCambiarEstado(usuario)}
                              >
                                {usuario.is_active ? (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Desactivar
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Activar
                                  </>
                                )}
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                className="text-yellow-400 hover:bg-[#2a2a2a]"
                                onClick={() => {
                                  setSelectedUser(usuario);
                                  setShowResetDialog(true);
                                }}
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Resetear Contraseña
                              </DropdownMenuItem>

                              <DropdownMenuItem 
                                className="text-red-400 hover:bg-[#2a2a2a]"
                                onClick={() => handleEliminarUsuario(usuario)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar Usuario
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog para resetear contraseña */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-[#111111] border-[#1f1f1f]">
          <DialogHeader>
            <DialogTitle className="text-white">Resetear Contraseña</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedUser && (
                <>Ingrese la nueva contraseña para <strong>{selectedUser.persona.nombre} {selectedUser.persona.apellido}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Nueva contraseña temporal"
                value={resetPasswordForm}
                onChange={(e) => setResetPasswordForm(e.target.value)}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowResetDialog(false);
                  setResetPasswordForm('');
                  setSelectedUser(null);
                }}
                className="border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a]"
                disabled={actionLoading !== null}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleResetPassword}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                disabled={!resetPasswordForm.trim() || actionLoading !== null}
              >
                {actionLoading !== null ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Reseteando...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 mr-2" />
                    Resetear Contraseña
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Ver Usuario */}
      <VerUsuarioSeguridad
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        userId={viewUserId}
      />

      {/* Modal Editar Usuario */}
      <EditarUsuarioSeguridad
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSuccess={handleSuccess}
        userId={editUserId}
      />

      {/* Modal Eliminar Usuario */}
      <EliminarUsuarioSeguridad
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onSuccess={handleSuccess}
        usuario={selectedUser}
      />
    </div>
  );
}