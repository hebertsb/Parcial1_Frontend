"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vivienda, CreateViviendaRequest, UpdateViviendaRequest, createVivienda, updateVivienda } from '@/features/viviendas/services';
import { useToast } from '@/hooks/use-toast';

interface ViviendaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vivienda?: Vivienda | null;
  onSuccess: () => void;
}

export function ViviendaFormModal({ open, onOpenChange, vivienda, onSuccess }: ViviendaFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateViviendaRequest>({
    numero_casa: '',
    bloque: '',
    tipo_vivienda: '',
    metros_cuadrados: '',
    tarifa_base_expensas: '',
    tipo_cobranza: 'por_casa',
    estado: 'activa'
  });

  // Cargar datos de la vivienda cuando se edita
  useEffect(() => {
    if (vivienda) {
      setFormData({
        numero_casa: vivienda.numero_casa,
        bloque: vivienda.bloque,
        tipo_vivienda: vivienda.tipo_vivienda,
        metros_cuadrados: vivienda.metros_cuadrados.toString(),
        tarifa_base_expensas: vivienda.tarifa_base_expensas.toString(),
        tipo_cobranza: vivienda.tipo_cobranza || 'por_casa',
        estado: vivienda.estado
      });
    } else {
      // Reset form for new vivienda
      setFormData({
        numero_casa: '',
        bloque: '',
        tipo_vivienda: '',
        metros_cuadrados: '',
        tarifa_base_expensas: '',
        tipo_cobranza: 'por_casa',
        estado: 'activa'
      });
    }
  }, [vivienda, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (vivienda) {
        // Actualizar vivienda existente
        await updateVivienda(vivienda.id, formData);
        toast({
          title: "¡Éxito!",
          description: "Vivienda actualizada correctamente",
        });
      } else {
        // Crear nueva vivienda
        await createVivienda(formData);
        toast({
          title: "¡Éxito!",
          description: "Vivienda creada correctamente",
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al procesar vivienda:', error);
      toast({
        title: "Error",
        description: vivienda ? "Error al actualizar la vivienda" : "Error al crear la vivienda",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateViviendaRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isEditing = !!vivienda;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Vivienda' : 'Nueva Vivienda'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifica los datos de la vivienda existente.' 
              : 'Completa los datos para crear una nueva vivienda.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_casa">Número de Casa</Label>
              <Input
                id="numero_casa"
                value={formData.numero_casa}
                onChange={(e) => handleInputChange('numero_casa', e.target.value)}
                placeholder="ej: 101A"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloque">Bloque</Label>
              <Input
                id="bloque"
                value={formData.bloque}
                onChange={(e) => handleInputChange('bloque', e.target.value)}
                placeholder="ej: A, B, C"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_vivienda">Tipo de Vivienda</Label>
              <Select 
                value={formData.tipo_vivienda} 
                onValueChange={(value) => handleInputChange('tipo_vivienda', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="departamento">Departamento</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metros_cuadrados">Metros Cuadrados</Label>
              <Input
                id="metros_cuadrados"
                value={formData.metros_cuadrados}
                onChange={(e) => handleInputChange('metros_cuadrados', e.target.value)}
                placeholder="ej: 120.5"
                type="number"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tarifa_base_expensas">Tarifa Base Expensas (Bs)</Label>
              <Input
                id="tarifa_base_expensas"
                value={formData.tarifa_base_expensas}
                onChange={(e) => handleInputChange('tarifa_base_expensas', e.target.value)}
                placeholder="ej: 250.00 Bs"
                type="number"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_cobranza">Método de Cálculo de Tarifa</Label>
              <Select 
                value={formData.tipo_cobranza} 
                onValueChange={(value) => handleInputChange('tipo_cobranza', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método de cálculo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="por_casa">Por Casa (Tarifa Fija)</SelectItem>
                  <SelectItem value="por_metro_cuadrado">Por Metro Cuadrado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="inactiva">Inactiva</SelectItem>
                <SelectItem value="mantenimiento">En Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (isEditing ? 'Actualizando...' : 'Creando...') : (isEditing ? 'Actualizar' : 'Crear')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}