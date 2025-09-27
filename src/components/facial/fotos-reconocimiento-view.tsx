'use client'

/**
 * Componente para mostrar las fotos de reconocimiento facial en el panel de admin
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Camera, Eye, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface FotosReconocimientoViewProps {
  fotosUrls?: string[];
  solicitudId: number;
  nombreSolicitante: string;
  tieneReconocimiento?: boolean;
}

export function FotosReconocimientoView({ 
  fotosUrls = [], 
  solicitudId, 
  nombreSolicitante,
  tieneReconocimiento = false 
}: FotosReconocimientoViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);

  const verFoto = (fotoUrl: string) => {
    setFotoSeleccionada(fotoUrl);
    setDialogOpen(true);
  };

  const descargarFoto = (fotoUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = fotoUrl;
    link.download = `foto_reconocimiento_${solicitudId}_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!fotosUrls || fotosUrls.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Reconocimiento Facial
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              Sin fotos
            </Badge>
          </CardTitle>
          <CardDescription>
            No se proporcionaron fotos para reconocimiento facial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No hay fotos disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Reconocimiento Facial
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              {fotosUrls.length} foto{fotosUrls.length > 1 ? 's' : ''}
            </Badge>
            {tieneReconocimiento && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                Procesado
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Fotos proporcionadas para el sistema de reconocimiento facial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {fotosUrls.map((fotoUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={fotoUrl}
                  alt={`Foto ${index + 1} de ${nombreSolicitante}`}
                  className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-75 transition-opacity"
                  onClick={() => verFoto(fotoUrl)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      descargarFoto(fotoUrl, index);
                    }}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
                <Badge className="absolute bottom-2 left-2 text-xs">
                  Foto {index + 1}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fotosUrls[0] && verFoto(fotosUrls[0])}
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver todas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para ver foto ampliada */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Foto de Reconocimiento Facial</DialogTitle>
            <DialogDescription>
              Foto proporcionada por {nombreSolicitante} para el sistema de reconocimiento facial
            </DialogDescription>
          </DialogHeader>
          
          {fotoSeleccionada && (
            <div className="space-y-4">
              <img
                src={fotoSeleccionada}
                alt="Foto ampliada"
                className="w-full max-h-96 object-contain rounded-lg border"
              />
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Solicitud #{solicitudId} • {nombreSolicitante}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const index = fotosUrls.findIndex(url => url === fotoSeleccionada);
                    descargarFoto(fotoSeleccionada, index);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FotosReconocimientoView;