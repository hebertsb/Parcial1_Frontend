"use client";

import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Vivienda, deleteVivienda } from '@/features/viviendas/services';
import { useToast } from '@/hooks/use-toast';

interface DeleteViviendaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vivienda: Vivienda | null;
  onSuccess: () => void;
}

export function DeleteViviendaModal({ open, onOpenChange, vivienda, onSuccess }: DeleteViviendaModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!vivienda) return;
    
    setLoading(true);
    try {
      await deleteVivienda(vivienda.id);
      toast({
        title: "¡Éxito!",
        description: "Vivienda eliminada correctamente",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error al eliminar vivienda:', error);
      
      // Manejo específico para viviendas con residentes activos
      if (error?.errors?.error || error?.message?.includes('propietarios/inquilinos activos')) {
        toast({
          title: "No se puede eliminar",
          description: "Esta vivienda tiene propietarios o inquilinos activos. Debe desasignar primero a todos los residentes antes de eliminarla.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar la vivienda",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!vivienda) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la vivienda{' '}
            <strong>{vivienda.numero_casa}</strong> del bloque <strong>{vivienda.bloque}</strong>.
            <br /><br />
            <strong>Nota:</strong> Solo se pueden eliminar viviendas que no tengan propietarios o inquilinos activos asignados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}