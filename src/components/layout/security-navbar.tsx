/**
 * Navbar del personal de seguridad con dropdown funcional
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/core/types';
import {
  Shield,
  Users,
  User as UserIcon,
  Settings,
  LogOut,
  Camera,
  AlertTriangle,
  Eye,
  FileText,
  Activity,
  ChevronDown
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Panel Principal',
    href: '/security/dashboard',
    icon: Shield,
  },
  {
    title: 'Reconocimiento Facial',
    href: '/security/monitor',
    icon: Camera,
  },
  {
    title: 'Control de Acceso',
    href: '/security/access-control',
    icon: Eye,
  },
  {
    title: 'Incidentes',
    href: '/security/incidents',
    icon: AlertTriangle,
  },
  {
    title: 'Visitas',
    href: '/security/visits',
    icon: Users,
  },
  {
    title: 'Reportes',
    href: '/security/reports',
    icon: FileText,
  },
];

interface SecurityNavbarProps {
  user: User;
}

export function SecurityNavbar({ user }: SecurityNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log('🚪 SecurityNavbar: Iniciando logout...');
      
      await logout();
      
      console.log('✅ SecurityNavbar: Logout exitoso, redirigiendo...');
      router.push('/');
      
    } catch (error) {
      console.error('❌ SecurityNavbar: Error en logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    const roleMap = {
      'security': 'Personal de Seguridad',
      'administrator': 'Administrador',
    };
    return roleMap[role as keyof typeof roleMap] || 'Personal de Seguridad';
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap = {
      'security': 'bg-blue-500',
      'administrator': 'bg-purple-500',
    };
    return colorMap[role as keyof typeof colorMap] || 'bg-blue-500';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Sistema de Seguridad
              </span>
            </div>
          </div>

          {/* Navegación principal */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>

          {/* Usuario y dropdown */}
          <div className="flex items-center space-x-3">
            {/* Estado del sistema */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Activity className="h-4 w-4 text-green-500" />
              <span>Sistema Activo</span>
            </div>

            {/* Dropdown del usuario */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {user.name || 'Personal de Seguridad'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getRoleBadgeColor(user.role)}`}>
                      {getRoleDisplay(user.role)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Shield className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-2">
                    <Link
                      href="/security/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </Link>
                    
                    <Link
                      href="/security/settings"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Configuración</span>
                    </Link>
                    
                    <hr className="my-2" />
                    
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navegación móvil */}
      <div className="md:hidden border-t bg-gray-50">
        <div className="grid grid-cols-3 gap-1 p-2">
          {navigationItems.slice(0, 6).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center space-y-1 p-2 rounded-md text-xs transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}