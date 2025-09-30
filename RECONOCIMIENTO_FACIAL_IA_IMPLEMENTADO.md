# Sistema de Reconocimiento Facial con IA

## 🎯 Descripción
Sistema completo de verificación facial implementado en el panel de seguridad, integrado con backend Django para reconocimiento en tiempo real usando inteligencia artificial.

## 📁 Archivos Implementados

### Frontend Components
- `src/components/security/panel-reconocimiento-facial.tsx` - Componente principal de verificación
- `app/security/reconocimiento-facial-ia/page.tsx` - Página de la aplicación
- `src/features/seguridad/sincronizacion-service.ts` - Servicio actualizado con endpoint de IA

### Backend Integration
- **Endpoint**: `POST /api/seguridad/verificacion-tiempo-real/`
- **Método**: FormData upload con validaciones
- **IA**: Soporte para reconocimiento real con OpenCV

## 🚀 Características Implementadas

### ✅ Funcionalidades Core
- **Captura de fotos**: Cámara web o selección de archivos
- **Verificación en tiempo real**: Procesamiento con IA backend
- **Configuración flexible**: Umbrales de confianza, filtros de búsqueda
- **Resultados detallados**: Información completa de la persona identificada
- **Estadísticas**: Tiempo de procesamiento, comparaciones realizadas

### ✅ Validaciones de Seguridad
- **Formato de archivo**: Solo JPEG/PNG
- **Tamaño máximo**: 5MB por imagen
- **Tipos MIME**: Validación estricta
- **Errores manejados**: Red, servidor, formato, tamaño

### ✅ UI/UX Avanzada
- **Diseño responsive**: Adaptable a móviles y desktop
- **Feedback visual**: Loading states, progress indicators
- **Resultados claros**: Acceso autorizado/denegado con detalles
- **Configuración intuitiva**: Controles fáciles de usar

## 🔧 ConfiguraciÃ³n

### Parámetros de Verificación
```typescript
interface ConfiguracionVerificacion {
  umbralConfianza: '60.0' | '70.0' | '80.0' | '90.0';  // Sensibilidad
  buscarEn: 'propietarios' | 'inquilinos' | 'todos';   // Scope de búsqueda
  usarIAReal: boolean;                                  // IA real vs simulación
}
```

### Endpoint Configuration
```typescript
// URL: /api/seguridad/verificacion-tiempo-real/
// Método: POST multipart/form-data
// Campos:
// - foto_verificacion: File
// - umbral_confianza: string
// - buscar_en: string  
// - usar_ia_real: string ('true'/'false')
```

## 📊 Respuestas del Backend

### ✅ Éxito - Persona Identificada
```json
{
  "success": true,
  "verificacion": {
    "persona_identificada": {
      "copropietario_id": 19,
      "nombre_completo": "Luis Delgadillo",
      "documento": "87654321",
      "unidad": "Depto 301",
      "tipo_residente": "Propietario"
    },
    "confianza": 89.3,
    "resultado": "ACEPTADO",
    "timestamp": "2025-09-29T14:30:15Z"
  },
  "estadisticas": {
    "tiempo_procesamiento_ms": 245.8,
    "total_comparaciones": 10,
    "personas_analizadas": 10
  }
}
```

### ❌ Acceso Denegado
```json
{
  "success": true,
  "verificacion": {
    "persona_identificada": null,
    "confianza": 45.2,
    "resultado": "RECHAZADO",
    "umbral_usado": 70.0
  }
}
```

## 🛠️ Uso del Sistema

### 1. Navegación
- Ir a **Panel de Seguridad** → **Verificación con IA**
- URL: `/security/reconocimiento-facial-ia`

### 2. Captura de Foto
- Hacer clic en "Capturar Foto"
- Seleccionar desde cámara o archivo
- Vista previa automática

### 3. Configuración
- **Umbral**: 70% recomendado para uso general
- **Buscar en**: "Propietarios" para mayor velocidad
- **IA Real**: Activar para máxima precisión

### 4. Verificación
- Hacer clic en "Verificar Identidad"
- Esperar procesamiento (1-3 segundos)
- Ver resultado detallado

## 🔍 Casos de Uso

### Guardia Diurno (Rápido)
```typescript
{
  umbralConfianza: '70.0',
  buscarEn: 'propietarios', 
  usarIAReal: false
}
// Tiempo: <300ms
```

### Guardia Nocturno (Seguro)
```typescript
{
  umbralConfianza: '80.0',
  buscarEn: 'todos',
  usarIAReal: true  
}
// Tiempo: 1-3 segundos
```

### Máxima Seguridad
```typescript
{
  umbralConfianza: '90.0',
  buscarEn: 'todos',
  usarIAReal: true
}
// Tiempo: 1-3 segundos
```

## 🚨 Solución de Problemas

### Error: "Se requiere una foto"
- **Causa**: No se seleccionó archivo
- **Solución**: Capturar o seleccionar imagen válida

### Error: "Formato no soportado"  
- **Causa**: Archivo no es JPEG/PNG
- **Solución**: Usar solo imágenes JPEG o PNG

### Error: "Imagen muy grande"
- **Causa**: Archivo > 5MB
- **Solución**: Reducir tamaño de imagen

### Error de conexión
- **Causa**: Backend no disponible
- **Solución**: Verificar que Django esté ejecutándose

## 📈 Métricas de Performance

### Simulación (usar_ia_real: false)
- ⚡ Tiempo: 50-300ms
- 🎯 Precisión: Alta para testing
- 💻 CPU: Bajo consumo

### IA Real (usar_ia_real: true)  
- ⏱️ Tiempo: 1-3 segundos
- 🎯 Precisión: Máxima con OpenCV
- 💻 CPU: Alto consumo

## 🔐 Seguridad

### Validaciones Frontend
- Tipo de archivo MIME
- Tamaño máximo 5MB
- Preview seguro de imágenes

### Validaciones Backend
- Autenticación (desactivada en desarrollo)
- Rate limiting (recomendado en producción)
- Sanitización de archivos

## 📱 Responsividad

### Desktop (lg+)
- Layout de 2 columnas
- Captura y resultado lado a lado
- Controles completos

### Mobile (<lg)
- Layout de 1 columna
- Stack vertical
- Botones adaptados

## 🎨 Componentes UI

### Utilizados
- `Card` - Estructura principal
- `Button` - Acciones del usuario  
- `Badge` - Estados y etiquetas
- `Alert` - Mensajes de error
- `Icons` - Lucide React icons

### Colores de Estado
- 🟢 Verde: Acceso autorizado
- 🔴 Rojo: Acceso denegado
- 🟡 Amarillo: Procesando
- 🟦 Azul: Estados normales

## 🚀 Deploy y Producción

### Variables de Entorno
```env
NEXT_PUBLIC_API_URL=https://tu-backend.com
```

### Configuraciones Recomendadas
```typescript
// Producción
{
  umbralConfianza: '75.0',
  usarIAReal: true,
  timeout: 10000
}
```

## 📝 Log de Cambios

### v1.0.0 - Implementación Inicial
- ✅ Componente completo de verificación facial
- ✅ Integración con backend Django  
- ✅ UI responsiva y accesible
- ✅ Manejo completo de errores
- ✅ Configuraciones flexibles
- ✅ Estadísticas detalladas

---

## 🤝 Soporte

Para reportar problemas o solicitar características:
1. Verificar logs del navegador (F12)
2. Verificar logs del backend Django
3. Revisar configuración de red
4. Validar permisos de cámara (mobile)

**Estado**: ✅ TOTALMENTE FUNCIONAL  
**Última actualización**: 29 septiembre 2025