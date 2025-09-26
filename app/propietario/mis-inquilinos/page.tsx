/**
 * Página para que propietarios gestionen sus inquilinos
 * Solo accesible para usuarios con rol de propietario
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { GestionInquilinos } from '@/components/inquilinos/gestion-inquilinos';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function MisInquilinosPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      console.log('🔒 MisInquilinosPage: Verificando acceso para usuario:', user);
      console.log('🔒 MisInquilinosPage: Rol del usuario:', user.role);
      
      // Solo permitir acceso a propietarios
      if (user.role !== 'propietario' && user.role !== 'administrator') {
        console.log('❌ MisInquilinosPage: Acceso denegado - usuario no es propietario');
        // Redirigir al dashboard apropiado según el rol
        if (user.role === 'inquilino') {
          router.push('/inquilino/dashboard');
        } else {
          router.push('/dashboard');
        }
        return;
      }
      
      console.log('✅ MisInquilinosPage: Acceso permitido para propietario');
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Verificando permisos...</div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Debes iniciar sesión para acceder a esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Not authorized (role check)
  if (user.role !== 'propietario' && user.role !== 'administrator') {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta página. Solo los propietarios pueden gestionar inquilinos.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Authorized access
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-7xl mx-auto">
        <GestionInquilinos />
      </div>
    </div>
  );
}