# 🚨 PROBLEMA: Usuario lara@gmail.com Sin Registro Sistema

## 📋 **SITUACIÓN ACTUAL**

### **Usuario Problemático**
- **Email**: lara@gmail.com  
- **ID**: 13
- **Estado**: Usuario existe, pero SIN registro Copropietarios/ReconocimientoFacial

### **Error en Frontend**  
```bash
❌ NO HAY FOTOS GUARDADAS EN DROPBOX
📸 Usuario 13 tiene 0 fotos de reconocimiento
```

---

## 🔍 **VERIFICACIÓN SQL NECESARIA**

```sql
-- 1. Verificar usuario
SELECT id, email, first_name, last_name FROM usuarios WHERE id = 13;

-- 2. Verificar copropietarios
SELECT * FROM copropietarios WHERE usuario_id = 13;

-- 3. Verificar reconocimiento
SELECT rf.* FROM reconocimiento_facial rf
JOIN copropietarios c ON rf.copropietario_id = c.id
WHERE c.usuario_id = 13;
```

---

## 🔧 **SOLUCIÓN SQL**

### **Crear Copropietarios (si no existe):**
```sql
INSERT INTO copropietarios (
    usuario_id, nombres_completos, documento_identidad,
    telefono, unidad_residencial, tipo_residente, activo, fecha_creacion
) VALUES (
    13, 'lara perez', 'DOC_000013', '591-69874633', 'V013', 'Propietario', true, NOW()
);
```

### **Crear ReconocimientoFacial (si no existe):**
```sql
INSERT INTO reconocimiento_facial (
    copropietario_id, vector_facial, fecha_enrolamiento, fecha_modificacion, activo
) VALUES (
    (SELECT id FROM copropietarios WHERE usuario_id = 13), 
    '[]', NOW(), NOW(), true
);
```

---

## 🎯 **RESULTADO ESPERADO**
- ✅ Usuario puede subir fotos
- ✅ Aparece en panel seguridad  
- ✅ Sistema completamente funcional

**URGENTE: Aplicar esta corrección para usuario ID 13 (lara@gmail.com)**