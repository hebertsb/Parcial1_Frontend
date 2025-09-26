"use client";

import { useState, useEffect } from "react";
import { Vivienda } from '@/features/viviendas/services';
import { apiClient } from '@/core/api/client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  UserPlus,
  UserX,
  Home,
  Mail,
  Phone,
  Calendar,
  Building,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Coins
} from "lucide-react";

interface GestionarResidentesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vivienda: Vivienda | null;
  onSuccess?: () => void;
}

interface Residente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  tipo: 'propietario' | 'inquilino' | 'familiar';
  estado: 'activo' | 'inactivo';
  fecha_inicio?: string;
  fecha_fin?: string;
  monto_alquiler?: string;
  observaciones?: string;
}

export function GestionarResidentesModal({ 
  open, 
  onOpenChange, 
  vivienda, 
  onSuccess 
}: GestionarResidentesModalProps) {
  const { toast } = useToast();
  
  // Estados
  const [residentes, setResidentes] = useState<Residente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  
  // Estados para formulario de nuevo residente
  const [nuevoResidente, setNuevoResidente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipo: 'propietario' as 'propietario' | 'inquilino' | 'familiar',
    fecha_inicio: '',
    fecha_fin: '',
    monto_alquiler: '',
    observaciones: ''
  });

  // Cargar residentes cuando se abre el modal
  useEffect(() => {
    if (open && vivienda) {
      loadResidentes();
    }
  }, [open, vivienda]);

  const loadResidentes = async () => {
    if (!vivienda) return;
    
    setLoading(true);
    try {
      console.log('🏠 Cargando residentes para vivienda:', vivienda.numero_casa, 'ID:', vivienda.id);
      
      // Obtener propietarios e inquilinos reales de la vivienda
      const [propiedadesResponse, inquilinosResponse] = await Promise.all([
        apiClient.get('/propiedades/'),
        apiClient.get('/personas/inquilinos/')
      ]);

      const propiedades = (propiedadesResponse.data as any)?.results || propiedadesResponse.data || [];
      const inquilinos = (inquilinosResponse.data as any)?.results || inquilinosResponse.data || [];
      
      console.log('📊 Datos obtenidos:', { 
        propiedades: propiedades.length, 
        inquilinos: inquilinos.length 
      });
      console.log('🔍 Muestra de propiedades:', propiedades.slice(0, 2));
      console.log('🔍 Muestra de inquilinos:', inquilinos.slice(0, 2));

      // Filtrar propiedades de esta vivienda específica
      const propiedadesVivienda = propiedades.filter((prop: any) => {
        console.log('🏠 Verificando propiedad:', { 
          id: prop.id, 
          vivienda: prop.vivienda, 
          viviendaBuscada: vivienda.id,
          tipo_tenencia: prop.tipo_tenencia,
          persona_info: prop.persona_info?.nombre_completo 
        });
        return prop.vivienda === vivienda.id && prop.tipo_tenencia === 'propietario';
      });

      // Filtrar inquilinos de esta vivienda específica - usando diferentes campos posibles
      const inquilinosVivienda = inquilinos.filter((inq: any) => {
        console.log('🏃 Verificando inquilino:', { 
          id: inq.id, 
          vivienda: inq.vivienda,
          vivienda_id: inq.vivienda_id,
          viviendaBuscada: vivienda.id,
          nombre: inq.nombre || inq.persona_info?.nombre_completo,
          estado: inq.estado
        });
        // Probar tanto 'vivienda' como 'vivienda_id' para compatibilidad
        return (inq.vivienda === vivienda.id || inq.vivienda_id === vivienda.id);
      });

      console.log('🎯 Residentes filtrados:', { 
        propietarios: propiedadesVivienda.length, 
        inquilinos: inquilinosVivienda.length 
      });

      // Convertir a formato de residente
      const residentes: Residente[] = [];

      // Agregar propietarios
      propiedadesVivienda.forEach((prop: any) => {
        residentes.push({
          id: prop.id,
          nombre: prop.persona_info?.nombre || 'Sin nombre',
          apellido: prop.persona_info?.apellido || 'Sin apellido',
          email: prop.persona_info?.email || 'Sin email',
          telefono: prop.persona_info?.telefono || '',
          tipo: 'propietario',
          estado: 'activo',
          fecha_inicio: prop.fecha_inicio || '',
          observaciones: `Propietario - ${prop.tipo_tenencia_display || ''}`
        });
      });

      // Agregar inquilinos
      inquilinosVivienda.forEach((inq: any) => {
        console.log('👤 Procesando inquilino completo:', inq);
        
        residentes.push({
          id: inq.id,
          nombre: inq.nombre || inq.persona_info?.nombre || 'Sin nombre',
          apellido: inq.apellido || inq.persona_info?.apellido || 'Sin apellido', 
          email: inq.email || inq.persona_info?.email || 'Sin email',
          telefono: inq.telefono || inq.persona_info?.telefono || '',
          tipo: 'inquilino',
          estado: inq.estado || 'activo',
          fecha_inicio: inq.fecha_inicio || inq.fecha_contrato_inicio || '',
          fecha_fin: inq.fecha_fin || inq.fecha_contrato_fin || '',
          monto_alquiler: inq.monto_alquiler?.toString() || inq.monto?.toString() || '',
          observaciones: `Inquilino${inq.estado ? ` - Estado: ${inq.estado}` : ''}${inq.tipo_contrato ? ` - Contrato: ${inq.tipo_contrato}` : ''}`
        });
      });

      console.log('✅ Residentes finales:', residentes);
      setResidentes(residentes);
      
    } catch (error) {
      console.error('❌ Error cargando residentes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los residentes",
        variant: "destructive",
      });
      setResidentes([]); // Establecer array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  // Filtrar residentes
  const filteredResidentes = residentes.filter((residente) => {
    const matchesSearch = searchTerm === "" || 
      residente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      residente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      residente.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = filtroTipo === "todos" || residente.tipo === filtroTipo;
    
    return matchesSearch && matchesTipo;
  });

  const handleAddResidente = async () => {
    try {
      // Validaciones básicas
      if (!nuevoResidente.nombre || !nuevoResidente.apellido || !nuevoResidente.email) {
        toast({
          title: "Error de validación",
          description: "Por favor completa los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      // Simular creación de residente
      const newResidente: Residente = {
        id: Date.now(),
        ...nuevoResidente,
        estado: 'activo'
      };

      setResidentes(prev => [...prev, newResidente]);
      
      // Limpiar formulario
      setNuevoResidente({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        tipo: 'propietario',
        fecha_inicio: '',
        fecha_fin: '',
        monto_alquiler: '',
        observaciones: ''
      });
      
      setShowAddForm(false);
      
      toast({
        title: "¡Éxito!",
        description: "Residente agregado correctamente",
      });
      
      onSuccess?.();
    } catch (error) {
      console.error('Error agregando residente:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el residente",
        variant: "destructive",
      });
    }
  };

  const handleRemoveResidente = async (residenteId: number) => {
    setResidentes(prev => prev.filter(r => r.id !== residenteId));
    toast({
      title: "¡Éxito!",
      description: "Residente removido correctamente",
    });
    onSuccess?.();
  };

  if (!vivienda) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-[#2a2a2a] text-white p-8 rounded-xl shadow-2xl">
        <DialogHeader className="mb-8">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <Users className="w-7 h-7 text-blue-500" />
            Gestionar Residentes - Casa {vivienda.numero_casa}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-lg mt-2">
            Administra propietarios, inquilinos y familiares de la unidad {vivienda.bloque} - {vivienda.numero_casa}
          </DialogDescription>
        </DialogHeader>

        {/* Información de la vivienda */}
        <div className="bg-[#2a2a2a] rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Home className="w-6 h-6 text-blue-500" />
            Información de la Vivienda
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-5 p-6 bg-[#1a1a1a] rounded-lg">
              <Building className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Bloque</p>
                <p className="text-xl font-bold">{vivienda.bloque}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-6 bg-[#1a1a1a] rounded-lg">
              <Home className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Tipo</p>
                <p className="text-xl font-bold capitalize">{vivienda.tipo_vivienda}</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-6 bg-[#1a1a1a] rounded-lg">
              <CheckCircle className="w-10 h-10 text-purple-500" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Área</p>
                <p className="text-xl font-bold">{vivienda.metros_cuadrados} m²</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-6 bg-[#1a1a1a] rounded-lg">
              <Coins className="w-10 h-10 text-green-500" />
              <div>
                <p className="text-sm text-gray-400 mb-1">Expensas Base</p>
                <p className="text-xl font-bold">Bs {vivienda.tarifa_base_expensas}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {vivienda.tipo_cobranza === 'por_casa' ? 'Tarifa fija' : 
                   vivienda.tipo_cobranza === 'por_metro_cuadrado' ? 'Por m²' : 
                   vivienda.tipo_cobranza}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center gap-5 p-6 bg-[#1a1a1a] rounded-lg">
              <CheckCircle className="w-10 h-10 text-blue-500" />
              <div>
                <p className="text-base text-gray-400 mb-2">Estado de Ocupación</p>
                <Badge 
                  variant="outline" 
                  className={`text-base py-3 px-5 font-semibold ${
                    vivienda.estado_ocupacion === 'ocupada' ? "border-blue-500 text-blue-400" :
                    vivienda.estado_ocupacion === 'alquilada' ? "border-yellow-500 text-yellow-400" :
                    "border-green-500 text-green-400"
                  }`}
                >
                  {vivienda.estado_ocupacion === 'ocupada' ? '🏠 Ocupada por Propietario' : 
                   vivienda.estado_ocupacion === 'alquilada' ? '💰 Alquilada a Inquilino' : '✅ Disponible'}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Información adicional de cobranza real */}
          {vivienda.cobranza_real && vivienda.cobranza_real !== parseFloat(vivienda.tarifa_base_expensas) && (
            <div className="mt-4 p-3 bg-[#1a1a1a] rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-400">Cobranza Especial</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">
                Esta unidad tiene una cobranza diferente: <strong>Bs {vivienda.cobranza_real}</strong>
                {vivienda.estado_ocupacion === 'alquilada' ? ' (monto de alquiler al inquilino)' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="flex flex-wrap gap-6 items-center mb-8 p-6 bg-[#2a2a2a] rounded-lg">
          <div className="flex-1 min-w-[400px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar residentes por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-base bg-[#1a1a1a] border-[#3a3a3a] text-white"
              />
            </div>
          </div>
          
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[220px] py-3 text-base bg-[#1a1a1a] border-[#3a3a3a] text-white">
              <SelectValue placeholder="Tipo de residente" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              <SelectItem value="todos" className="text-white hover:bg-[#3a3a3a]">Todos</SelectItem>
              <SelectItem value="propietario" className="text-white hover:bg-[#3a3a3a]">Propietarios</SelectItem>
              <SelectItem value="inquilino" className="text-white hover:bg-[#3a3a3a]">Inquilinos</SelectItem>
              <SelectItem value="familiar" className="text-white hover:bg-[#3a3a3a]">Familiares</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 py-3 px-6 text-base"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar Residente
          </Button>
        </div>

        {/* Formulario para agregar residente */}
        {showAddForm && (
          <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              Nuevo Residente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={nuevoResidente.nombre}
                  onChange={(e) => setNuevoResidente(prev => ({ ...prev, nombre: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                  placeholder="Nombre del residente"
                />
              </div>
              
              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={nuevoResidente.apellido}
                  onChange={(e) => setNuevoResidente(prev => ({ ...prev, apellido: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                  placeholder="Apellido del residente"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={nuevoResidente.email}
                  onChange={(e) => setNuevoResidente(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                  placeholder="email@ejemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={nuevoResidente.telefono}
                  onChange={(e) => setNuevoResidente(prev => ({ ...prev, telefono: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                  placeholder="+591 70123456"
                />
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo de Residente *</Label>
                <Select 
                  value={nuevoResidente.tipo} 
                  onValueChange={(value: 'propietario' | 'inquilino' | 'familiar') => 
                    setNuevoResidente(prev => ({ ...prev, tipo: value }))
                  }
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-[#3a3a3a] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
                    <SelectItem value="propietario" className="text-white hover:bg-[#3a3a3a]">Propietario</SelectItem>
                    <SelectItem value="inquilino" className="text-white hover:bg-[#3a3a3a]">Inquilino</SelectItem>
                    <SelectItem value="familiar" className="text-white hover:bg-[#3a3a3a]">Familiar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={nuevoResidente.fecha_inicio}
                  onChange={(e) => setNuevoResidente(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                  className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                />
              </div>
              
              {nuevoResidente.tipo === 'inquilino' && (
                <>
                  <div>
                    <Label htmlFor="fecha_fin">Fecha de Fin (Contrato)</Label>
                    <Input
                      id="fecha_fin"
                      type="date"
                      value={nuevoResidente.fecha_fin}
                      onChange={(e) => setNuevoResidente(prev => ({ ...prev, fecha_fin: e.target.value }))}
                      className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="monto_alquiler">Monto de Alquiler (Bs)</Label>
                    <Input
                      id="monto_alquiler"
                      type="number"
                      step="0.01"
                      value={nuevoResidente.monto_alquiler}
                      onChange={(e) => setNuevoResidente(prev => ({ ...prev, monto_alquiler: e.target.value }))}
                      className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                      placeholder="0.00 Bs"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={nuevoResidente.observaciones}
                onChange={(e) => setNuevoResidente(prev => ({ ...prev, observaciones: e.target.value }))}
                className="bg-[#1a1a1a] border-[#3a3a3a] text-white"
                placeholder="Información adicional..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddResidente}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Agregar Residente
              </Button>
              <Button
                onClick={() => setShowAddForm(false)}
                variant="outline"
                className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a]"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de residentes */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Residentes Actuales ({filteredResidentes.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">Cargando residentes...</span>
            </div>
          ) : filteredResidentes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron residentes</p>
              {searchTerm && <p className="text-sm">Intenta con otros términos de búsqueda</p>}
            </div>
          ) : (
            <div className="bg-[#2a2a2a] rounded-lg overflow-x-auto overflow-y-hidden w-full">
              <Table className="w-full min-w-[1400px]">
                <TableHeader>
                  <TableRow className="border-[#3a3a3a] hover:bg-[#3a3a3a] h-20">
                    <TableHead className="text-gray-300 text-xl font-bold px-8 w-[350px]">Residente</TableHead>
                    <TableHead className="text-gray-300 text-xl font-bold px-8 w-[180px]">Tipo</TableHead>
                    <TableHead className="text-gray-300 text-xl font-bold px-8 w-[250px]">Contacto</TableHead>
                    <TableHead className="text-gray-300 text-xl font-bold px-8 w-[200px]">Período</TableHead>
                    <TableHead className="text-gray-300 text-xl font-bold px-8 w-[150px]">Monto</TableHead>
                    <TableHead className="text-gray-300 text-xl font-bold px-8 w-[150px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidentes.map((residente) => (
                    <TableRow key={residente.id} className="border-[#3a3a3a] hover:bg-[#3a3a3a] h-24">
                      <TableCell className="px-8 py-4 w-[350px]">
                        <div className="space-y-2">
                          <p className="font-bold text-white text-xl">
                            {residente.nombre} {residente.apellido}
                          </p>
                          <p className="text-lg text-gray-400 flex items-center gap-3">
                            <Mail className="w-6 h-6" />
                            {residente.email}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="px-8 py-4 w-[180px]">
                        <Badge 
                          variant="outline"
                          className={`text-lg py-3 px-6 font-bold ${
                            residente.tipo === 'propietario' ? "border-blue-500 text-blue-400" :
                            residente.tipo === 'inquilino' ? "border-yellow-500 text-yellow-400" :
                            "border-gray-500 text-gray-400"
                          }`}
                        >
                          {residente.tipo === 'propietario' ? '👑 Propietario' :
                           residente.tipo === 'inquilino' ? '🏠 Inquilino' : '👨‍👩‍👧‍👦 Familiar'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-gray-300 px-8 py-4 w-[250px]">
                        {residente.telefono && (
                          <div className="flex items-center gap-3 text-lg">
                            <Phone className="w-6 h-6" />
                            {residente.telefono}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-gray-300 px-8 py-4 w-[200px]">
                        <div className="text-lg space-y-1">
                          {residente.fecha_inicio && (
                            <div className="flex items-center gap-3">
                              <Calendar className="w-6 h-6" />
                              {new Date(residente.fecha_inicio).toLocaleDateString()}
                            </div>
                          )}
                          {residente.fecha_fin && (
                            <div className="text-base text-gray-500">
                              Hasta: {new Date(residente.fecha_fin).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-gray-300 px-8 py-4 w-[150px]">
                        {residente.monto_alquiler && (
                          <div className="flex items-center gap-3 font-bold text-lg">
                            <Coins className="w-6 h-6 text-green-500" />
                            Bs {residente.monto_alquiler}
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell className="px-8 py-4 w-[150px]">
                        <div className="flex gap-4">
                          <Button
                            size="lg"
                            variant="ghost"
                            className="text-blue-400 hover:text-blue-300 hover:bg-[#3a3a3a] p-4"
                          >
                            <Edit className="w-7 h-7" />
                          </Button>
                          <Button
                            size="lg"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-[#3a3a3a] p-4"
                            onClick={() => handleRemoveResidente(residente.id)}
                          >
                            <UserX className="w-7 h-7" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DialogFooter className="mt-10 pt-6 border-t border-[#3a3a3a]">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-[#3a3a3a] text-white hover:bg-[#3a3a3a] py-3 px-8 text-base"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}