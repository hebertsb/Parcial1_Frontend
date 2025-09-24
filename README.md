# 🏢 CondoManager - Sistema de Gestión de Condominios

Un sistema completo de gestión de condominios desarrollado con **Next.js 14** y **Django** para el primer parcial de Sistemas de Información II.

## 🌟 Características Principales

- 🏠 **Gestión de Propietarios**: Registro, solicitudes y aprobación automática
- 👥 **Gestión de Inquilinos**: Control de residentes y familiares
- 🏢 **Administración de Unidades**: Gestión de departamentos y casas
- 💰 **Control Financiero**: Pagos, cuotas y reportes
- 🔐 **Seguridad**: Monitoreo y control de acceso
- 📧 **Sistema de Emails**: Notificaciones automáticas
- 🔄 **API Integrada**: Backend Django con autenticación JWT

## 🚀 Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **shadcn/ui** - Componentes de UI modernos
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Backend
- **Django REST Framework** - API REST
- **JWT Authentication** - Autenticación segura
- **PostgreSQL** - Base de datos
- **Email System** - Envío automático de credenciales

## 📁 Estructura del Proyecto

```
Frontend_Parcial1/
├── 📁 src/
│   ├── 🔧 core/
│   │   ├── api/client.ts          # Cliente HTTP con interceptores
│   │   └── types/index.ts         # Tipos TypeScript
│   ├── 🎯 features/               # Módulos por funcionalidad
│   │   ├── admin/                 # Gestión administrativa
│   │   ├── auth/                  # Autenticación
│   │   ├── propietarios/          # Gestión de propietarios
│   │   └── finanzas/              # Control financiero
│   ├── 🧩 components/             # Componentes React
│   │   ├── admin/                 # Dashboards administrativos
│   │   ├── propietarios/          # Formularios de registro
│   │   └── ui/                    # Componentes base
│   └── 🪝 hooks/                  # Custom React hooks
├── 📁 app/                        # Rutas Next.js (App Router)
│   ├── admin/                     # Panel administrativo
│   ├── propietario/               # Dashboard propietarios
│   └── solicitud-registro/        # Formulario público
└── 📁 public/                     # Archivos estáticos
```

## ⚡ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o pnpm
- Django Backend corriendo en `http://localhost:8000`

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/hebertsb/FRONTEND_Parcial1.git
cd FRONTEND_Parcial1

# Instalar dependencias
npm install
# o
pnpm install

# Ejecutar en desarrollo
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔧 Configuración del Backend

El frontend está configurado para conectarse con el backend Django:

```typescript
// src/core/api/client.ts
const API_BASE_URL = 'http://localhost:8000/api';
```

### Endpoints Principales:
- `POST /authz/propietarios/solicitud/` - Crear solicitud de registro
- `GET /authz/propietarios/admin/solicitudes/` - Listar solicitudes
- `POST /authz/propietarios/admin/solicitudes/{id}/aprobar/` - Aprobar solicitud

## 🚀 Funcionalidades Implementadas

### 📋 Sistema de Solicitudes
- ✅ Formulario público de registro de propietarios
- ✅ Validación completa de datos
- ✅ Envío automático al backend Django
- ✅ Gestión de fechas de nacimiento
- ✅ Soporte para familiares

### 👨‍💼 Panel Administrativo
- ✅ Dashboard completo para administradores
- ✅ Lista de solicitudes en tiempo real
- ✅ Aprobación/rechazo con observaciones
- ✅ Creación automática de usuarios
- ✅ Envío automático de credenciales por email
- ✅ Modal inteligente con cierre automático

### 🔐 Sistema de Autenticación
- ✅ Autenticación JWT
- ✅ Roles diferenciados (Admin, Propietario, Inquilino)
- ✅ Rutas protegidas
- ✅ Middleware de autorización

### 📊 Estado de Conexión
- ✅ Indicadores de conexión al backend
- ✅ Debug logs detallados
- ✅ Manejo de errores robusto
- ✅ Reintentos automáticos

## 🎨 Componentes Principales

### Formularios
- `SolicitudRegistroPropietarioFormActualizada` - Formulario de registro completo
- `GestionSolicitudesRegistro` - Panel de administración

### Dashboards
- `AdminDashboard` - Dashboard administrativo principal
- `OwnerDashboard` - Dashboard para propietarios
- `TenantDashboard` - Dashboard para inquilinos

### Servicios
- `solicitudes-service.ts` - Gestión de solicitudes
- `auth-service.ts` - Autenticación
- `api-client.ts` - Cliente HTTP centralizado

## 🔄 Flujo de Trabajo Principal

1. **Registro**: Usuario completa formulario público
2. **Validación**: Sistema valida datos y envía al backend
3. **Revisión**: Admin ve solicitud en panel administrativo
4. **Aprobación**: Admin aprueba/rechaza con observaciones
5. **Automatización**: Sistema crea usuario y envía credenciales
6. **Notificación**: Usuario recibe email con acceso al sistema

## 🐛 Debug y Desarrollo

El sistema incluye logs detallados para desarrollo:

```javascript
// Logs de conexión al backend
console.log('🔄 Obteniendo solicitudes de registro desde backend...');
console.log('✅ Solicitud procesada exitosamente');

// Debug de datos
console.log('🔍 [DEBUG] Datos de la solicitud:', solicitudData);
```

## 📱 Responsive Design

- ✅ Diseño adaptativo para móviles y tablets
- ✅ Componentes optimizados con Tailwind CSS
- ✅ Navegación intuitiva
- ✅ Formularios accesibles

## 🔮 Próximas Mejoras

- [ ] Sistema de notificaciones en tiempo real
- [ ] Dashboard de métricas y reportes
- [ ] Gestión de pagos integrada
- [ ] Sistema de mensajería interna
- [ ] Aplicación móvil (React Native)

## 👥 Desarrollado por

**Hebert SB** - Sistemas de Información II  
Universidad Autónoma Gabriel René Moreno

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el primer parcial de Sistemas de Información II.

---

⭐ **¡Dale una estrella al proyecto si te fue útil!**