"use client";

import { useState, useEffect } from "react";
import { Vivienda } from '@/features/viviendas/services';
import { apiClient } from '@/core/api/client';
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
  Plus,
  Search,
  CheckCircle,
  Coins,
  X,
  AlertCircle
} from "lucide-react";

interface NuevoGestionarResidentesModalProps {
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

export function NuevoGestionarResidentesModal({ 
  open, 
  onOpenChange, 
  vivienda, 
  onSuccess 
}: NuevoGestionarResidentesModalProps) {
  const { toast } = useToast();
  
  const [residentes, setResidentes] = useState<Residente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  
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

  useEffect(() => {
    if (open && vivienda) {
      loadResidentes();
    }
  }, [open, vivienda]);

  const loadResidentes = async () => {
    if (!vivienda) return;
    
    setLoading(true);
    try {
      const [propiedadesResponse, inquilinosResponse] = await Promise.all([
        apiClient.get('/propiedades/'),
        apiClient.get('/personas/inquilinos/')
      ]);

      const propiedades = (propiedadesResponse.data as any)?.results || propiedadesResponse.data || [];
      const inquilinos = (inquilinosResponse.data as any)?.results || inquilinosResponse.data || [];
      
      const propiedadesVivienda = propiedades.filter((prop: any) => 
        prop.vivienda === vivienda.id && prop.tipo_tenencia === 'propietario'
      );

      const inquilinosVivienda = inquilinos.filter((inq: any) => 
        inq.vivienda === vivienda.id || inq.vivienda_id === vivienda.id
      );

      const residentes: Residente[] = [];

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

      inquilinosVivienda.forEach((inq: any) => {
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
          observaciones: `Inquilino${inq.estado ? ` - Estado: ${inq.estado}` : ''}`
        });
      });

      setResidentes(residentes);
      
    } catch (error) {
      console.error('Error cargando residentes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los residentes",
        variant: "destructive",
      });
      setResidentes([]);
    } finally {
      setLoading(false);
    }
  };

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
      if (!nuevoResidente.nombre || !nuevoResidente.apellido || !nuevoResidente.email) {
        toast({
          title: "Error de validación",
          description: "Por favor completa los campos obligatorios",
          variant: "destructive",
        });
        return;
      }

      const newResidente: Residente = {
        id: Date.now(),
        ...nuevoResidente,
        estado: 'activo'
      };

      setResidentes(prev => [...prev, newResidente]);
      
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

  if (!vivienda || !open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="relative w-[98vw] max-w-[1800px] h-[95vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-slate-800 p-6 border-b border-slate-700">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-700">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Gestionar Residentes - Casa {vivienda.numero_casa}
              </h1>
              <p className="text-gray-400 mt-1 text-lg">
                Administra propietarios, inquilinos y familiares de {vivienda.bloque} - {vivienda.numero_casa}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Información de la Vivienda */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <Building className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Bloque</p>
                  <p className="text-2xl font-bold text-white">{vivienda.bloque}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <Home className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Tipo</p>
                  <p className="text-2xl font-bold text-white capitalize">{vivienda.tipo_vivienda}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Área</p>
                  <p className="text-2xl font-bold text-white">{vivienda.metros_cuadrados} m²</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Expensas</p>
                  <p className="text-2xl font-bold text-white">Bs {vivienda.tarifa_base_expensas}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Estado</p>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    vivienda.estado_ocupacion === 'ocupada' ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" :
                    vivienda.estado_ocupacion === 'alquilada' ? "bg-orange-500/20 text-orange-300 border border-orange-500/40" :
                    "bg-gray-500/20 text-gray-300 border border-gray-500/40"
                  }`}>
                    {vivienda.estado_ocupacion === 'ocupada' ? '🏠 Ocupada' : 
                     vivienda.estado_ocupacion === 'alquilada' ? '💰 Alquilada' : '✅ Disponible'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cobranza Especial */}
          {vivienda.cobranza_real && vivienda.cobranza_real !== parseFloat(vivienda.tarifa_base_expensas) && (
            <div className="bg-slate-700/50 rounded-xl p-4 border border-orange-400/30">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="text-orange-400 font-semibold">Cobranza Especial</p>
                  <p className="text-gray-300">
                    Esta unidad tiene una cobranza diferente: <strong>Bs {vivienda.cobranza_real}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Controles */}
          <div className="flex flex-wrap gap-4 items-center bg-slate-800/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar residentes por nombre, apellido o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="propietario">Propietarios</option>
              <option value="inquilino">Inquilinos</option>
              <option value="familiar">Familiares</option>
            </select>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Agregar Residente
            </button>
          </div>

          {/* Formulario de Agregar */}
          {showAddForm && (
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-blue-400" />
                Nuevo Residente
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={nuevoResidente.nombre}
                    onChange={(e) => setNuevoResidente(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del residente"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Apellido *</label>
                  <input
                    type="text"
                    value={nuevoResidente.apellido}
                    onChange={(e) => setNuevoResidente(prev => ({ ...prev, apellido: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Apellido del residente"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Email *</label>
                  <input
                    type="email"
                    value={nuevoResidente.email}
                    onChange={(e) => setNuevoResidente(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@ejemplo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Teléfono</label>
                  <input
                    type="text"
                    value={nuevoResidente.telefono}
                    onChange={(e) => setNuevoResidente(prev => ({ ...prev, telefono: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+591 70123456"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Tipo *</label>
                  <select
                    value={nuevoResidente.tipo}
                    onChange={(e) => setNuevoResidente(prev => ({ ...prev, tipo: e.target.value as 'propietario' | 'inquilino' | 'familiar' }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="propietario">Propietario</option>
                    <option value="inquilino">Inquilino</option>
                    <option value="familiar">Familiar</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Fecha de Inicio</label>
                  <input
                    type="date"
                    value={nuevoResidente.fecha_inicio}
                    onChange={(e) => setNuevoResidente(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {nuevoResidente.tipo === 'inquilino' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Fecha de Fin</label>
                      <input
                        type="date"
                        value={nuevoResidente.fecha_fin}
                        onChange={(e) => setNuevoResidente(prev => ({ ...prev, fecha_fin: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">Monto Alquiler (Bs)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={nuevoResidente.monto_alquiler}
                        onChange={(e) => setNuevoResidente(prev => ({ ...prev, monto_alquiler: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Observaciones</label>
                <textarea
                  value={nuevoResidente.observaciones}
                  onChange={(e) => setNuevoResidente(prev => ({ ...prev, observaciones: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Información adicional..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddResidente}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Agregar Residente
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg text-white font-semibold transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Lista de Residentes */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-xl font-bold text-white">
                Residentes Actuales ({filteredResidentes.length})
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-slate-300">Cargando residentes...</span>
              </div>
            ) : filteredResidentes.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No se encontraron residentes</p>
                {searchTerm && <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                  {/* Header */}
                  <div className="grid grid-cols-6 gap-4 p-4 bg-slate-700/50 border-b border-slate-600 font-semibold text-slate-300">
                    <div>Residente</div>
                    <div>Tipo</div>
                    <div>Contacto</div>
                    <div>Período</div>
                    <div>Monto</div>
                    <div>Acciones</div>
                  </div>
                  
                  {/* Rows */}
                  {filteredResidentes.map((residente, index) => (
                    <div key={residente.id} className={`grid grid-cols-6 gap-4 p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${index % 2 === 0 ? 'bg-slate-800/30' : ''}`}>
                      <div className="space-y-1">
                        <p className="font-bold text-white text-lg">
                          {residente.nombre} {residente.apellido}
                        </p>
                        <p className="text-slate-400 flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4" />
                          {residente.email}
                        </p>
                      </div>
                      
                      <div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                          residente.tipo === 'propietario' ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" :
                          residente.tipo === 'inquilino' ? "bg-orange-500/20 text-orange-300 border border-orange-500/40" :
                          "bg-gray-500/20 text-gray-300 border border-gray-500/40"
                        }`}>
                          {residente.tipo === 'propietario' ? '👑 Propietario' :
                           residente.tipo === 'inquilino' ? '🏠 Inquilino' : '👨‍👩‍👧‍👦 Familiar'}
                        </span>
                      </div>
                      
                      <div className="text-slate-300">
                        {residente.telefono && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4" />
                            {residente.telefono}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-slate-300 space-y-1">
                        {residente.fecha_inicio && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4" />
                            {new Date(residente.fecha_inicio).toLocaleDateString()}
                          </div>
                        )}
                        {residente.fecha_fin && (
                          <div className="text-xs text-slate-500">
                            Hasta: {new Date(residente.fecha_fin).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-slate-300">
                        {residente.monto_alquiler && (
                          <div className="flex items-center gap-2 font-bold text-blue-400">
                            <Coins className="w-4 h-4" />
                            Bs {residente.monto_alquiler}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleRemoveResidente(residente.id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 bg-slate-800/50">
          <div className="flex justify-end">
            <button
              onClick={() => onOpenChange(false)}
              className="px-8 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg text-white font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}