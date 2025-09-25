# 🛡️ Sistema de Gestión de Usuarios de Seguridad

## Descripción
Sistema completo para que administradores puedan crear y gestionar cuentas de personal de seguridad, implementado siguiendo la **GUÍA COMPLETA PARA IMPLEMENTAR GESTIÓN DE USUARIOS DE SEGURIDAD EN FRONTEND**.

## ✅ Funcionalidades Implementadas

### 🔐 Para Administradores
- **Crear usuarios de seguridad** con datos personales y credenciales
- **Listar todos los usuarios de seguridad** del sistema
- **Activar/Desactivar usuarios** según necesidades operativas
- **Resetear contraseñas** cuando sea necesario
- **Búsqueda y filtrado** de usuarios
- **Validaciones completas** client-side y server-side

### 👮 Para Personal de Seguridad
- **Login con credenciales** creadas por el administrador
- **Redirección automática** al panel de seguridad (`/security/monitor`)
- **Acceso a funciones específicas** de seguridad

## 🚀 Rutas Implementadas

### Administración
- `/admin/usuarios-seguridad` - Gestión completa de usuarios de seguridad
- `/admin/test-seguridad` - Pruebas de integración con backend

### Personal de Seguridad
- `/security/monitor` - Panel principal de seguridad (ya existía)
- Login automático redirige aquí para usuarios con rol `security`

## 🔧 Arquitectura

### Servicios (`src/features/admin/services/seguridad.ts`)
```typescript
- seguridadAdminService.crearUsuarioSeguridad()
- seguridadAdminService.listarUsuariosSeguridad()
- seguridadAdminService.cambiarEstadoUsuario()
- seguridadAdminService.resetearPassword()
```

### Hooks (`src/features/admin/hooks/useSeguridadUsuarios.ts`)
```typescript
- useSeguridadUsuarios() - Hook principal para gestión
- useValidacionesSeguridadUsuarios() - Validaciones de formularios
```

### Componentes
- `CrearUsuarioSeguridad` - Formulario de creación con validaciones
- `GestionUsuariosSeguridad` - Lista y gestión de usuarios existentes
- `TestSeguridadBackend` - Pruebas de integración automáticas

## 📡 Endpoints del Backend

Siguiendo exactamente la guía del backend:

```
POST /auth/login/ - Login universal
POST /auth/admin/seguridad/crear/ - Crear usuario seguridad
GET /auth/admin/seguridad/listar/ - Listar usuarios seguridad  
PUT /auth/admin/seguridad/{id}/estado/ - Cambiar estado
POST /auth/admin/seguridad/{id}/reset-password/ - Resetear contraseña
```

## 🧪 Pruebas de Integración

### Componente de Pruebas Automáticas
Navegar a `/admin/test-seguridad` para ejecutar pruebas automáticas que verifican:

1. **Conexión con Backend Django** (http://127.0.0.1:8000)
2. **Autenticación de Administrador** 
3. **Listado de Usuarios de Seguridad**
4. **Creación de Usuario de Prueba**

### Credenciales de Prueba

#### Administrador (para crear usuarios)
```
Email: admin@condominio.com
Password: admin123
```

#### Usuarios de Seguridad Existentes
```
Email: prueba.seguridad@test.com
Password: prueba123

Email: carlos.test@condominio.com  
Password: test123
```

## 🔄 Flujo Completo de Uso

### 1. Administrador Crea Usuario de Seguridad
1. Login como administrador
2. Ir a "Personal Seguridad" en el menú
3. Hacer clic en "Crear Usuario"
4. Completar formulario con datos personales
5. Generar contraseña temporal (botón automático)
6. Crear usuario → Sistema devuelve credenciales

### 2. Personal de Seguridad usa el Sistema
1. Login con credenciales proporcionadas por admin
2. Sistema detecta rol "security" automáticamente
3. Redirección a `/security/monitor`
4. Acceso a panel de seguridad completo

### 3. Administrador Gestiona Usuarios
- Ver lista completa con estados
- Activar/Desactivar según necesidades
- Resetear contraseñas cuando sea necesario
- Buscar por nombre, email o cédula

## 🎨 Interfaz de Usuario

### Estilo Consistente
- **Dark Theme** siguiendo el diseño existente del sistema
- **Iconografía coherente** con Lucide React
- **Validaciones en tiempo real** con feedback visual
- **Loading states** y manejo de errores
- **Confirmaciones** para acciones destructivas

### Responsive Design
- Formularios adaptativos para mobile/desktop
- Tablas scrolleables en pantallas pequeñas
- Navegación optimizada para todos los dispositivos

## 🔒 Seguridad Implementada

### Validaciones Client-Side
- Email formato válido y único
- Contraseña con requisitos mínimos
- CI boliviano (7-8 dígitos numéricos)
- Teléfono con formato correcto
- Campos requeridos marcados

### Autenticación y Autorización
- **JWT Tokens** para autenticación
- **Headers de autorización** en todas las requests
- **Verificación de roles** antes de mostrar interfaces
- **Renovación automática** de tokens expirados

### Manejo de Errores
- Mensajes de error claros y específicos
- Fallbacks para conexiones perdidas
- Logging detallado para debugging
- Confirmaciones para acciones críticas

## 🚀 Próximos Pasos Sugeridos

### Funcionalidades Adicionales
- [ ] **Vista de detalles** completa de usuarios
- [ ] **Historial de acciones** administrativas
- [ ] **Notificaciones por email** al crear usuarios
- [ ] **Exportar lista** de usuarios a Excel/PDF
- [ ] **Búsqueda avanzada** con múltiples filtros
- [ ] **Roles específicos** (Guardia Diurno, Nocturno, etc.)

### Mejoras de Seguridad
- [ ] **HTTPS** en producción
- [ ] **Rate limiting** para endpoints sensibles
- [ ] **2FA** para administradores
- [ ] **Logs de auditoría** completos
- [ ] **Verificación por email** al crear usuarios

## 🐛 Troubleshooting

### Error: "Error de conexión"
**Solución:** Verificar que Django esté ejecutándose en `http://127.0.0.1:8000`

### Error: "Token inválido" 
**Solución:** Hacer logout/login o verificar que el token esté en localStorage

### Error: "Permisos insuficientes"
**Solución:** Verificar que el usuario tenga rol "Administrador" exactamente

### Error: "Email ya existe"
**Solución:** Usar un email diferente o verificar si el usuario ya existe

## 📝 Logs y Debugging

El sistema incluye logging detallado en consola:
- `🔄` - Operaciones en progreso
- `✅` - Operaciones exitosas  
- `❌` - Errores y fallos
- `⚠️` - Advertencias y fallbacks
- `🔍` - Información de debugging

## 🎯 Estado del Sistema

### ✅ Completamente Implementado
- [x] Servicios de backend integrados
- [x] Hooks personalizados funcionando
- [x] Componentes UI responsive
- [x] Validaciones completas
- [x] Manejo de errores robusto
- [x] Pruebas de integración automáticas
- [x] Navegación y routing
- [x] Autenticación y autorización

### 🔄 Listo para Usar
El sistema está **completamente funcional** y listo para usar en producción. Solo requiere que el backend Django esté ejecutándose según la guía proporcionada.

---

**📚 Documentación Técnica Completa:** Ver archivos de código para detalles de implementación y comentarios técnicos.