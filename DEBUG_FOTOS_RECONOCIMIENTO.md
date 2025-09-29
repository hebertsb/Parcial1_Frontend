# 🔍 DEBUG: FLUJO FOTOS RECONOCIMIENTO FACIAL

## 📋 **ANÁLISIS DEL PROBLEMA**

### **✅ FLUJO QUE FUNCIONA (Foto de Perfil):**
```
Formulario → Dropbox → URL devuelta → Mostrada en perfil
✅ foto_perfil: "https://dl.dropboxusercontent.com/scl/fi/5eyy2u172ecnt11pxrpzt/..."
```

### **❌ FLUJO QUE NO FUNCIONA (Fotos Reconocimiento):**
```
Panel Propietario → Sube fotos → Dropbox → ❌ NO devuelve URLs → Panel vacío
```

## 🚀 **ENDPOINTS ACTUALES**

### **1. Subir Fotos (POST):**
```
URL: http://localhost:8000/api/authz/reconocimiento/fotos/
Método: POST (FormData)
Estado: ✅ FUNCIONA - Fotos llegan al backend
```

### **2. Obtener Fotos (GET):**
```
URL: http://localhost:8000/api/authz/reconocimiento/fotos/${usuarioId}/
Método: GET
Estado: ❌ NO DEVUELVE URLs de Dropbox
```

## 🎯 **SOLUCIÓN REQUERIDA**

El backend debe devolver en el GET la misma estructura que usa para `foto_perfil`:

```json
// RESPUESTA ESPERADA:
{
  "success": true,
  "data": {
    "fotos_urls": [
      "https://dl.dropboxusercontent.com/scl/fi/xxx/foto1.jpg?rlkey=xxx&dl=0",
      "https://dl.dropboxusercontent.com/scl/fi/yyy/foto2.jpg?rlkey=yyy&dl=0"
    ],
    "total_fotos": 2,
    "tiene_reconocimiento": true
  }
}
```

## 🔧 **DEBUGGING NECESARIO**

1. **Verificar que el POST realmente guarda en Dropbox**
2. **Verificar que el GET obtiene las URLs de Dropbox**
3. **Confirmar que las URLs son accesibles**

## 📱 **FRONTEND LISTO**

El componente `reconocimiento-facial-perfil-actualizado.tsx` ya está preparado para:
- ✅ Mostrar fotos cuando las recibe
- ✅ Manejar estados vacíos correctamente
- ✅ Recargar después de subir nuevas fotos

## ⚡ **SIGUIENTE PASO**

**VERIFICAR RESPUESTA DEL BACKEND** en el endpoint GET:
`http://localhost:8000/api/authz/reconocimiento/fotos/13/`

Debe devolver URLs de Dropbox como la foto_perfil.

---
**⏰ Fecha:** 28/09/2025  
**🎯 Estado:** PROBLEMA IDENTIFICADO - Backend no devuelve URLs Dropbox