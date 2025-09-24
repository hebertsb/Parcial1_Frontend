# Sistema de Condominios - Frontend

## 📁 Estructura del Proyecto

### Arquitectura Organizada por Características

El proyecto ha sido reestructurado siguiendo una **arquitectura basada en características** para mejorar la escalabilidad y mantenibilidad:

```
src/
├── core/                    # Funcionalidades centrales
│   ├── api/                # Cliente HTTP y configuración
│   │   └── client.ts       # Cliente API avanzado con interceptores
│   ├── types/              # Definiciones de tipos TypeScript
│   │   └── index.ts        # Tipos para todas las entidades
│   └── index.ts            # Exportaciones centrales
│
├── features/               # Módulos por características
│   ├── auth/              # Autenticación y usuarios
│   │   ├── services.ts    # Servicios de autenticación
│   │   └── hooks.ts       # Hooks React para auth
│   ├── finanzas/          # Gestión financiera
│   │   ├── services.ts    # Servicios financieros
│   │   └── hooks.ts       # Hooks para finanzas
│   ├── unidades/          # Gestión de unidades
│   │   ├── services.ts    # Servicios de unidades
│   │   └── hooks.ts       # Hooks para unidades
│   ├── seguridad/         # Sistema de seguridad
│   │   ├── services.ts    # Servicios de seguridad
│   │   └── hooks.ts       # Hooks para seguridad
│   └── index.ts           # Exportaciones de características
│
└── [existing structure]    # Componentes, páginas, etc.
```

## 🚀 Funcionalidades Implementadas

### 🔐 Módulo de Autenticación (`src/features/auth/`)

**Servicios Disponibles:**
- `authService`: Login, logout, cambio de contraseña
- `userService`: CRUD de usuarios, gestión de avatares
- `profileService`: Gestión de perfil de usuario
- `permissionsService`: Verificación de permisos

**Hooks Disponibles:**
- `useAuth()`: Estado de autenticación global
- `usePasswordChange()`: Cambio de contraseña
- `useUsers()`: Lista de usuarios con filtros
- `useUserMutations()`: Operaciones CRUD de usuarios
- `useProfile()`: Gestión de perfil

### 💰 Módulo de Finanzas (`src/features/finanzas/`)

**Servicios Disponibles:**
- `transaccionesService`: CRUD de transacciones, comprobantes
- `cuotasService`: Gestión de cuotas de mantenimiento
- `reportesService`: Generación de reportes financieros
- `presupuestoService`: Gestión presupuestaria
- `finanzasDashboardService`: Dashboard financiero

**Hooks Disponibles:**
- `useTransacciones()`: Lista de transacciones
- `useTransaccionMutations()`: Operaciones de transacciones
- `useCuotas()`: Gestión de cuotas
- `useEstadisticasFinancieras()`: Estadísticas financieras
- `useFinanzasDashboard()`: Dashboard financiero

### 🏠 Módulo de Unidades (`src/features/unidades/`)

**Servicios Disponibles:**
- `unidadesService`: CRUD de unidades, asignación de propietarios
- `propietariosService`: Gestión de propietarios
- `mantenimientoService`: Solicitudes de mantenimiento
- `unidadesDashboardService`: Dashboard de unidades

**Hooks Disponibles:**
- `useUnidades()`: Lista de unidades con filtros
- `useUnidadMutations()`: Operaciones CRUD de unidades
- `usePropietarios()`: Gestión de propietarios
- `useEstadisticasUnidades()`: Estadísticas de ocupación
- `useMapaOcupacion()`: Mapa de ocupación

### 🛡️ Módulo de Seguridad (`src/features/seguridad/`)

**Servicios Disponibles:**
- `incidentesService`: Gestión de incidentes de seguridad
- `visitasService`: Registro de visitas
- `alertasService`: Sistema de alertas
- `accesoControlService`: Control de acceso
- `seguridadDashboardService`: Dashboard de seguridad

**Hooks Disponibles:**
- `useIncidentes()`: Gestión de incidentes
- `useVisitas()`: Registro de visitas
- `useAlertasActivas()`: Alertas en tiempo real
- `useSeguridadDashboard()`: Dashboard de seguridad

## 🔧 Cliente API Avanzado

### Características del `apiClient`

**Funcionalidades Implementadas:**
- ✅ Interceptores de request/response
- ✅ Manejo automático de tokens JWT
- ✅ Deduplicación de requests
- ✅ Tracking de progreso en uploads
- ✅ Retry automático con backoff exponencial
- ✅ Cache inteligente de respuestas
- ✅ Manejo robusto de errores

**Ejemplo de Uso:**
```typescript
import { apiClient } from '@/src/core/api/client';

// GET request con parámetros
const response = await apiClient.get('/api/users/', { 
  params: { page: 1, search: 'john' } 
});

// POST request
const user = await apiClient.post('/api/users/', userData);

// Upload con progreso
const upload = await apiClient.upload('/api/upload/', file, 'image', 
  undefined, (progress) => console.log(`${progress}%`)
);
```

## 📊 Sistema de Tipos TypeScript

### Tipos Principales Definidos

**Entidades Core:**
- `DjangoUser`: Usuario del sistema Django
- `User`: Usuario del frontend (simplificado)
- `Unidad`: Información de unidades
- `Transaccion`: Transacciones financieras
- `IncidenteSeguridad`: Incidentes de seguridad
- `VisitaRegistro`: Registro de visitas

**Tipos de Request/Response:**
- `ApiResponse<T>`: Respuesta estándar de API
- `PaginatedResponse<T>`: Respuestas paginadas
- `CreateXRequest`: Tipos para crear entidades
- `UpdateXRequest`: Tipos para actualizar entidades
- `XFilters`: Tipos para filtros de búsqueda

## 🎯 Cómo Usar los Servicios

### 1. Importación Individual
```typescript
import { authService } from '@/src/features/auth/services';
import { useAuth } from '@/src/features/auth/hooks';
```

### 2. Importación Agrupada
```typescript
import { authServices, authHooks } from '@/src/features';
```

### 3. Importación Dinámica
```typescript
const { authService } = await import('@/src/features/auth/services');
```

## 📝 Ejemplos de Implementación

### Autenticación en Componente
```typescript
import { useAuth } from '@/src/features/auth/hooks';

export function LoginForm() {
  const { login, loading, error } = useAuth();
  
  const handleSubmit = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Redirect to dashboard
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div className="error">{error}</div>}
      <button disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### Gestión de Transacciones
```typescript
import { useTransacciones, useTransaccionMutations } from '@/src/features/finanzas/hooks';

export function TransaccionesList() {
  const { data, loading, refresh } = useTransacciones({ tipo: 'ingreso' });
  const { createTransaccion } = useTransaccionMutations();
  
  const handleCreate = async (transaccionData) => {
    const result = await createTransaccion(transaccionData);
    if (result.success) {
      refresh(); // Actualizar lista
    }
  };
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      {data?.results.map(transaccion => (
        <div key={transaccion.id}>{transaccion.concepto}</div>
      ))}
    </div>
  );
}
```

### Upload de Archivos con Progreso
```typescript
import { useTransaccionMutations } from '@/src/features/finanzas/hooks';

export function ComprobanteUpload({ transaccionId }) {
  const { adjuntarComprobante } = useTransaccionMutations();
  const [progress, setProgress] = useState(0);
  
  const handleUpload = async (file) => {
    const result = await adjuntarComprobante(
      transaccionId, 
      file, 
      (progress) => setProgress(progress)
    );
    
    if (result.success) {
      console.log('Comprobante subido exitosamente');
    }
  };
  
  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {progress > 0 && <progress value={progress} max={100} />}
    </div>
  );
}
```

## 🔄 Integración con Django Backend

### Configuración de URL Base
```typescript
// En .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Estructura de Endpoints Esperada
```
/api/auth/                  # Autenticación
├── login/                  # POST: Login
├── logout/                 # POST: Logout
├── me/                     # GET: Usuario actual
└── change-password/        # POST: Cambiar contraseña

/api/usuarios/              # Gestión de usuarios
├── {id}/                   # GET, PATCH, DELETE
├── {id}/avatar/           # POST: Upload avatar
└── bulk-delete/           # POST: Eliminación masiva

/api/finanzas/              # Módulo financiero
├── transacciones/         # CRUD transacciones
├── cuotas/                # CRUD cuotas
├── reportes/              # Generación de reportes
└── dashboard/             # Dashboard financiero

/api/unidades/              # Gestión de unidades
├── {id}/                  # CRUD unidades
├── propietarios/          # Gestión propietarios
└── dashboard/             # Dashboard unidades

/api/seguridad/             # Sistema de seguridad
├── incidentes/            # CRUD incidentes
├── visitas/               # Registro visitas
├── alertas/               # Sistema alertas
└── dashboard/             # Dashboard seguridad
```

## 🚀 Beneficios de la Nueva Arquitectura

### ✅ Escalabilidad
- **Modular**: Cada feature es independiente
- **Reutilizable**: Services y hooks reutilizables
- **Mantenible**: Código organizado por funcionalidad

### ✅ Desarrollo Eficiente
- **TypeScript**: Tipado estricto en toda la aplicación
- **Hooks Personalizados**: Lógica encapsulada y reutilizable
- **Error Handling**: Manejo consistente de errores

### ✅ Performance
- **Lazy Loading**: Importación dinámica de módulos
- **Cache Inteligente**: Optimización de requests
- **Deduplicación**: Evita requests duplicados

### ✅ Experiencia de Desarrollo
- **Autocompletado**: IntelliSense completo
- **Documentación**: Código autodocumentado
- **Consistencia**: Patrones uniformes en toda la app

## 📋 Próximos Pasos

1. **Migrar Componentes Existentes**: Actualizar componentes para usar nuevos services/hooks
2. **Implementar Tests**: Unit tests para services y hooks
3. **Optimizar Performance**: Implementar React Query o SWR
4. **Documentar APIs**: Generar documentación automática
5. **Implementar Monitoring**: Logging y analytics

---

**Estado Actual**: ✅ Estructura base implementada y lista para uso
**Compatibilidad**: ✅ Compatible con estructura existente
**Migración**: 🔄 Migración gradual recomendada