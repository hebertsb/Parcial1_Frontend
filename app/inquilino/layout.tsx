/**
 * Layout para proteger rutas de inquilinos
 * Solo usuarios con rol 'inquilino' o 'administrator' pueden acceder
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function InquilinoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        console.log('❌ InquilinoLayout: Usuario no autenticado, redirigiendo a login');
        router.push('/');
        return;
      }

      console.log('🔒 InquilinoLayout: Verificando acceso para usuario:', user);
      console.log('🔒 InquilinoLayout: Rol del usuario:', user.role);
      
      // Solo permitir acceso a inquilinos y administradores
      if (user.role !== 'inquilino' && user.role !== 'administrator') {
        console.log('❌ InquilinoLayout: Acceso denegado - usuario no es inquilino');
        console.log('🔄 InquilinoLayout: Redirigiendo según rol:', user.role);
        
        // Redirigir al dashboard apropiado según el rol
        switch (user.role) {
          case 'propietario':
            router.push('/propietario/dashboard');
            break;
          case 'security':
            router.push('/security/monitor');
            break;
          default:
            router.push('/dashboard');
        }
        return;
      }
      
      console.log('✅ InquilinoLayout: Acceso permitido para inquilino/admin');
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verificando permisos...</div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Debes iniciar sesión para acceder a esta sección.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Not authorized (role check)
  if (user.role !== 'inquilino' && user.role !== 'administrator') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta sección. Solo los inquilinos pueden acceder aquí.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Authorized access
  return <>{children}</>;
}