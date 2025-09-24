/**
 * Componente para reenvío de credenciales de acceso
 * Permite a los usuarios solicitar reenvío de sus credenciales
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { reenviarCredenciales } from '@/features/propietarios/email-service';

// Schema de validación
const reenvioSchema = z.object({
  email: z.string().email('Formato de email inválido'),
});

type ReenvioData = z.infer<typeof reenvioSchema>;

export function ReenvioCredencialesForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<ReenvioData>({
    resolver: zodResolver(reenvioSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleSubmit = async (data: ReenvioData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus(null);
      setErrorMessage('');

      console.log('📧 Solicitando reenvío de credenciales para:', data.email);
      
      await reenviarCredenciales(data.email);
      
      setSubmitStatus('success');
      form.reset();
      
    } catch (error: any) {
      console.error('❌ Error en reenvío:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error?.response?.data?.mensaje || 
        'Error al enviar credenciales. Verifique su email e intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-800">
                ¡Credenciales Enviadas!
              </h3>
              <p className="text-sm text-muted-foreground">
                Hemos enviado sus credenciales de acceso a su correo electrónico.
                Revise su bandeja de entrada y carpeta de spam.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">¿Qué sigue?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Revise su email en los próximos minutos</li>
                <li>2. Use las credenciales para iniciar sesión</li>
                <li>3. Cambie su contraseña en su primer acceso</li>
              </ul>
            </div>

            <Button
              onClick={() => setSubmitStatus(null)}
              variant="outline"
              className="w-full"
            >
              Solicitar Nuevo Reenvío
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Reenviar Credenciales</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Ingrese su email para recibir sus credenciales de acceso
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              {...form.register('email')}
              className={form.formState.errors.email ? 'border-red-500' : ''}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {submitStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar Credenciales
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <a href="/registro" className="text-primary hover:underline">
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}