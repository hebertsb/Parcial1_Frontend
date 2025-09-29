# 🚀 GUÍA DE TESTING SISTEMA AUTOMÁTICO

## 📋 **PLAN DE PRUEBAS COMPLETO**

### **🧪 Test Suite 1: Flujo Automático Completo**

#### **Test 1.1: Solicitud → Usuario Automático**
```bash
# Paso 1: Crear solicitud nueva
curl -X POST http://localhost:8000/api/solicitudes-registro-propietario/ \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Usuario Nuevo",
    "apellido": "Apellido Test", 
    "email": "testnuevo@automatico.com",
    "telefono": "12345999",
    "documento_identidad": "TEST999"
  }'

# Resultado esperado: Solicitud creada con ID
# Status: PENDIENTE
```

#### **Test 1.2: Aprobación Admin → Creación Automática**
```bash
# Paso 2: Admin aprueba solicitud
# Login como admin → Panel solicitudes → Aprobar
# Sistema debe crear automáticamente:
# - Usuario (rol: propietario)
# - Copropietarios vinculado
# - Credenciales temporales

# Verificar creación:
curl -H "Authorization: Bearer {admin_token}" \
  http://localhost:8000/api/authz/usuarios/?email=testnuevo@automatico.com
```

#### **Test 1.3: Login → Panel Propietario**
```bash
# Paso 3: Login con usuario nuevo
# Email: testnuevo@automatico.com
# Password: {contraseña_temporal}

# Verificar acceso a:
# - /propietario/dashboard
# - /propietario/perfil  
# - Panel de fotos reconocimiento
```

### **🧪 Test Suite 2: Reconocimiento Automático**

#### **Test 2.1: Subida de Fotos**
```javascript
// Paso 1: Usuario sube 3-5 fotos
// Endpoint: POST /api/authz/reconocimiento/fotos/
// Verificar:
// - Subida a Dropbox exitosa
// - Respuesta success: true
// - total_fotos: 5
```

#### **Test 2.2: Aparición en Panel Seguridad**
```bash
# Paso 2: Verificar aparición automática
curl -H "Authorization: Bearer {seguridad_token}" \
  http://localhost:8000/seguridad/api/usuarios-reconocimiento/

# Debe incluir:
# - testnuevo@automatico.com
# - Con fotos de reconocimiento
# - Estado activo
```

#### **Test 2.3: Reconocimiento Facial**
```javascript
// Paso 3: Test reconocimiento en panel seguridad
// Login: seguridad@facial.com / 123456
// Panel reconocimiento → Tomar foto
// Debe identificar: "Test Usuario Nuevo"
```

---

## 🎯 **CASOS DE PRUEBA ESPECÍFICOS**

### **Caso 1: Usuario Sin Fotos**
```
Flujo: Solicitud → Aprobación → Login (sin subir fotos)
Panel Seguridad: NO debe aparecer
Estado: "Sin fotos de reconocimiento"
```

### **Caso 2: Usuario Con Fotos**  
```
Flujo: Solicitud → Aprobación → Login → Subir fotos
Panel Seguridad: SÍ debe aparecer
Estado: "Activo con X fotos"
```

### **Caso 3: Reconocimiento Exitoso**
```
Usuario con fotos → Panel seguridad → Cámara → Foto
Resultado: Identificación correcta con nombre y unidad
```

### **Caso 4: Reconocimiento Fallido**
```
Foto de persona no registrada → Panel seguridad → Cámara
Resultado: "No se encontró coincidencia"
```

---

## 📊 **CHECKLIST DE VERIFICACIÓN**

### **✅ Backend Automático**
- [ ] Endpoint solicitudes funcionando
- [ ] Creación automática usuario aprobación
- [ ] Vinculación Copropietarios automática
- [ ] Endpoint fotos reconocimiento
- [ ] Aparición automática en lista seguridad

### **✅ Frontend Automático**  
- [ ] Formulario solicitud funcional
- [ ] Panel admin aprobaciones
- [ ] Login usuarios nuevos
- [ ] Subida fotos propietario
- [ ] Panel seguridad actualizado

### **✅ Integración Automática**
- [ ] JWT tokens funcionando
- [ ] Role-based access correcto
- [ ] Error handling robusto
- [ ] Data consistency entre tablas
- [ ] Real-time updates en UI

---

## 🔧 **DEBUGGING AVANZADO**

### **Debug 1: Usuario No Aparece en Seguridad**
```sql
-- Verificar cadena de datos
SELECT u.id, u.email, c.id as coprop_id, rf.id as reconoc_id
FROM usuarios u
LEFT JOIN copropietarios c ON u.id = c.usuario_id  
LEFT JOIN reconocimiento_facial rf ON c.id = rf.copropietario_id
WHERE u.email = 'usuario@test.com';
```

### **Debug 2: Fotos No Se Guardan**
```bash
# Verificar logs backend
tail -f logs/django.log | grep "reconocimiento"

# Verificar Dropbox API
curl -X POST https://api.dropboxapi.com/2/files/upload \
  -H "Authorization: Bearer {dropbox_token}"
```

### **Debug 3: Reconocimiento No Funciona**
```javascript
// Verificar respuesta endpoint
console.log("Usuarios cargados:", usuariosReconocimiento);
console.log("Total usuarios:", usuariosReconocimiento.length);
console.log("Usuario test:", usuariosReconocimiento.find(u => u.email === 'test@email.com'));
```

---

## 🎊 **CERTIFICACIÓN DEL SISTEMA**

### **🏆 CRITERIOS DE ÉXITO**

#### **Automatización (100%)**
- ✅ Solicitud → Usuario sin intervención manual
- ✅ Fotos → Panel seguridad automático
- ✅ Reconocimiento facial operativo

#### **Performance (95%+)**  
- ✅ Tiempo solicitud → usuario: < 2 min
- ✅ Tiempo fotos → panel: < 30 seg
- ✅ Tiempo reconocimiento: < 5 seg

#### **Reliability (99%+)**
- ✅ Error handling completo
- ✅ Data consistency garantizada  
- ✅ Security tokens funcionales

---

**🎯 OBJETIVO: Demostrar que el sistema funciona 100% automático para nuevos usuarios sin intervención manual**

*Testing Guide - 28 de septiembre de 2025*