# 🧪 GUÍA DE PRUEBAS - PANEL SEGURIDAD INTEGRADO

## 🚀 SISTEMA LISTO PARA TESTING

### 📊 **Estado Actual:**
- ✅ Frontend: `http://localhost:3001`
- ✅ Backend: `http://127.0.0.1:8000` (asumido)
- ✅ Integración: Completamente dinámica
- ✅ Endpoints: 7/7 implementados según confirmación

---

## 🔄 **FLUJO DE PRUEBAS COMPLETO:**

### **PASO 1: Acceso al Sistema**

1. **Abrir navegador en:**
   ```
   http://localhost:3000
   ```

2. **Navegar al dashboard de seguridad:**
   ```
   http://localhost:3000/security
   ```

3. **Credenciales de prueba:**
   - **Email**: `seguridad@facial.com`
   - **Password**: `seguridad123`

---

### **PASO 2: Testing del Panel de Reconocimiento**

#### ✅ **Escenario Exitoso:**

**Acciones:**
1. Hacer clic en "Reconocimiento Facial"
2. Observar spinner de carga
3. Verificar que se cargan usuarios dinámicamente

**Resultados Esperados:**
```
✅ Loading spinner aparece
✅ Se realiza llamada a: GET /seguridad/api/usuarios-reconocimiento/
✅ Token JWT se envía en headers
✅ Lista de usuarios aparece
✅ Estadísticas se actualizan automáticamente
✅ Funciones de búsqueda están activas
```

**Logs en Consola:**
```
🎉 Cargando usuarios desde endpoints IMPLEMENTADOS del backend...
🔄 Cargando usuarios con reconocimiento facial desde endpoint real...
📡 Llamando a: http://127.0.0.1:8000/seguridad/api/usuarios-reconocimiento/
✅ Datos recibidos del backend: {success: true, data: [...]}
✅ Cargados X usuarios con reconocimiento facial
```

#### ❌ **Escenario de Error (si backend no responde):**

**Resultados Esperados:**
```
❌ Mensaje de error amigable
❌ Lista de endpoints requeridos
❌ Botón "Reintentar" disponible
❌ Logs de error detallados en consola
```

---

### **PASO 3: Verificación de Funcionalidades**

#### **3.1 Búsqueda:**
- Escribir en el campo de búsqueda
- Verificar filtrado en tiempo real por:
  - Nombre
  - Email  
  - Unidad

#### **3.2 Vista Detallada:**
- Hacer clic en "Ver Detalles"
- Verificar modal con información completa
- Confirmar que muestra fotos del usuario

#### **3.3 Estadísticas:**
- Verificar contadores:
  - Total de usuarios
  - Usuarios activos
  - Usuarios inactivos

---

### **PASO 4: Testing de Integración Backend**

#### **Endpoint Principal:**
```bash
curl -X GET "http://127.0.0.1:8000/seguridad/api/usuarios-reconocimiento/" \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json"
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "nombre": "Usuario Real",
      "email": "usuario@email.com", 
      "telefono": "123456789",
      "unidad": "A-101",
      "fotos_urls": ["url1", "url2"],
      "total_fotos": 10,
      "fecha_actualizacion": "2024-01-01",
      "activo": true
    }
  ]
}
```

---

### **PASO 5: Verificación de Errores**

#### **5.1 Sin Autenticación:**
- Remover token de localStorage
- Intentar acceder al panel
- Verificar redirección a login

#### **5.2 Backend Offline:**
- Detener servidor Django
- Recargar panel
- Verificar mensaje de error y botón reintentar

#### **5.3 Token Expirado:**
- Usar token vencido
- Verificar manejo de error 401/403

---

## 🔍 **DEBUGGING TOOLS:**

### **Consola del Navegador:**
```javascript
// Verificar token
console.log(localStorage.getItem('authToken'));

// Verificar datos cargados
console.log('Usuarios cargados:', propietarios);

// Forzar recarga
window.location.reload();
```

### **Network Tab:**
- Verificar llamadas HTTP
- Confirmar headers Authorization
- Revisar response codes

### **React DevTools:**
- Verificar estado de componentes
- Monitorear re-renders
- Inspeccionar props y state

---

## 🎯 **CRITERIOS DE ÉXITO:**

### ✅ **Completamente Exitoso:**
- [ ] Panel carga sin errores
- [ ] Usuarios se muestran dinámicamente  
- [ ] Búsqueda funciona correctamente
- [ ] Estadísticas se actualizan
- [ ] Vista detallada funciona
- [ ] Manejo de errores robusto
- [ ] Logs claros en consola

### ⚠️ **Parcialmente Exitoso:**
- [ ] Panel carga pero con errores menores
- [ ] Algunos usuarios se muestran
- [ ] Funcionalidades básicas operativas

### ❌ **Fallido:**
- [ ] Panel no carga
- [ ] Error 404 en endpoints
- [ ] No se muestran usuarios
- [ ] Errores críticos en consola

---

## 🛠️ **SOLUCIÓN DE PROBLEMAS:**

### **Error más común:**
```
❌ Error: Request failed with status code 404
```

**Solución:**
1. Verificar que backend esté corriendo en puerto 8000
2. Confirmar que endpoints estén implementados
3. Revisar CORS configuration

### **Segundo error común:**
```
❌ Error: Network Error
```

**Solución:**
1. Verificar conectividad backend
2. Confirmar URL correcta
3. Revisar configuración de red

---

**📅 CREADO:** Septiembre 28, 2025  
**🎯 PROPÓSITO:** Testing completo del sistema integrado  
**📊 COBERTURA:** Frontend + Backend + Errores  
**🚀 STATUS:** LISTO PARA PRUEBAS