/**
 * Página de notificaciones del propietario
 */

'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
  DollarSign,
  Wrench,
  Mail,
  Clock,
  Trash2,
  MailOpen,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  category: 'inquilino' | 'pago' | 'mantenimiento' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  avatar?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    category: 'inquilino',
    title: 'Nuevo Mensaje de Inquilino',
    message: 'María García ha enviado un mensaje sobre el aire acondicionado de la unidad 4B',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false,
    avatar: '/professional-woman-headshot.png',
    actionUrl: '/propietario/mis-inquilinos'
  },
  {
    id: '2',
    type: 'success',
    category: 'pago',
    title: 'Pago Recibido',
    message: 'Se ha recibido el pago mensual de la unidad 4B por $850',
    timestamp: '2024-01-14T15:45:00Z',
    isRead: false
  },
  {
    id: '3',
    type: 'warning',
    category: 'mantenimiento',
    title: 'Mantenimiento Programado',
    message: 'Mantenimiento del sistema de agua programado para mañana de 9:00 AM a 12:00 PM',
    timestamp: '2024-01-13T08:00:00Z',
    isRead: true
  },
  {
    id: '4',
    type: 'info',
    category: 'general',
    title: 'Actualización del Sistema',
    message: 'Se han añadido nuevas funciones al portal del propietario',
    timestamp: '2024-01-12T12:00:00Z',
    isRead: true
  },
  {
    id: '5',
    type: 'error',
    category: 'inquilino',
    title: 'Reporte de Problema',
    message: 'Carlos Mendoza reportó un problema con la cerradura de la puerta principal',
    timestamp: '2024-01-11T16:20:00Z',
    isRead: true,
    avatar: '/professional-man-headshot.png',
    actionUrl: '/propietario/mis-inquilinos'
  }
];

export default function NotificacionesPropietario() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('todas');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inquilino': return <Users className="h-4 w-4" />;
      case 'pago': return <DollarSign className="h-4 w-4" />;
      case 'mantenimiento': return <Wrench className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: false }
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const filterNotifications = (category: string) => {
    if (category === 'todas') return notifications;
    if (category === 'no-leidas') return notifications.filter(n => !n.isRead);
    return notifications.filter(n => n.category === category);
  };

  const filteredNotifications = filterNotifications(activeTab);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/propietario/perfil">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Bell className="mr-2 h-6 w-6" />
              Notificaciones
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Mantente al día con las últimas actualizaciones
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Mail className="mr-2 h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Tabs de Filtrado */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="todas" className="flex items-center">
            <Bell className="mr-1 h-4 w-4" />
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="no-leidas" className="flex items-center">
            <MailOpen className="mr-1 h-4 w-4" />
            No leídas ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="inquilino" className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            Inquilinos
          </TabsTrigger>
          <TabsTrigger value="pago" className="flex items-center">
            <DollarSign className="mr-1 h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="mantenimiento" className="flex items-center">
            <Wrench className="mr-1 h-4 w-4" />
            Mantenimiento
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center">
            <Info className="mr-1 h-4 w-4" />
            General
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay notificaciones</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'no-leidas' 
                    ? 'No tienes notificaciones sin leer'
                    : `No hay notificaciones en la categoría "${activeTab}"`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Avatar o Icono */}
                      {notification.avatar ? (
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={notification.avatar} alt="Avatar" />
                          <AvatarFallback>
                            {getCategoryIcon(notification.category)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="flex-shrink-0 p-2 rounded-full bg-muted">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`text-sm font-semibold ${
                                !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryIcon(notification.category)}
                                <span className="ml-1 capitalize">{notification.category}</span>
                              </Badge>
                              {!notification.isRead && (
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center space-x-1 ml-4">
                            {notification.actionUrl && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={notification.actionUrl}>
                                  Ver
                                </Link>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                            >
                              {notification.isRead ? (
                                <MailOpen className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}