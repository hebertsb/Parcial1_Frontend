# 🚨 PROMPT URGENTE PARA AGENTE BACKEND

## ⚠️ PROBLEMA CRÍTICO: ENDPOINTS DE SEGURIDAD FALTANTES

### 🎯 **SITUACIÓN ACTUAL:**
El frontend está intentando conectarse a endpoints de seguridad que **NO EXISTEN** en el backend Django, causando errores 404 masivos.

### � **TODOS LOS ENDPOINTS DEVUELVEN 404:**

```
❌ /api/authz/propietarios/subir-foto/ → 404
❌ /api/authz/propietarios/agregar-fotos-reconocimiento/ → 404  
❌ /authz/usuarios/me/ → 404 (¡ESTE TAMBIÉN!)
❌ /api/authz/propietarios/mis-fotos/ → Probablemente 404
```

### 📡 **ENDPOINTS CRÍTICOS NECESARIOS:**

#### 1. **SUBIR FOTOS DE RECONOCIMIENTO:**
```
POST /api/???/subir-fotos-reconocimiento/
```
**Usuario:** lara@gmail.com (ID: 13)  
**Body esperado:** ¿Files? ¿Base64? ¿FormData?  
**Respuesta:** URLs de Dropbox

#### 2. **OBTENER FOTOS PARA SEGURIDAD:**
```
GET /api/???/fotos-usuarios-reconocimiento/
```
    "alertas_criticas": 2,
    "accesos_hoy": 45,
    "incidentes_por_tipo": {
      "intrusion": 2,
      "vandalismo": 1,
      "ruido": 2
    },
    "incidentes_por_gravedad": {
      "bajo": 2,
      "medio": 2,
      "alto": 1
    },
    "visitas_por_hora": [
      {"hora": "08:00", "cantidad": 5},
      {"hora": "09:00", "cantidad": 8}
    ],
    "incidentes_recientes": [],
    "alertas_activas": []
  }
}
```

#### 2. **Gestión de Incidentes:**
```
GET /api/seguridad/incidentes/
POST /api/seguridad/incidentes/
GET /api/seguridad/incidentes/{id}/
PUT /api/seguridad/incidentes/{id}/
DELETE /api/seguridad/incidentes/{id}/
```

**Campos del modelo Incidente:**
```python
class IncidenteSeguridad(models.Model):
    TIPOS_INCIDENTE = [
        ('intrusion', 'Intrusión'),
        ('vandalismo', 'Vandalismo'), 
        ('ruido', 'Ruido excesivo'),
        ('emergencia', 'Emergencia médica'),
        ('otro', 'Otro')
    ]
    
    ESTADOS = [
        ('abierto', 'Abierto'),
        ('en_proceso', 'En Proceso'),
        ('resuelto', 'Resuelto'),
        ('cerrado', 'Cerrado')
    ]
    
    GRAVEDAD = [
        ('bajo', 'Bajo'),
        ('medio', 'Medio'),
        ('alto', 'Alto'),
        ('critico', 'Crítico')
    ]
    
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPOS_INCIDENTE)
    gravedad = models.CharField(max_length=10, choices=GRAVEDAD)
    estado = models.CharField(max_length=15, choices=ESTADOS, default='abierto')
    ubicacion = models.CharField(max_length=200)
    reportado_por = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incidentes_reportados')
    asignado_a = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidentes_asignados')
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    solucion = models.TextField(blank=True)
```

#### 3. **Gestión de Visitas:**
```
GET /api/seguridad/visitas/
POST /api/seguridad/visitas/
GET /api/seguridad/visitas/activas/
POST /api/seguridad/visitas/{id}/salida/
```

**Campos del modelo Visita:**
```python
class VisitaRegistro(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'),
        ('autorizada', 'Autorizada'),
        ('denegada', 'Denegada'),
        ('activa', 'Activa'),
        ('finalizada', 'Finalizada')
    ]
    
    nombre_visitante = models.CharField(max_length=200)
    documento_visitante = models.CharField(max_length=50)
    telefono_visitante = models.CharField(max_length=20, blank=True)
    unidad_destino = models.CharField(max_length=50)
    residente_contacto = models.CharField(max_length=200)
    motivo_visita = models.TextField()
    estado = models.CharField(max_length=15, choices=ESTADOS, default='pendiente')
    fecha_entrada = models.DateTimeField(auto_now_add=True)
    fecha_salida = models.DateTimeField(null=True, blank=True)
    autorizado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    observaciones = models.TextField(blank=True)
```

#### 4. **Sistema de Alertas:**
```
GET /api/seguridad/alertas/activas/
POST /api/seguridad/alertas/
POST /api/seguridad/alertas/{id}/desactivar/
```

**Campos del modelo Alerta:**
```python
class AlertaSeguridad(models.Model):
    TIPOS_ALERTA = [
        ('emergencia', 'Emergencia'),
        ('intrusion', 'Intrusión'),
        ('fuego', 'Fuego'),
        ('medica', 'Médica'),
        ('otro', 'Otro')
    ]
    
    PRIORIDADES = [
        ('bajo', 'Bajo'),
        ('medio', 'Medio'),
        ('alto', 'Alto'),
        ('critico', 'Crítico')
    ]
    
    tipo = models.CharField(max_length=20, choices=TIPOS_ALERTA)
    ubicacion = models.CharField(max_length=200)
    descripcion = models.TextField()
    nivel_prioridad = models.CharField(max_length=10, choices=PRIORIDADES)
    activa = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    resuelto_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
```

#### 5. **Sistema de Reconocimiento (YA IMPLEMENTADO):**
```
GET /seguridad/api/usuarios-reconocimiento/  ✅ FUNCIONANDO
```

### 🔧 **CONFIGURACIÓN REQUERIDA:**

#### **1. URLs del Backend (urls.py):**
```python
from django.urls import path, include
from . import views

urlpatterns = [
    # Dashboard
    path('api/seguridad/dashboard/', views.SeguridadDashboardView.as_view(), name='seguridad-dashboard'),
    
    # Incidentes
    path('api/seguridad/incidentes/', views.IncidenteListCreateView.as_view(), name='incidentes-list-create'),
    path('api/seguridad/incidentes/<int:pk>/', views.IncidenteDetailView.as_view(), name='incidente-detail'),
    
    # Visitas
    path('api/seguridad/visitas/', views.VisitaListCreateView.as_view(), name='visitas-list-create'),
    path('api/seguridad/visitas/activas/', views.VisitasActivasView.as_view(), name='visitas-activas'),
    path('api/seguridad/visitas/<int:pk>/salida/', views.RegistrarSalidaView.as_view(), name='registrar-salida'),
    
    # Alertas
    path('api/seguridad/alertas/activas/', views.AlertasActivasView.as_view(), name='alertas-activas'),
    path('api/seguridad/alertas/', views.AlertaListCreateView.as_view(), name='alertas-list-create'),
    path('api/seguridad/alertas/<int:pk>/desactivar/', views.DesactivarAlertaView.as_view(), name='desactivar-alerta'),
]
```

#### **2. Permisos de Usuario Seguridad:**
```python
# El usuario seguridad@facial.com debe tener:
- Acceso a TODOS los endpoints de seguridad
- Rol 'Seguridad' o 'security' 
- Permisos para ver todos los usuarios con reconocimiento facial

# ⚠️ PROBLEMA CRÍTICO DE AUTENTICACIÓN:
# El endpoint /seguridad/api/usuarios-reconocimiento/ retorna 401 Unauthorized
# para el usuario de seguridad, pero este usuario DEBE tener acceso completo.
# VERIFICAR Y CORREGIR los permisos inmediatamente.
```

### 🎯 **RESULTADO ESPERADO:**
Después de implementar estos endpoints, el frontend debería:
1. ✅ Cargar el dashboard sin errores 404
2. ✅ Mostrar datos reales de incidentes, visitas y alertas
3. ✅ Permitir gestión completa del sistema de seguridad

### 🚨 **PRIORIDAD CRÍTICA:**
Estos endpoints son **INDISPENSABLES** para el funcionamiento del sistema de seguridad. El frontend ya está completamente implementado y solo necesita que el backend provea estos endpoints.

### 📋 **CHECKLIST DE IMPLEMENTACIÓN:**
- [ ] Crear modelos IncidenteSeguridad, VisitaRegistro, AlertaSeguridad
- [ ] Implementar views para dashboard de seguridad
- [ ] Crear serializers para todos los modelos
- [ ] Configurar URLs en el routing principal
- [ ] Verificar permisos de usuario 'seguridad@facial.com'
- [ ] Probar todos los endpoints con datos de ejemplo
- [ ] Confirmar que retornan status 200 con estructura JSON esperada

**Una vez implementado, el sistema de seguridad estará completamente funcional.**