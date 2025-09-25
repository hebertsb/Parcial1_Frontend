# 🚨 SOLUCIÓN PARA ERROR 500 DEL BACKEND

## ❌ **PROBLEMA IDENTIFICADO:**

**Error:** `Field name 'tipo_documento' is not valid for model 'Persona'`

**Archivo problemático:** `core.api.viviendas.serializers.PersonaBasicSerializer`

**Causa:** El serializer está intentando acceder a un campo que no existe en el modelo.

## ✅ **SOLUCIONES POSIBLES:**

### **Opción 1: Eliminar el campo del serializer (RECOMENDADO)**

Editar el archivo `core/api/viviendas/serializers.py`:

```python
class PersonaBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persona
        fields = [
            'id',
            'nombre', 
            'apellido',
            'documento_identidad',  # NO 'tipo_documento'
            'telefono',
            'email',
            'fecha_nacimiento',
            'activo',
            'created_at',
            'updated_at'
        ]
        # Eliminar 'tipo_documento' de la lista de campos
```

### **Opción 2: Agregar el campo al modelo (SI ES NECESARIO)**

Si realmente necesitas el campo `tipo_documento`, agrégalo al modelo `Persona`:

```python
# En models.py
class Persona(models.Model):
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    documento_identidad = models.CharField(max_length=20)
    tipo_documento = models.CharField(max_length=10, choices=[
        ('CI', 'Cédula de Identidad'),
        ('PASSPORT', 'Pasaporte'),
        ('OTHER', 'Otro')
    ], default='CI')  # ← AGREGAR ESTE CAMPO
    # ... otros campos
```

Y luego ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

### **Opción 3: Usar un método o property (ALTERNATIVA)**

Si es un campo calculado:

```python
class PersonaBasicSerializer(serializers.ModelSerializer):
    tipo_documento = serializers.SerializerMethodField()
    
    class Meta:
        model = Persona
        fields = [
            'id', 'nombre', 'apellido', 'documento_identidad',
            'tipo_documento', 'telefono', 'email', 'activo'
        ]
    
    def get_tipo_documento(self, obj):
        # Lógica para determinar el tipo de documento
        return 'CI'  # o la lógica que necesites
```

## 🔧 **PASOS PARA CORREGIR:**

1. **Identificar qué campos realmente existen en el modelo `Persona`**
2. **Actualizar el serializer para usar solo campos válidos**
3. **Probar el endpoint:** `GET http://127.0.0.1:8000/api/personas/`
4. **Verificar que ya no retorne error 500**

## 📋 **VERIFICACIÓN RÁPIDA:**

Para verificar qué campos tiene tu modelo `Persona`, ejecuta en Django shell:

```python
python manage.py shell

# En el shell:
from core.models import Persona
print([field.name for field in Persona._meta.fields])
```

Esto te mostrará todos los campos disponibles en el modelo.

## 🎯 **ESTADO ACTUAL DEL FRONTEND:**

✅ **El frontend YA está funcionando** con datos de fallback  
✅ **Manejo de errores implementado**  
✅ **Mensaje específico sobre el problema del backend**  
✅ **No requiere cambios en el frontend**  

Una vez que corrijas el backend, el frontend automáticamente empezará a usar los datos reales en lugar de los datos de fallback.

## 🚀 **PRÓXIMOS PASOS:**

1. **Corregir el serializer del backend** (usar una de las opciones de arriba)
2. **Reiniciar el servidor Django**
3. **Probar:** `curl http://127.0.0.1:8000/api/personas/` 
4. **Verificar que el frontend ahora muestre datos reales**

¡El problema está 100% en el backend y es fácil de corregir!