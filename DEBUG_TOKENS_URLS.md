# 🔍 DEBUG - VERIFICACIÓN DE TOKENS Y URLs

## **Pasos para Debuggear:**

### 1. **Abrir DevTools en el navegador**
```javascript
// 1. Verificar tokens disponibles
console.log('🔑 Tokens disponibles:');
console.log('access_token:', localStorage.getItem('access_token'));
console.log('token:', localStorage.getItem('token'));
console.log('authToken:', localStorage.getItem('authToken'));

// 2. Verificar usuario actual
console.log('👤 Usuario actual:', localStorage.getItem('user'));

// 3. Limpiar cache completamente
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. **URLs Problemáticas Detectadas:**
- ❌ `http://localhost:8000/api/api/seguridad/visitas/activas/`
- ❌ `http://127.0.0.1:8000/seguridad/api/usuarios-reconocimiento/` (401)

### 3. **URLs Correctas Esperadas:**
- ✅ `http://127.0.0.1:8000/api/seguridad/visitas/activas/`
- ✅ `http://127.0.0.1:8000/seguridad/api/usuarios-reconocimiento/`

### 4. **Acciones Inmediatas:**
1. **Limpiar cache del navegador** (Ctrl+Shift+Del)
2. **Recargar página sin cache** (Ctrl+F5)
3. **Verificar que usa access_token** (corrección aplicada)
4. **Confirmar BASE_URL** (ya corregido a 127.0.0.1:8000)

### 5. **Si persiste el problema:**
Ejecutar en consola del navegador:
```javascript
// Forzar logout y login nuevamente
localStorage.removeItem('access_token');
window.location.href = '/';
```

Luego login con: `seguridad@facial.com / seguridad123`

## 🎯 **Resultado Esperado:**
- ✅ URLs sin duplicación `/api/api/`
- ✅ Token `access_token` enviado correctamente
- ✅ Endpoint de reconocimiento responde 200
- ✅ Dashboard carga sin errores 404