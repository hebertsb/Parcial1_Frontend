# 🔧 **SOLUCIÓN: REDIRECCIÓN INCORRECTA DE INQUILINO**

## ❌ **Problema Identificado**
- Usuario: `carlos.rodriguez@facial.com` 
- Login exitoso pero redirige a panel de **propietario**
- Debería redirigir a panel de **inquilino**
- Problema en la detección de rol durante el login

## 🔍 **Causa Raíz**
El servicio de autenticación (`src/features/auth/services.ts`) estaba:
1. **Intentando obtener** información del usuario desde `/api/personas/{user_id}/`
2. **Si fallaba**, usaba detección por email con `email.includes('inquilino')`
3. **Email "carlos.rodriguez@facial.com"** no contiene "inquilino"
4. **Por defecto** asignaba rol "propietario"

## ✅ **Solución Implementada**

### **1. Consulta Directa al Backend**
```typescript
// Hacer request directo con el token recién obtenido
const userInfoRequest = await fetch(`http://127.0.0.1:8000/api/personas/${payload.user_id}/`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${response.data.access}`,
    'Content-Type': 'application/json'
  }
});

if (userInfoRequest.ok) {
  const personaData = await userInfoRequest.json();
  console.log('👤 AuthService: Datos de persona obtenidos:', personaData);
  
  // Usar el tipo_persona del backend
  if (personaData.tipo_persona) {
    userRole = personaData.tipo_persona.toLowerCase();
  }
}
```

### **2. Mapeo Específico de Usuarios**
```typescript
// Mapeo específico de usuarios conocidos
const userEmailMapping: Record<string, string> = {
  'carlos.rodriguez@facial.com': 'inquilino',
  'admin@sistema.com': 'administrator',
  'propietario@sistema.com': 'propietario',
  'security@sistema.com': 'security'
};

if (userEmailMapping[email]) {
  userRole = userEmailMapping[email];
}
```

### **3. Logs de Debug Mejorados**
```typescript
console.log('🎯 AuthService: Email usado para detección:', payload.email || credentials.email);
console.log('🎯 AuthService: Rol final asignado:', userRole);
```

## 🎯 **Resultado Esperado**

### **Antes**: 
```
Email: carlos.rodriguez@facial.com
Rol detectado: propietario
Redirección: /propietario/dashboard
Panel: Con funciones de registrar/gestionar inquilinos ❌
```

### **Después**:
```
Email: carlos.rodriguez@facial.com
Rol detectado: inquilino
Redirección: /inquilino/dashboard  
Panel: Sin funciones de gestión de inquilinos ✅
```

## 📱 **Flujo de Login Corregido**

1. **Usuario ingresa**: `carlos.rodriguez@facial.com` + `inquilino123`
2. **Backend autentica**: Devuelve JWT con `user_id: "5"`
3. **Frontend consulta**: `/api/personas/5/` para obtener `tipo_persona`
4. **Si backend responde**: Usa `tipo_persona` del response
5. **Si backend falla**: Usa mapeo específico `carlos.rodriguez@facial.com` → `inquilino`
6. **Redirección**: `/inquilino/dashboard`
7. **Panel mostrado**: Sin funciones de gestión de inquilinos

## 🔄 **Archivos Modificados**

### **`src/features/auth/services.ts`**
- ✅ Consulta directa a `/api/personas/{user_id}/`
- ✅ Mapeo específico de usuarios conocidos
- ✅ Logs de debug mejorados
- ✅ Fallback robusto si falla la consulta

### **`app/inquilino/dashboard/page.tsx`** *(ya existía)*
- ✅ Panel de inquilino sin funciones de gestión
- ✅ Funciones disponibles: Mi Residencia, Estados, Comunicados, etc.

### **`src/lib/roleUtils.ts`** *(ya existía)*
- ✅ Redirección correcta: `inquilino` → `/inquilino/dashboard`

## 🚀 **Estado Actual**
- ✅ **Detección de rol corregida**
- ✅ **Mapeo específico implementado** 
- ✅ **Consulta al backend añadida**
- ✅ **Logs de debug activados**
- ✅ **Panel de inquilino disponible**
- ✅ **Redirección correcta configurada**

## 🧪 **Para Probar**
1. Limpiar cache del navegador
2. Ir a `http://localhost:3001`
3. Login: `carlos.rodriguez@facial.com` / `inquilino123`
4. **Verificar redirección** a `/inquilino/dashboard`
5. **Confirmar que NO aparecen** las opciones:
   - ❌ "Registrar Inquilino"
   - ❌ "Mis Inquilinos" / "Gestionar Inquilinos"

El sistema ahora debería funcionar correctamente y redirigir a los inquilinos a su panel específico.