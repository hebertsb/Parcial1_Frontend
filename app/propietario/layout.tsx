/**
 * Layout para proteger rutas de propietarios
 * Solo usuarios con rol 'propietario' o 'administrator' pueden acceder
 */

'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { PropietarioNavbar } from '@/components/layout/propietario-navbar';

export default function PropietarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        console.log('❌ PropietarioLayout: Usuario no autenticado, redirigiendo a login');
        router.push('/');
        return;
      }

      console.log('🔒 PropietarioLayout: Verificando acceso para usuario:', user);
      console.log('🔒 PropietarioLayout: Rol del usuario:', user.role);
      
      // Solo permitir acceso a propietarios y administradores
      if (user.role !== 'propietario' && user.role !== 'administrator') {
        console.log('❌ PropietarioLayout: Acceso denegado - usuario no es propietario');
        console.log('🔄 PropietarioLayout: Redirigiendo según rol:', user.role);
        
        // Redirigir al dashboard apropiado según el rol
        switch (user.role) {
          case 'inquilino':
            router.push('/inquilino/dashboard');
            break;
          case 'security':
            router.push('/security/monitor');
            break;
          default:
            router.push('/dashboard');
        }
        return;
      }
      
      console.log('✅ PropietarioLayout: Acceso permitido para propietario/admin');
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
  if (user.role !== 'propietario' && user.role !== 'administrator') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No tienes permisos para acceder a esta sección. Solo los propietarios pueden acceder aquí.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Authorized access
  return (
    <div className="min-h-screen bg-background">
      <PropietarioNavbar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}