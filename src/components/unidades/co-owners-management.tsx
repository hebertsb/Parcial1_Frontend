"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Phone, Mail, Calendar, Home, RefreshCw, Search } from "lucide-react"
import { apiClient } from '@/core/api/client'

interface PropietarioData {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  vivienda_info?: {
    numero_casa: string;
    bloque: string;
    tipo_vivienda: string;
  };
  tipo_tenencia: string;
  fecha_inicio?: string;
  estado?: string;
  persona_info?: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
  };
}

export function CoOwnersManagement() {
  const [propietarios, setPropietarios] = useState<PropietarioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cargarPropietarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/propiedades/');
      const data = (response.data as any)?.results || response.data || [];
      
      // Filtrar solo propietarios
      const propietariosList = data.filter((item: any) => 
        item.tipo_tenencia === 'propietario'
      );

      console.log('🏠 Propietarios cargados:', propietariosList);
      setPropietarios(propietariosList);

    } catch (err) {
      console.error('Error cargando propietarios:', err);
      setError('Error al cargar los propietarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPropietarios();
  }, []);

  const filteredPropietarios = propietarios.filter((propietario) => {
    const nombreCompleto = `${propietario.persona_info?.nombre || ''} ${propietario.persona_info?.apellido || ''}`.toLowerCase();
    const email = (propietario.persona_info?.email || '').toLowerCase();
    const unidad = `${propietario.vivienda_info?.bloque || ''}-${propietario.vivienda_info?.numero_casa || ''}`.toLowerCase();
    
    return searchTerm === "" || 
           nombreCompleto.includes(searchTerm.toLowerCase()) ||
           email.includes(searchTerm.toLowerCase()) ||
           unidad.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-white">Cargando propietarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-red-400 mb-4">{error}</div>
        <Button onClick={cargarPropietarios} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Propietarios</h2>
          <p className="text-gray-400">Administra los propietarios del condominio ({propietarios.length} registrados)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={cargarPropietarios} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nombre, email o unidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#111111] border-[#1f1f1f]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Propietarios</p>
                <p className="text-2xl font-bold text-white">{propietarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#1f1f1f]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/20">
                <Home className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Unidades con Propietario</p>
                <p className="text-2xl font-bold text-white">{propietarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111111] border-[#1f1f1f]">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Resultados</p>
                <p className="text-2xl font-bold text-white">{filteredPropietarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Propietarios */}
      {filteredPropietarios.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-white">
            {searchTerm ? 'No se encontraron resultados' : 'No hay propietarios registrados'}
          </h3>
          <p className="text-gray-400 mb-4">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los propietarios aparecerán aquí una vez registrados'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPropietarios.map((propietario) => (
            <Card key={propietario.id} className="bg-[#111111] border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {(propietario.persona_info?.nombre || '').charAt(0)}
                      {(propietario.persona_info?.apellido || '').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {propietario.persona_info?.nombre || 'Sin nombre'} {propietario.persona_info?.apellido || ''}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Home className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-gray-400">
                        {propietario.vivienda_info?.bloque || 'N/A'}-{propietario.vivienda_info?.numero_casa || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {propietario.persona_info?.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 truncate">{propietario.persona_info.email}</span>
                    </div>
                  )}
                  
                  {propietario.persona_info?.telefono && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{propietario.persona_info.telefono}</span>
                    </div>
                  )}

                  {propietario.fecha_inicio && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        Desde: {new Date(propietario.fecha_inicio).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/40">
                    Propietario
                  </Badge>
                  <div className="text-sm text-gray-400">
                    {propietario.vivienda_info?.tipo_vivienda || 'Casa'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}