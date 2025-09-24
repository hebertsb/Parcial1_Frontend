'use client'

/**
 * Formulario para que propietarios registren inquilinos
 * Permite a propietarios agregar inquilinos a sus propiedades
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Home, 
  Calendar,
  Mail,
  Phone,
  Trash2,
  Edit,
  CheckCircle,
  UserPlus
} from 'lucide-react';

// Tipos para inquilinos
interface Inquilino {
  id?: number;
  nombres: string;
  apellidos: string;
  documento_identidad: string;
  email: string;
  telefono: string;
  fecha_nacimiento: string;
  genero: 'masculino' | 'femenino';
  fecha_inicio_contrato: string;
  fecha_fin_contrato?: string;
  deposito_garantia?: number;
  observaciones?: string;
  activo: boolean;
}

interface UnidadConInquilinos {
  numero_unidad: string;
  tipo_unidad: string;
  inquilinos: Inquilino[];
}

export function RegistroInquilinosForm() {
  // Mock data - En producción vendría del backend
  const [unidades, setUnidades] = useState<UnidadConInquilinos[]>([
    {
      numero_unidad: "101",
      tipo_unidad: "Departamento",
      inquilinos: [
        {
          id: 1,
          nombres: "María Elena",
          apellidos: "Rodríguez Silva",
          documento_identidad: "98765432",
          email: "maria.rodriguez@email.com",
          telefono: "78654321",
          fecha_nacimiento: "1988-07-15",
          genero: "femenino",
          fecha_inicio_contrato: "2025-01-01",
          fecha_fin_contrato: "2025-12-31",
          deposito_garantia: 3000,
          observaciones: "Contrato anual renovable",
          activo: true
        }
      ]
    },
    {
      numero_unidad: "102",
      tipo_unidad: "Departamento", 
      inquilinos: []
    }
  ]);

  const [selectedUnidad, setSelectedUnidad] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingInquilino, setEditingInquilino] = useState<Inquilino | null>(null);
  const [formData, setFormData] = useState<Inquilino>({
    nombres: '',
    apellidos: '',
    documento_identidad: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: 'masculino',
    fecha_inicio_contrato: '',
    fecha_fin_contrato: '',
    deposito_garantia: 0,
    observaciones: '',
    activo: true
  });

  const handleInputChange = (field: keyof Inquilino) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'deposito_garantia' ? Number(e.target.value) : e.target.value
    }));
  };

  const handleSelectChange = (field: keyof Inquilino) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUnidad) {
      alert('Seleccione una unidad');
      return;
    }

    // Simular guardado
    setUnidades(prev => prev.map(unidad => {
      if (unidad.numero_unidad === selectedUnidad) {
        if (editingInquilino) {
          // Editar inquilino existente
          return {
            ...unidad,
            inquilinos: unidad.inquilinos.map(inq => 
              inq.id === editingInquilino.id ? { ...formData, id: editingInquilino.id } : inq
            )
          };
        } else {
          // Agregar nuevo inquilino
          return {
            ...unidad,
            inquilinos: [...unidad.inquilinos, { ...formData, id: Date.now() }]
          };
        }
      }
      return unidad;
    }));

    // Limpiar formulario
    setFormData({
      nombres: '',
      apellidos: '',
      documento_identidad: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: 'masculino',
      fecha_inicio_contrato: '',
      fecha_fin_contrato: '',
      deposito_garantia: 0,
      observaciones: '',
      activo: true
    });
    setShowForm(false);
    setEditingInquilino(null);
  };

  const handleEdit = (inquilino: Inquilino) => {
    setFormData(inquilino);
    setEditingInquilino(inquilino);
    setShowForm(true);
  };

  const handleDelete = (unidadNumero: string, inquilinoId: number) => {
    if (confirm('¿Está seguro de eliminar este inquilino?')) {
      setUnidades(prev => prev.map(unidad => {
        if (unidad.numero_unidad === unidadNumero) {
          return {
            ...unidad,
            inquilinos: unidad.inquilinos.filter(inq => inq.id !== inquilinoId)
          };
        }
        return unidad;
      }));
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const getUnidadActual = () => {
    return unidades.find(u => u.numero_unidad === selectedUnidad);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de Inquilinos</h2>
        <p className="text-muted-foreground">
          Registre y gestione los inquilinos de sus propiedades
        </p>
      </div>

      {/* Selector de unidad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Seleccionar Unidad
          </CardTitle>
          <CardDescription>
            Seleccione la unidad para gestionar sus inquilinos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="unidad">Unidad</Label>
              <Select value={selectedUnidad} onValueChange={setSelectedUnidad}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar unidad" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((unidad) => (
                    <SelectItem key={unidad.numero_unidad} value={unidad.numero_unidad}>
                      {unidad.numero_unidad} - {unidad.tipo_unidad}
                      {unidad.inquilinos.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {unidad.inquilinos.length} inquilino(s)
                        </Badge>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedUnidad && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Inquilino
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de inquilinos */}
      {selectedUnidad && (
        <Card>
          <CardHeader>
            <CardTitle>
              Inquilinos de la Unidad {selectedUnidad}
            </CardTitle>
            <CardDescription>
              {getUnidadActual()?.inquilinos.length || 0} inquilino(s) registrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getUnidadActual()?.inquilinos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay inquilinos registrados en esta unidad</p>
                <Button variant="outline" className="mt-4" onClick={() => setShowForm(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrar Primer Inquilino
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getUnidadActual()?.inquilinos.map((inquilino) => (
                    <TableRow key={inquilino.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {inquilino.nombres} {inquilino.apellidos}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            CI: {inquilino.documento_identidad}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {inquilino.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {inquilino.telefono}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Inicio: {formatFecha(inquilino.fecha_inicio_contrato)}</div>
                          {inquilino.fecha_fin_contrato && (
                            <div>Fin: {formatFecha(inquilino.fecha_fin_contrato)}</div>
                          )}
                          {inquilino.deposito_garantia && (
                            <div>Depósito: Bs. {inquilino.deposito_garantia}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={inquilino.activo ? "default" : "secondary"}>
                          {inquilino.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(inquilino)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(selectedUnidad, inquilino.id!)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog para agregar/editar inquilino */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInquilino ? 'Editar Inquilino' : 'Registrar Nuevo Inquilino'}
            </DialogTitle>
            <DialogDescription>
              Complete la información del inquilino para la unidad {selectedUnidad}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={handleInputChange('nombres')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={handleInputChange('apellidos')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="documento_identidad">Documento de Identidad *</Label>
                <Input
                  id="documento_identidad"
                  value={formData.documento_identidad}
                  onChange={handleInputChange('documento_identidad')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange('telefono')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento *</Label>
                <Input
                  id="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange('fecha_nacimiento')}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="genero">Género *</Label>
                <Select value={formData.genero} onValueChange={handleSelectChange('genero')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="femenino">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Información del contrato */}
            <div className="space-y-4">
              <h4 className="font-semibold">Información del Contrato</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha_inicio_contrato">Fecha Inicio Contrato *</Label>
                  <Input
                    id="fecha_inicio_contrato"
                    type="date"
                    value={formData.fecha_inicio_contrato}
                    onChange={handleInputChange('fecha_inicio_contrato')}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="fecha_fin_contrato">Fecha Fin Contrato</Label>
                  <Input
                    id="fecha_fin_contrato"
                    type="date"
                    value={formData.fecha_fin_contrato}
                    onChange={handleInputChange('fecha_fin_contrato')}
                  />
                </div>
                
                <div>
                  <Label htmlFor="deposito_garantia">Depósito de Garantía (Bs.)</Label>
                  <Input
                    id="deposito_garantia"
                    type="number"
                    min="0"
                    value={formData.deposito_garantia}
                    onChange={handleInputChange('deposito_garantia')}
                  />
                </div>
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange('observaciones')}
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingInquilino ? 'Actualizar Inquilino' : 'Registrar Inquilino'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingInquilino(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RegistroInquilinosForm;