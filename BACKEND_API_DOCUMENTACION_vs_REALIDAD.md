# 📋 DOCUMENTACIÓN BACKEND ACTUALIZADA - ENDPOINTS DISPONIBLES

## 🔒 Panel de Seguridad - APIs Confirmadas por Backend

### ✅ **ENDPOINTS DOCUMENTADOS Y DISPONIBLES:**

### 1. 🔥 **Obtener Usuarios con Reconocimiento Facial** (PRINCIPAL)
**Endpoint:** `/api/authz/seguridad/usuarios-reconocimiento/`  
**Método:** `GET`  
**Estado:** ✅ DOCUMENTADO - **DEBERÍA INCLUIR fotos_urls**

**Respuesta Esperada según Backend:**
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "email": "maria.gonzalez@facial.com",
      "nombre_completo": "María González",
      "reconocimiento_id": 3,
      "copropietario_id": 1,
      "activo": true,
      "fecha_registro": "2025-09-27T18:31:12.691304+00:00",
      "tiene_fotos": true,
      "total_fotos": 10,
      "fotos_urls": [
        "https://dl.dropboxusercontent.com/scl/fi/abc123/foto1.jpg?rlkey=xyz&dl=1",
        "https://dl.dropboxusercontent.com/scl/fi/def456/foto2.jpg?rlkey=abc&dl=1"
      ],
      "unidad_residencial": "Casa 999"
    }
  ],
  "total": 6,
  "message": "Se encontraron 6 usuarios con reconocimiento facial"
}
```

**❌ PROBLEMA ACTUAL:** El endpoint responde PERO NO incluye `fotos_urls`

### 2. 📷 **Obtener Fotos de Usuario Específico** (INDIVIDUAL)
**Endpoint:** `/api/authz/seguridad/fotos-usuario/{usuario_id}/`  
**Método:** `GET`  
**Estado:** ✅ DOCUMENTADO - **DEBERÍA FUNCIONAR**

**Respuesta Esperada:**
```json
{
  "success": true,
  "data": {
    "usuario_id": 3,
    "usuario_email": "maria.gonzalez@facial.com",
    "fotos_urls": [
      "https://dl.dropboxusercontent.com/scl/fi/abc/foto1.jpg?rlkey=xyz&dl=1",
      "https://dl.dropboxusercontent.com/scl/fi/def/foto2.jpg?rlkey=abc&dl=1"
    ],
    "total_fotos": 10
  },
  "message": "Se encontraron 10 fotos para el usuario"
}
```

**❌ PROBLEMA ACTUAL:** Endpoint devuelve **404 Not Found**

### 3. 📊 **Dashboard de Seguridad**
**Endpoint:** `/api/authz/seguridad/dashboard/`  
**Estado:** ✅ DOCUMENTADO

### 4. 👥 **Visitas Activas**
**Endpoint:** `/api/authz/seguridad/visitas/activas/`  
**Estado:** ✅ DOCUMENTADO

### 5. 🚨 **Incidentes de Seguridad**
**Endpoint:** `/api/authz/seguridad/incidentes/`  
**Estado:** ✅ DOCUMENTADO

### 6. ⚠️ **Alertas Activas**
**Endpoint:** `/api/authz/seguridad/alertas/activas/`  
**Estado:** ✅ DOCUMENTADO

## 🚨 **DISCREPANCIA CRÍTICA DETECTADA**

### **DOCUMENTACIÓN vs REALIDAD:**

**Lo que dice la documentación:**
```json
{
  "fotos_urls": [
    "https://dl.dropboxusercontent.com/scl/fi/abc123/foto1.jpg?rlkey=xyz&dl=1"
  ]
}
```

**Lo que devuelve el backend real:**
```json
{
  "total_fotos": 10,
  "tiene_fotos": true
  // ❌ NO HAY fotos_urls
}
```

## ⚡ **ACCIONES NECESARIAS PARA EL BACKEND:**

### **OPCIÓN A: Corregir Endpoint Principal** ⭐ RECOMENDADO
```python
# En Django - Vista usuarios_reconocimiento
def usuarios_reconocimiento_view(request):
    usuarios = []
    for usuario in query:
        # ¡AGREGAR ESTA LÓGICA!
        fotos_urls = obtener_urls_dropbox(usuario.id)
        
        usuarios.append({
            'id': usuario.id,
            'email': usuario.email,
            'fotos_urls': fotos_urls,  # ← ¡FALTA ESTA LÍNEA!
            # ... resto de campos
        })
```

### **OPCIÓN B: Activar Endpoint Individual**
```python
# Crear/activar la vista fotos_usuario
def fotos_usuario_view(request, usuario_id):
    fotos_urls = obtener_urls_dropbox(usuario_id)
    return JsonResponse({
        'success': True,
        'data': {
            'usuario_id': usuario_id,
            'fotos_urls': fotos_urls
        }
    })
```

## 📝 **ESTADO ACTUAL:**
- ✅ Frontend actualizado y preparado
- ✅ Documentación de backend clara
- ❌ **Implementación de backend incompleta**
- ❌ **fotos_urls NO se está devolviendo**

**¡El backend necesita implementar lo que está documentado!**