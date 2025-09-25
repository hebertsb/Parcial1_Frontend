'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Estado de Autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>Cargando:</strong> {isLoading ? 'Sí' : 'No'}
            </div>
            <div>
              <strong>Autenticado:</strong> {isAuthenticated ? 'Sí' : 'No'}
            </div>
            {user && (
              <div>
                <strong>Usuario:</strong>
                <pre className="bg-gray-100 p-2 mt-2 rounded text-sm">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}