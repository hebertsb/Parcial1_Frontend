/**
 * Componente para campo de foto con enrolamiento facial
 * Reutilizable en formularios de propietarios e inquilinos
 */

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, X, Eye, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FotoFieldProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  preview?: string | null;
  onPreviewChange?: (preview: string | null) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  showFacialInfo?: boolean;
}

export function FotoField({
  value,
  onChange,
  preview,
  onPreviewChange,
  disabled = false,
  required = false,
  className = "",
  showFacialInfo = true
}: FotoFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Tipo de archivo no válido. Use JPG, PNG, BMP o GIF.');
      return;
    }

    // Validar tamaño (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onPreviewChange?.(result);
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    onChange(null);
    onPreviewChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Area */}
      <div 
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? handleUploadClick : undefined}
      >
        {preview ? (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt="Vista previa"
              className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePhoto();
              }}
              disabled={disabled}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {required ? 'Foto requerida' : 'Subir foto'}
              </p>
              <p className="text-xs text-gray-500">
                Arrastre una imagen aquí o haga clic para seleccionar
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, BMP, GIF (máx. 5MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {!disabled && (
        <div className="flex justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
          >
            <Upload className="w-4 h-4 mr-2" />
            Subir Archivo
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTakePhoto}
          >
            <Camera className="w-4 h-4 mr-2" />
            Tomar Foto
          </Button>

          {preview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemovePhoto}
            >
              <X className="w-4 h-4 mr-2" />
              Quitar
            </Button>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/bmp,image/gif"
        capture="user" // Para dispositivos móviles, activa cámara frontal
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Facial Recognition Info */}
      {showFacialInfo && (
        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Reconocimiento Facial:</strong> Esta foto se utilizará para el sistema de 
            control de acceso biométrico. Asegúrese de que el rostro esté bien iluminado y 
            claramente visible.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default FotoField;