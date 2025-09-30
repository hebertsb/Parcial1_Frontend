/**
 * Layout para proteger rutas de seguridad
 * Solo usuarios con rol 'security' o 'administrator' pueden acceder
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { SecurityHeader } from '@/components/security/security-header';
import { SecuritySidebar } from '@/src/components/security/security-sidebar';

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        console.log('❌ SecurityLayout: Usuario no autenticado, redirigiendo al login principal');
        router.push('/');
        return;
      }

      console.log('🔒 SecurityLayout: Verificando acceso para usuario:', user);
      console.log('🔒 SecurityLayout: Rol del usuario:', user.role);
      
      // Solo permitir acceso a personal de seguridad y administradores
      if (user.role !== 'security' && user.role !== 'administrator') {
        console.log('❌ SecurityLayout: Acceso denegado - usuario no es personal de seguridad');
        console.log('🔄 SecurityLayout: Redirigiendo según rol:', user.role);
        
        // Redirigir al dashboard apropiado según el rol
        switch (user.role) {
          case 'propietario':
            router.push('/propietario/dashboard');
            break;
          case 'inquilino':
            router.push('/inquilino/dashboard');
            break;
          default:
            router.push('/');
        }
        return;
      }

      console.log('✅ SecurityLayout: Acceso permitido para rol:', user.role);
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando credenciales de seguridad...</p>
        </div>
      </div>
    );
  }

  // Mostrar mensaje de acceso denegado si no está autenticado
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Acceso denegado. Debe iniciar sesión como personal de seguridad.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Mostrar mensaje de rol incorrecto
  if (user.role !== 'security' && user.role !== 'administrator') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Acceso denegado. Esta área está restringida al personal de seguridad.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <SecuritySidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SecurityHeader user={user} lastUpdate={new Date()} onLogout={() => {}} />
        <main className="flex-1 overflow-y-auto bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}