# 🆘 URGENTE: CONSULTA AL BACKEND DJANGO

## 🚨 **PROBLEMA CRÍTICO**

**TODOS los endpoints están devolviendo 404** - El sistema de reconocimiento facial está **completamente bloqueado**.

```bash
❌ PATCH http://localhost:8000/authz/usuarios/me/ 404 (Not Found)
❌ POST /api/authz/propietarios/subir-foto/ 404 (Not Found)  
❌ POST /api/authz/propietarios/agregar-fotos-reconocimiento/ 404 (Not Found)
```

## 🎯 **PREGUNTA DIRECTA AL BACKEND**

**¿Qué endpoints están REALMENTE implementados para manejar fotos de reconocimiento facial?**

### **ESCENARIO ESPECÍFICO:**
- **Usuario**: `lara@gmail.com` (ID: 13, rol: propietario)
- **Objetivo**: Subir 3 fotos desde su panel → Dropbox → Mostrar en panel de seguridad
- **Frontend**: React (http://localhost:3000)
- **Backend**: Django (http://localhost:8000)
- **Auth**: JWT token en `Authorization: Bearer {token}`

### **INFORMACIÓN REQUERIDA:**

#### **A) ENDPOINT PARA SUBIR FOTOS**
```
URL: ¿/api/que/endpoint/exacto/?
Método: ¿POST? ¿PATCH? ¿PUT?
Headers: ¿Qué headers necesito?
Body: ¿FormData con Files? ¿JSON con base64? ¿Otro formato?
```

#### **B) ENDPOINT PARA OBTENER FOTOS** 
```
URL: ¿/api/que/endpoint/para/obtener/?
Método: ¿GET?
Respuesta: ¿Devuelve array de URLs de Dropbox?
```

#### **C) FLUJO COMPLETO**
```
1. Usuario sube fotos → ¿Endpoint?
2. Backend procesa → ¿Dropbox automático?
3. Panel seguridad obtiene → ¿Endpoint?
4. Muestra fotos → ¿URLs directas de Dropbox?
```

## 💡 **CONTEXTO DEL SISTEMA**

El registro inicial de propietarios **SÍ funciona** con fotos:
- Formulario envía `fotos_base64` array
- Backend las procesa → Dropbox 
- Genera URLs como: `https://dl.dropboxusercontent.com/scl/fi/...`

**¿Puedo usar el mismo flujo para fotos adicionales?**

## 🔧 **DEBUGGING INFO**

```javascript
// Usuario actual del frontend:
const user = {
  id: '13',
  email: 'lara@gmail.com', 
  name: 'lara perez',
  role: 'propietario'
};

// Token disponible:
const token = localStorage.getItem('access_token'); // ✅ Existe

// Fotos a subir:
const fotos = [
  'Gemini_Generated_Image_hoq1kphoq1kphoq1.png (1.18MB)',
  'Gemini_Generated_Image_kcnxqskcnxqskcnx.png (1.14MB)', 
  'Gemini_Generated_Image_13k8j913k8j913k8.png (1.16MB)'
];
```

## 📋 **RESPUESTA NECESARIA**

Por favor proporciona:

1. **Lista de endpoints REALES** que están implementados
2. **Formato exacto** de peticiones y respuestas  
3. **Headers requeridos** (Authorization, Content-Type, etc.)
4. **Estructura de datos** esperada (FormData vs JSON vs otro)
5. **URLs de ejemplo** de respuestas exitosas

## ⏰ **URGENCIA**

Sistema de seguridad **100% bloqueado** hasta tener esta información.

**Usuario final esperando**: lara perez no puede usar reconocimiento facial.

---
**Fecha**: 28/09/2025  
**Estado**: SISTEMA BLOQUEADO - NECESITA ENDPOINTS BACKEND