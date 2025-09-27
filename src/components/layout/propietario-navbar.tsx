/**
 * Navbar del propietario con dropdown funcional
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Home,
  Users,
  User,
  Settings,
  LogOut,
  Building,
  FileText,
  Key,
  UserCog,
  ChevronDown
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/propietario/dashboard',
    icon: Home,
  },
  {
    title: 'Mis Inquilinos',
    href: '/propietario/mis-inquilinos',
    icon: Users,
  },
  {
    title: 'Mi Propiedad',
    href: '/propietario/mi-propiedad',
    icon: Building,
  },
  {
    title: 'Solicitudes',
    href: '/propietario/solicitudes',
    icon: FileText,
  },
];

export function PropietarioNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      console.log('🔄 Cerrando sesión...');
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const toggleDropdown = () => {
    console.log('🔍 Toggle dropdown, estado actual:', dropdownOpen);
    setDropdownOpen(!dropdownOpen);
  };

  console.log('🔍 PropietarioNavbar renderizando, usuario:', user);

  return (
    <nav className="bg-black text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y Navegación Principal */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/propietario/dashboard" className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-white" />
              <span className="font-bold text-lg">Portal Propietario</span>
            </Link>

            {/* Navegación Desktop */}
            <div className="hidden md:flex ml-8 space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Perfil Usuario */}
          <div className="flex items-center space-x-4">
            {/* User Dropdown - VERSION HTML PURO */}
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-white hover:bg-gray-800 h-auto py-2"
                onClick={toggleDropdown}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={user?.name || 'Usuario'} />
                  <AvatarFallback className="bg-gray-700 text-white text-sm">
                    {user?.name ? getUserInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.name || 'Usuario'}</span>
                  <span className="text-xs text-gray-400">propietario</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 text-black shadow-lg rounded-md z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      Mi Cuenta
                    </div>
                    
                    <button 
                      onClick={() => {
                        console.log('🔍 Navegando a perfil...');
                        router.push('/propietario/perfil');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Ver Perfil
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('🔍 Navegando a editar perfil...');
                        router.push('/propietario/perfil/editar');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center"
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('🔍 Navegando a cambiar contraseña...');
                        router.push('/propietario/configuracion/password');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </button>
                    
                    <button 
                      onClick={() => {
                        console.log('🔍 Navegando a configuración...');
                        router.push('/propietario/configuracion');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}

              {/* Overlay para cerrar dropdown */}
              {dropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setDropdownOpen(false)}
                ></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}