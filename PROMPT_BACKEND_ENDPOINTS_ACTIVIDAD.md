# PROMPT PARA AGENTE DEL BACKEND - ENDPOINTS DE ACTIVIDAD/CONTROL DE ACCESO

## 🎯 OBJETIVO
El frontend de seguridad necesita conectarse a endpoints del backend para mostrar **DATOS REALES** en lugar de datos simulados. Específicamente para la página de actividad (/security/actividad) y el dashboard de seguridad.

## 📋 ENDPOINTS REQUERIDOS

### 1. **LOGS DE ACCESO (CRÍTICO)**
```
GET /api/authz/seguridad/acceso/logs/
```
**Parámetros de consulta:**
- `limit` (opcional): Número máximo de registros (por defecto 50)
- `fecha_desde` (opcional): Filtrar desde fecha
- `fecha_hasta` (opcional): Filtrar hasta fecha
- `usuario` (opcional): Filtrar por usuario

**Respuesta esperada:**
```json
{
  "results": [
    {
      "id": 1,
      "usuario_nombre": "Carlos Mendoza",
      "nombre_completo": "Carlos Mendoza García",
      "usuario": "carlos.mendoza",
      "autorizado": true,
      "acceso_autorizado": true,
      "metodo_acceso": "reconocimiento_facial",
      "metodo": "facial",
      "confianza": 95.8,
      "confidence": 95.8,
      "ubicacion": "Entrada Principal",
      "unidad": "Torre A - Apt 301",
      "apartamento": "301",
      "fecha_hora": "2024-12-28T15:45:22Z",
      "timestamp": "2024-12-28T15:45:22Z",
      "descripcion": "Acceso autorizado por reconocimiento facial",
      "razon": null,
      "motivo": null
    },
    {
      "id": 2,
      "usuario_nombre": "Desconocido",
      "autorizado": false,
      "acceso_autorizado": false,
      "metodo_acceso": "reconocimiento_facial",
      "confianza": 45.2,
      "ubicacion": "Entrada Principal",
      "fecha_hora": "2024-12-28T15:30:15Z",
      "descripcion": "Acceso denegado - Usuario no reconocido",
      "razon": "Usuario no registrado en el sistema",
      "motivo": "Sin autorización"
    }
  ],
  "count": 150,
  "next": null,
  "previous": null
}
```

### 2. **ACTIVIDAD RECIENTE (ALTERNATIVO)**
```
GET /api/seguridad/actividad/reciente/
```
**Parámetros:** `limit` (opcional)
**Respuesta:** Similar al endpoint anterior pero más general

### 3. **INCIDENTES DE SEGURIDAD**
```
GET /api/authz/seguridad/incidentes/
```
**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "tipo": "acceso_no_autorizado",
    "descripcion": "Intento de acceso fallido repetido",
    "detalle": "Usuario desconocido intentó acceder 3 veces",
    "estado": "abierto",
    "fecha_hora": "2024-12-28T14:20:00Z",
    "created_at": "2024-12-28T14:20:00Z",
    "ubicacion": "Entrada Principal",
    "unidad": "N/A",
    "usuario_reporta": "Sistema",
    "reportado_por": "Sistema de Seguridad",
    "prioridad": "media"
  }
]
```

### 4. **ESTADÍSTICAS DASHBOARD**
```
GET /api/authz/seguridad/dashboard/
```
**Respuesta esperada:**
```json
{
  "total_usuarios": 156,
  "usuarios_con_fotos": 132,
  "total_fotos": 468,
  "accesos_hoy": 24,
  "incidentes_abiertos": 2,
  "visitas_activas": 8,
  "porcentaje_enrolamiento": 84.6,
  "eventos_hoy": 142,
  "accesos_exitosos": 128,
  "intentos_fallidos": 14,
  "usuarios_unicos": 47
}
```

### 5. **VISITAS ACTIVAS**
```
GET /api/authz/seguridad/visitas/activas/
```
**Respuesta esperada:**
```json
[
  {
    "id": 1,
    "visitante": "Juan Pérez",
    "unidad": "Torre A - Apt 301",
    "fecha_hora": "2024-12-28T14:00:00Z",
    "estado": "activa",
    "motivo": "Mantenimiento",
    "autorizado_por": "Carlos Mendoza"
  }
]
```

## 🔧 CAMPOS CRÍTICOS PARA EL FRONTEND

### Para mostrar en la actividad:
- `usuario_nombre` o `nombre_completo` - Nombre del usuario
- `autorizado` o `acceso_autorizado` - Si el acceso fue exitoso
- `metodo_acceso` o `metodo` - Método usado (facial, qr, etc.)
- `confianza` o `confidence` - Porcentaje de confianza (para IA facial)
- `ubicacion` o `unidad` - Dónde ocurrió el evento
- `fecha_hora` o `timestamp` - Cuándo ocurrió
- `descripcion` - Descripción del evento
- `razon` o `motivo` - Por qué falló (si aplica)

### Para estadísticas:
- Conteos de eventos por día
- Conteos de éxitos vs fallos
- Usuarios únicos
- Incidentes abiertos

## 🚨 IMPORTANTE

1. **Autenticación**: Todos los endpoints deben aceptar `Authorization: Bearer <token>`
2. **CORS**: Permitir requests desde `http://localhost:3000`
3. **Paginación**: Usar limit/offset para logs extensos
4. **Fechas**: Usar formato ISO 8601 (`2024-12-28T15:45:22Z`)
5. **Errores**: Responder con códigos HTTP apropiados (404, 401, etc.)

## 🎛️ CONFIGURACIÓN ACTUAL DEL FRONTEND

- **Base URL**: `http://127.0.0.1:8000`
- **Headers de auth**: `Bearer ${localStorage.getItem('access_token')}`
- **Timeout**: 10 segundos
- **Retry**: El frontend maneja errores graciosamente

## 📝 NOTAS ADICIONALES

- El frontend puede manejar respuestas vacías (`[]`) sin problemas
- Si un endpoint no está disponible, el frontend mostrará un mensaje apropiado
- Los datos se actualizan cada vez que el usuario presiona "Actualizar"
- Se implementó filtrado por usuario en el frontend

¿Necesitas que implemente alguno de estos endpoints o modificar algún formato de respuesta?