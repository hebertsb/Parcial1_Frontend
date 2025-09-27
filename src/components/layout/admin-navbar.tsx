/**
 * Navbar para el panel de administrador
 * Incluye navegación, perfil y opciones de usuario
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Home,
  Users,
  User,
  Settings,
  LogOut,
  Menu,
  Building,
  FileText,
  Shield,
  Key,
  Bell,
  UserCog,
  DollarSign,
  UserPlus,
  ClipboardList
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Panel principal de administración'
  },
  {
    title: 'Usuarios',
    href: '/admin/usuarios',
    icon: Users,
    description: 'Gestión de usuarios del sistema'
  },
  {
    title: 'Propietarios',
    href: '/admin/propietarios',
    icon: UserPlus,
    description: 'Gestión de propietarios'
  },
  {
    title: 'Unidades',
    href: '/admin/unidades',
    icon: Building,
    description: 'Gestión de unidades del condominio'
  },
  {
    title: 'Solicitudes',
    href: '/admin/solicitudes',
    icon: ClipboardList,
    description: 'Registro de inquilinos'
  },
  {
    title: 'Finanzas',
    href: '/admin/finanzas',
    icon: DollarSign,
    description: 'Gestión financiera'
  },
];

const profileMenuItems = [
  {
    title: 'Ver Perfil',
    href: '/admin/perfil',
    icon: User,
    description: 'Ver información personal'
  },
  {
    title: 'Editar Perfil',
    href: '/admin/perfil/editar',
    icon: UserCog,
    description: 'Actualizar datos personales'
  },
  {
    title: 'Cambiar Contraseña',
    href: '/admin/configuracion/password',
    icon: Key,
    description: 'Cambiar contraseña'
  },
  {
    title: 'Configuración',
    href: '/admin/configuracion',
    icon: Settings,
    description: 'Configuración del sistema'
  },
  {
    title: 'Notificaciones',
    href: '/admin/notificaciones',
    icon: Bell,
    description: 'Gestionar notificaciones'
  },
];

export function AdminNavbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActivePath = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <Link href="/dashboard" className="font-bold text-lg">
            Panel Administrador
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex ml-8">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      isActivePath(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-user.jpg" alt={user?.name || 'Usuario'} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name ? getUserInitials(user.name) : 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Administrador'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'admin@ejemplo.com'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Administrador del Sistema</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Profile Menu Items */}
              {profileMenuItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="cursor-pointer">
                    <item.icon className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="text-sm">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="px-2 py-4">
              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 mb-6 p-3 rounded-lg bg-muted">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder-user.jpg" alt={user?.name || 'Usuario'} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name ? getUserInitials(user.name) : 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || 'Administrador'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'admin@ejemplo.com'}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Shield className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-blue-600">Administrador</span>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Navegación</h3>
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActivePath(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Mobile Profile Menu */}
              <div className="space-y-2 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Perfil</h3>
                {profileMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Logout */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}