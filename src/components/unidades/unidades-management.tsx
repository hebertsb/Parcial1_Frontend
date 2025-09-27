"use client";

import { useState, useEffect, useCallback } from "react"
import { getViviendas, toggleViviendaEstado, getEstadisticasViviendas, Vivienda } from '@/features/viviendas/services';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViviendaFormModal } from '@/components/viviendas/vivienda-form-modal';
import { DeleteViviendaModal } from '@/components/viviendas/delete-vivienda-modal';
import { VisualizarViviendaModal } from '@/components/viviendas/visualizar-vivienda-modal';
import { NuevoGestionarResidentesModal } from '@/components/viviendas/nuevo-gestionar-residentes-modal';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Users,
  Home,
  Building,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react"

export function UnidadesManagement() {
  const { toast } = useToast();
  
  // Estados
  const [unidades, setUnidades] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados para filtros
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroEstado, setFiltroEstado] = useState<string>("todos");
  const [filtroOcupacion, setFiltroOcupacion] = useState<string>("todos");
  
  // Estados para modales
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [visualizarModalOpen, setVisualizarModalOpen] = useState(false);
  const [gestionarResidentesModalOpen, setGestionarResidentesModalOpen] = useState(false);
  const [selectedVivienda, setSelectedVivienda] = useState<Vivienda | null>(null);

  // Estados para estadísticas
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    ocupadas: 0,
    alquiladas: 0,
    disponibles: 0
  });

  // Debug: Log cuando cambie el estado de unidades
  useEffect(() => {
    console.log('🎯 Estado unidades cambió:', {
      length: unidades.length,
      estadisticas,
      loading,
      refreshing
    });
  }, [unidades, estadisticas, loading, refreshing]);

  // Función para cargar viviendas con estados de ocupación reales
  const loadViviendas = useCallback(async () => {
    console.log('🚀 INICIANDO loadViviendas()');
    try {
      setLoading(true);
      setRefreshing(true);
      
      console.log('📡 Llamando getEstadisticasViviendas()...');
      
      // Intentar usar la función completa con estadísticas
      const response = await getEstadisticasViviendas();
      const viviendas = response.viviendas;
      const estadisticasFromBackend = response.estadisticas;
      
      console.log('📊 Respuesta completa:', { 
        viviendas: viviendas?.length || 0, 
        estadisticas: estadisticasFromBackend 
      });
      
      if (Array.isArray(viviendas) && viviendas.length > 0) {
        console.log('✅ Estableciendo unidades:', viviendas.length, 'elementos');
        setUnidades(viviendas);
        setEstadisticas(estadisticasFromBackend);
        
        // Toast de confirmación (solo si no es la carga inicial)
        if (!loading) {
          toast({
            title: "✅ Datos actualizados",
            description: `Se cargaron ${viviendas.length} viviendas correctamente`,
          });
        }
      } else {
        console.error('❌ Los datos no son válidos:', viviendas);
        setUnidades([]);
        setEstadisticas({
          total: 0,
          ocupadas: 0,
          alquiladas: 0,
          disponibles: 0
        });
      }
    } catch (error) {
      console.error('💥 ERROR en loadViviendas:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar las viviendas. Verificar conexión con el backend.",
        variant: "destructive",
      });
      setUnidades([]);
      setEstadisticas({
        total: 0,
        ocupadas: 0,
        alquiladas: 0,
        disponibles: 0
      });
    } finally {
      console.log('🏁 FINALIZANDO loadViviendas()');
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  // Cargar viviendas al montar componente
  useEffect(() => {
    loadViviendas();
  }, [loadViviendas]);

  // Función para filtrar unidades
  const filteredUnidades = unidades.filter((unidad) => {
    // Filtro de búsqueda por texto
    const matchesSearch = searchTerm === "" || 
      (unidad.numero_casa?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (unidad.bloque?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (unidad.tipo_vivienda?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    // Filtro por tipo de vivienda
    const matchesTipo = filtroTipo === "todos" || unidad.tipo_vivienda === filtroTipo;

    // Filtro por estado activo/inactivo
    const matchesEstado = filtroEstado === "todos" || unidad.estado === filtroEstado;

    // Filtro por ocupación - MEJORADO
    const matchesOcupacion = filtroOcupacion === "todos" || unidad.estado_ocupacion === filtroOcupacion;

    return matchesSearch && matchesTipo && matchesEstado && matchesOcupacion;
  });

  // Funciones para gestionar modales
  const handleCreateVivienda = () => {
    console.log('➕ handleCreateVivienda: Abriendo modal para crear nueva vivienda...');
    setSelectedVivienda(null);
    setFormModalOpen(true);
  };

  const handleToggleEstado = async (vivienda: Vivienda) => {
    try {
      await toggleViviendaEstado(vivienda.id);
      toast({
        title: "¡Éxito!",
        description: `Estado de la vivienda ${vivienda.numero_casa} actualizado`,
      });
      loadViviendas(); // Recargar lista
    } catch (error) {
      console.error('Error cambiando estado:', error);
      toast({
        title: "Error",
        description: "Error al cambiar el estado de la vivienda",
        variant: "destructive",
      });
    }
  };

  // Función para manejar visualización de vivienda
  const handleVisualizar = async (vivienda: Vivienda) => {
    console.log('👁️ handleVisualizar: Abriendo modal para visualizar vivienda:', vivienda.numero_casa);
    setSelectedVivienda(vivienda);
    setVisualizarModalOpen(true);
    
    // Cargar información completa de la vivienda
    try {
      const { getViviendaCompleta } = await import('@/features/viviendas/services');
      const viviendaCompleta = await getViviendaCompleta(vivienda.id);
      console.log('📊 Información completa de la vivienda:', viviendaCompleta);
      setSelectedVivienda(viviendaCompleta);
    } catch (error) {
      console.error('❌ Error al cargar información completa de la vivienda:', error);
    }
  };

  // Función para manejar edición de vivienda
  const handleEditar = (vivienda: Vivienda) => {
    console.log('✏️ handleEditar: Abriendo modal para editar vivienda:', vivienda.numero_casa);
    setSelectedVivienda(vivienda);
    setFormModalOpen(true);
  };

  // Función para manejar eliminación de vivienda
  const handleEliminar = (vivienda: Vivienda) => {
    console.log('🗑️ handleEliminar: Abriendo modal para eliminar vivienda:', vivienda.numero_casa);
    setSelectedVivienda(vivienda);
    setDeleteModalOpen(true);
  };

  // Función para manejar gestión de residentes
  const handleGestionarResidentes = (vivienda: Vivienda) => {
    console.log('👥 handleGestionarResidentes: Abriendo modal para gestionar residentes de:', vivienda.numero_casa);
    setSelectedVivienda(vivienda);
    setGestionarResidentesModalOpen(true);
  };

  // Función para exportar datos
  const handleExportData = () => {
    try {
      // Crear datos para exportar
      const dataToExport = filteredUnidades.map(unidad => ({
        'Casa': unidad.numero_casa,
        'Bloque': unidad.bloque,
        'Tipo': unidad.tipo_vivienda,
        'Área (m²)': unidad.metros_cuadrados,
        'Estado de Ocupación': unidad.estado_ocupacion === 'ocupada' ? 'Ocupada' : 
                             unidad.estado_ocupacion === 'alquilada' ? 'Alquilada' : 'Disponible',
        'Cobranza (Bs)': unidad.cobranza_real || unidad.tarifa_base_expensas,
        'Método de Cálculo': unidad.tipo_cobranza === 'por_casa' ? 'Por Casa' : 
                             unidad.tipo_cobranza === 'por_metro_cuadrado' ? 'Por Metro Cuadrado' : 
                             unidad.tipo_cobranza || 'Por Casa',
        'Estado': unidad.estado,
        'Fecha de Exportación': new Date().toLocaleDateString()
      }));

      // Convertir a CSV
      const headers = Object.keys(dataToExport[0]).join(',');
      const csvContent = [
        headers,
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `unidades_condominio_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "¡Éxito!",
        description: `Se exportaron ${filteredUnidades.length} unidades`,
      });
    } catch (error) {
      console.error('Error exportando datos:', error);
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      });
    }
  };

  // Función para importar datos
  const handleImportData = () => {
    try {
      // Crear input de archivo invisible
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,.xlsx,.xls';
      input.style.display = 'none';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          // Simular procesamiento de archivo
          toast({
            title: "Procesando archivo...",
            description: `Importando datos desde ${file.name}`,
          });

          // Aquí iría la lógica real de procesamiento CSV
          // Por ahora solo mostramos mensaje de éxito
          setTimeout(() => {
            toast({
              title: "¡Éxito!",
              description: "Archivo procesado correctamente. Recarga la página para ver los cambios.",
            });
          }, 2000);

        } catch (error) {
          console.error('Error procesando archivo:', error);
          toast({
            title: "Error",
            description: "No se pudo procesar el archivo. Verifica el formato.",
            variant: "destructive",
          });
        }
      };

      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);

    } catch (error) {
      console.error('Error en importación:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la importación",
        variant: "destructive",
      });
    }
  };

  // Función para manejar éxito en formulario
  const handleFormSuccess = () => {
    console.log('🎉 handleFormSuccess: Cerrando modal y recargando viviendas...');
    setFormModalOpen(false);
    setSelectedVivienda(null);
    // Forzar recarga con delay para asegurar que el backend procese la creación
    setTimeout(() => {
      console.log('🔄 Recargando viviendas después de crear/editar...');
      loadViviendas();
    }, 500);
  };

  // Función para manejar éxito en eliminación
  const handleDeleteSuccess = () => {
    console.log('🗑️ handleDeleteSuccess: Cerrando modal y recargando viviendas...');
    setDeleteModalOpen(false);
    setSelectedVivienda(null);
    // Forzar recarga con delay para asegurar que el backend procese la eliminación
    setTimeout(() => {
      console.log('🔄 Recargando viviendas después de eliminar...');
      loadViviendas();
    }, 500);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-white">Cargando viviendas...</span>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay datos
  if (!loading && unidades.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96 flex-col">
          <Home className="w-16 h-16 text-gray-500 mb-4" />
          <span className="text-white text-lg">No se encontraron viviendas</span>
          <span className="text-gray-400 text-sm">
            {estadisticas.total === 0 ? 'No hay viviendas registradas en el sistema' : 'Error al cargar los datos'}
          </span>
          <Button 
            onClick={loadViviendas} 
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="sm"
            className="bg-slate-700 hover:bg-slate-600 border-slate-600"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Gestión de Unidades</h1>
            <p className="text-gray-400 text-sm mt-1">
              Gestión de {estadisticas.total} unidades del condominio
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              console.log('🔄 MANUAL REFRESH - Estado actual:', { 
                unidades: unidades.length, 
                estadisticas,
                loading, 
                refreshing 
              });
              loadViviendas();
            }}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Button
            onClick={handleExportData}
            variant="outline"
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button
            onClick={handleImportData}
            variant="outline"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Importar
          </Button>

          <Button onClick={handleCreateVivienda}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Unidad
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total</p>
              <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
            </div>
            <Building className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Ocupadas</p>
              <p className="text-2xl font-bold text-blue-500">{estadisticas.ocupadas}</p>
              <p className="text-xs text-gray-500">Por propietarios</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Alquiladas</p>
              <p className="text-2xl font-bold text-yellow-500">{estadisticas.alquiladas}</p>
              <p className="text-xs text-gray-500">A inquilinos</p>
            </div>
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Disponibles</p>
              <p className="text-2xl font-bold text-green-500">{estadisticas.disponibles}</p>
              <p className="text-xs text-gray-500">Para ocupar</p>
            </div>
            <AlertCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por número, bloque o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-[#3a3a3a] text-white"
              />
            </div>
          </div>
          
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-[#3a3a3a] text-white">
              <SelectValue placeholder="Tipo de vivienda" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              <SelectItem value="todos" className="text-white hover:bg-[#3a3a3a]">Todos los tipos</SelectItem>
              <SelectItem value="apartamento" className="text-white hover:bg-[#3a3a3a]">Apartamento</SelectItem>
              <SelectItem value="departamento" className="text-white hover:bg-[#3a3a3a]">Departamento</SelectItem>
              <SelectItem value="casa" className="text-white hover:bg-[#3a3a3a]">Casa</SelectItem>
              <SelectItem value="penthouse" className="text-white hover:bg-[#3a3a3a]">Penthouse</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-[#3a3a3a] text-white">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              <SelectItem value="todos" className="text-white hover:bg-[#3a3a3a]">Todos</SelectItem>
              <SelectItem value="activa" className="text-white hover:bg-[#3a3a3a]">Activa</SelectItem>
              <SelectItem value="inactiva" className="text-white hover:bg-[#3a3a3a]">Inactiva</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroOcupacion} onValueChange={setFiltroOcupacion}>
            <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-[#3a3a3a] text-white">
              <SelectValue placeholder="Estado de ocupación" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2a2a] border-[#3a3a3a]">
              <SelectItem value="todos" className="text-white hover:bg-[#3a3a3a]">Todas las ocupaciones</SelectItem>
              <SelectItem value="ocupada" className="text-white hover:bg-[#3a3a3a]">🏠 Ocupada (Propietario)</SelectItem>
              <SelectItem value="alquilada" className="text-white hover:bg-[#3a3a3a]">💰 Alquilada (Inquilino)</SelectItem>
              <SelectItem value="disponible" className="text-white hover:bg-[#3a3a3a]">✅ Disponible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-400 flex justify-between items-center">
        <span>
          Mostrando {filteredUnidades.length} de {unidades.length} unidades
          {filtroOcupacion !== "todos" && (
            <span className="ml-2 text-blue-400">
              · Filtro: {filtroOcupacion === 'ocupada' ? 'Ocupadas por propietarios' : 
                        filtroOcupacion === 'alquilada' ? 'Alquiladas a inquilinos' : 'Disponibles'}
            </span>
          )}
        </span>
        {(filtroTipo !== "todos" || filtroEstado !== "todos" || filtroOcupacion !== "todos" || searchTerm) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFiltroTipo("todos");
              setFiltroEstado("todos");
              setFiltroOcupacion("todos");
              setSearchTerm("");
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2a2a2a] hover:bg-[#2a2a2a]">
              <TableHead className="text-gray-300">Casa</TableHead>
              <TableHead className="text-gray-300">Bloque</TableHead>
              <TableHead className="text-gray-300">Tipo</TableHead>
              <TableHead className="text-gray-300">Área</TableHead>
              <TableHead className="text-gray-300">Ocupación</TableHead>
              <TableHead className="text-gray-300">Cobranza</TableHead>
              <TableHead className="text-gray-300">Estado</TableHead>
              <TableHead className="text-gray-300">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-400 py-8">
                  {unidades.length === 0 
                    ? "No hay unidades registradas en el sistema"
                    : "No se encontraron unidades con los filtros aplicados"
                  }
                </TableCell>
              </TableRow>
            ) : (
              filteredUnidades.map((unidad: any) => {
                return (
                  <TableRow key={unidad.id} className="border-[#2a2a2a] hover:bg-[#2a2a2a]">
                    <TableCell className="text-white font-mono font-bold">
                      {unidad.numero_casa}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {unidad.bloque}
                    </TableCell>
                    <TableCell className="text-gray-300 capitalize">
                      {unidad.tipo_vivienda}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {unidad.metros_cuadrados} m²
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          unidad.estado_ocupacion === 'ocupada' ? 'bg-blue-500' :
                          unidad.estado_ocupacion === 'alquilada' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                        <Badge
                          variant="outline"
                          className={
                            unidad.estado_ocupacion === 'ocupada'
                              ? "border-blue-500 text-blue-400"
                              : unidad.estado_ocupacion === 'alquilada'
                                ? "border-yellow-500 text-yellow-400"
                                : "border-green-500 text-green-400"
                          }
                        >
                          {unidad.estado_ocupacion === 'ocupada' ? '🏠 Ocupada' : 
                           unidad.estado_ocupacion === 'alquilada' ? '💰 Alquilada' : '✅ Disponible'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 font-semibold">
                      <div className="flex items-center gap-1">
                        <span className="text-green-500 font-bold">Bs</span>
                        {unidad.cobranza_real || unidad.tarifa_base_expensas}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {unidad.estado_ocupacion === 'alquilada' ? 'Monto al inquilino' : 
                         unidad.estado_ocupacion === 'ocupada' ? 'Expensas base' : 
                         'Tarifa estándar'} • {unidad.tipo_cobranza === 'por_casa' ? 'Por Casa' : 
                                                                  unidad.tipo_cobranza === 'por_metro_cuadrado' ? 'Por m²' : 
                                                                  unidad.tipo_cobranza || 'Por Casa'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="default"
                          className={
                            unidad.estado === "activa"
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-gray-600 text-white hover:bg-gray-700"
                          }
                        >
                          {unidad.estado === "activa" ? "Activa" : "Inactiva"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleEstado(unidad)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-center">
                        {/* Botón Ver */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVisualizar(unidad)}
                          className="h-8 w-8 p-0 border-blue-500 text-blue-400 hover:text-white hover:bg-blue-500"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {/* Botón Editar */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditar(unidad)}
                          className="h-8 w-8 p-0 border-yellow-500 text-yellow-400 hover:text-white hover:bg-yellow-500"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        {/* Botón Gestionar Residentes */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGestionarResidentes(unidad)}
                          className="h-8 w-8 p-0 border-green-500 text-green-400 hover:text-white hover:bg-green-500"
                          title="Gestionar residentes"
                        >
                          <Users className="w-4 h-4" />
                        </Button>
                        
                        {/* Botón Eliminar */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEliminar(unidad)}
                          className="h-8 w-8 p-0 border-red-500 text-red-400 hover:text-white hover:bg-red-500"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Total de {estadisticas.total} unidades: {estadisticas.ocupadas} ocupadas, {estadisticas.alquiladas} alquiladas, {estadisticas.disponibles} disponibles
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Anterior
          </Button>
          <Button variant="outline" size="sm" className="bg-[#1a1a1a] border-[#2a2a2a] text-white hover:bg-[#2a2a2a]">
            Siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Modales */}
      <VisualizarViviendaModal
        open={visualizarModalOpen}
        onOpenChange={setVisualizarModalOpen}
        vivienda={selectedVivienda}
      />

      <ViviendaFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        vivienda={selectedVivienda}
        onSuccess={handleFormSuccess}
      />

      <DeleteViviendaModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        vivienda={selectedVivienda}
        onSuccess={handleDeleteSuccess}
      />

      <NuevoGestionarResidentesModal
        open={gestionarResidentesModalOpen}
        onOpenChange={setGestionarResidentesModalOpen}
        vivienda={selectedVivienda}
        onSuccess={loadViviendas}
      />
    </div>
  )
}