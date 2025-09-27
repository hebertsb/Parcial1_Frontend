# PROMPT PARA BACKEND: Integración de Reconocimiento Facial

## CONTEXTO ACTUAL
He actualizado completamente el frontend para integrar el sistema de reconocimiento facial según la nueva guía que me proporcionaste. 

## CAMBIOS IMPLEMENTADOS EN EL FRONTEND

### 1. **Formulario de Registro Actualizado**
- ✅ **Nuevos campos**: `fotos_base64[]`, `acepta_terminos`, `password`, `confirm_password`
- ✅ **Componente de captura de fotos**: Permite tomar hasta 3 fotos con cámara o subir archivos
- ✅ **Validaciones**: Mínimo 1 foto, contraseñas coincidentes, términos aceptados
- ✅ **Términos de reconocimiento facial**: Checkbox obligatorio con políticas de privacidad

### 2. **Endpoint Actualizado**
- ✅ **Cambió de**: `/authz/propietarios/solicitud/`
- ✅ **A**: `/api/authz/propietarios/registrar-solicitud/`
- ✅ **Incluye**: fotos en base64, términos aceptados, contraseñas

### 3. **Panel de Administración Mejorado**
- ✅ **Visualización de fotos**: Componente para ver/descargar fotos de reconocimiento
- ✅ **Endpoint de aprobación**: Actualizado a `/api/authz/propietarios/aprobar-solicitud/{id}/`
- ✅ **Procesamiento**: Muestra estado de reconocimiento facial procesado

## FLUJO COMPLETO ESPERADO

### **Registro (Frontend → Backend)**
```javascript
POST /api/authz/propietarios/registrar-solicitud/
{
  // Datos personales
  "primer_nombre": "Jose",
  "primer_apellido": "Murillo", 
  "cedula": "12345678",
  "email": "jose1@gmail.com",
  "telefono": "71234567",
  "fecha_nacimiento": "1990-01-01",
  "genero": "M",
  
  // Seguridad
  "password": "MiPassword123",
  "confirm_password": "MiPassword123",
  
  // Propiedad
  "numero_casa": "A-101",
  
  // RECONOCIMIENTO FACIAL
  "fotos_base64": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  ],
  "acepta_terminos": true
}
```

### **Respuesta Esperada**
```javascript
{
  "success": true,
  "data": {
    "mensaje": "Solicitud registrada exitosamente",
    "solicitud_id": 123
  }
}
```

### **Aprobación (Admin → Backend)**
```javascript
POST /api/authz/propietarios/aprobar-solicitud/123/
{
  "password": "MiPassword123",
  "password_confirm": "MiPassword123",
  "observaciones": "Solicitud aprobada"
}
```

## PREGUNTAS ESPECÍFICAS PARA EL BACKEND

### 1. **APIs de Consulta de Solicitudes**
**¿El endpoint actual devuelve las URLs de las fotos?**
```javascript
GET /authz/propietarios/admin/solicitudes/
// ¿Incluye fotos_reconocimiento_urls en la respuesta?
```

### 2. **Proceso de Dropbox**
**¿Cómo accedo a las fotos temporales desde el frontend?**
- ¿Las URLs de `/SolicitudesPendientes` son accesibles públicamente?
- ¿Necesito autenticación especial para mostrar las fotos en el admin?

### 3. **Estado de Procesamiento**
**¿Cómo saber si el reconocimiento facial ya fue procesado?**
- ¿El campo `tiene_reconocimiento_facial` se incluye en las respuestas?
- ¿Cómo diferencio entre fotos temporales y definitivas?

### 4. **APIs de Perfil (Problema Actual)**
**URGENTE: Los endpoints de perfil no funcionan**
```
❌ /api/usuarios/37/ → 404
❌ /api/propiedades/?propietario=37 → 404
```

**¿Cómo obtengo los datos completos del usuario logueado (ID: 37, jose1@gmail.com)?**
- Teléfono, dirección, ciudad registrados
- Propiedades asignadas
- Datos para editar perfil
- URLs de fotos de reconocimiento definitivas

## ENDPOINTS QUE NECESITO QUE FUNCIONEN

### **Para el Perfil del Usuario**
```
GET /api/usuarios/37/ 
→ Datos completos del usuario incluyendo reconocimiento facial

GET /api/propiedades/?propietario=37
→ Propiedades del usuario

PUT /api/usuarios/37/
→ Actualizar datos del perfil

POST /api/usuarios/37/change-password/
→ Cambiar contraseña
```

### **Para el Administrador**
```
GET /api/authz/propietarios/admin/solicitudes/
→ Con fotos_reconocimiento_urls y tiene_reconocimiento_facial

POST /api/authz/propietarios/aprobar-solicitud/{id}/
→ Con procesamiento de reconocimiento facial
```

## TESTING ACTUAL

**Usuario de prueba:**
- ID: 37
- Email: jose1@gmail.com  
- Token válido disponible

**¿Puedes confirmar que estos endpoints funcionan y devuelven datos reales?**

## PRÓXIMOS PASOS

1. ✅ **Frontend completo**: Formulario con fotos + Admin panel ✓
2. ⏳ **Backend**: Confirmar endpoints funcionando
3. ⏳ **Testing**: Probar flujo completo registro → aprobación → perfil
4. ⏳ **Integración**: Verificar que las fotos se procesan correctamente

**¿Está todo listo en el backend para probar el flujo completo?**