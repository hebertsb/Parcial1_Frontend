/**
 * Componente para mostrar el estado de conexión con el backend
 */

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Wifi, WifiOff } from "lucide-react";

interface BackendStatusProps {
  isConnected: boolean;
  lastUpdate?: Date;
  endpoint?: string;
}

export function BackendStatus({ 
  isConnected, 
  lastUpdate,
  endpoint = "Backend Django"
}: BackendStatusProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {endpoint} Conectado
          </Badge>
          {lastUpdate && (
            <span className="text-xs text-gray-500">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-amber-500" />
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Modo Desarrollo (Backend Desconectado)
          </Badge>
        </>
      )}
    </div>
  );
}