# 🐍 Configuración Django Backend para CondoManager

Este archivo contiene las especificaciones que tu backend Django debe implementar para conectar correctamente con el frontend.

## 📋 Modelos Django Requeridos

### User Model (Extender el User de Django)
```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('administrator', 'Administrator'),
        ('security', 'Security'),
        ('owner', 'Owner'),
        ('tenant', 'Tenant'),
    ]
    
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tenant')
    unit_number = models.CharField(max_length=10, blank=True, null=True)
    profession = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Unidad Model
```python
class Unidad(models.Model):
    TIPO_CHOICES = [
        ('apartamento', 'Apartamento'),
        ('penthouse', 'Penthouse'),
        ('local', 'Local'),
    ]
    
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('ocupado', 'Ocupado'),
        ('alquilado', 'Alquilado'),
        ('mantenimiento', 'Mantenimiento'),
    ]
    
    numero = models.CharField(max_length=10, unique=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    area = models.DecimalField(max_digits=8, decimal_places=2)  # metros cuadrados
    habitaciones = models.IntegerField()
    banos = models.IntegerField()
    propietario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='unidades_propias')
    inquilino = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='unidades_alquiladas')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='disponible')
    valor_alquiler = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_compra = models.DateField()
    imagen = models.ImageField(upload_to='unidades/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### Transaccion Model
```python
class Transaccion(models.Model):
    TIPO_CHOICES = [
        ('ingreso', 'Ingreso'),
        ('gasto', 'Gasto'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('cancelado', 'Cancelado'),
    ]
    
    METODO_PAGO_CHOICES = [
        ('efectivo', 'Efectivo'),
        ('transferencia', 'Transferencia'),
        ('cheque', 'Cheque'),
        ('tarjeta', 'Tarjeta'),
    ]
    
    concepto = models.CharField(max_length=200)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha = models.DateField()
    unidad = models.ForeignKey(Unidad, on_delete=models.SET_NULL, null=True, blank=True)
    proveedor = models.CharField(max_length=200, blank=True, null=True)
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES, blank=True, null=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    comprobante = models.FileField(upload_to='comprobantes/', blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### IncidenteSeguridad Model
```python
class IncidenteSeguridad(models.Model):
    TIPO_CHOICES = [
        ('acceso', 'Control de Acceso'),
        ('incidente', 'Incidente'),
        ('emergencia', 'Emergencia'),
        ('mantenimiento', 'Mantenimiento'),
    ]
    
    GRAVEDAD_CHOICES = [
        ('bajo', 'Bajo'),
        ('medio', 'Medio'),
        ('alto', 'Alto'),
        ('critico', 'Crítico'),
    ]
    
    ESTADO_CHOICES = [
        ('abierto', 'Abierto'),
        ('en_proceso', 'En Proceso'),
        ('resuelto', 'Resuelto'),
        ('cerrado', 'Cerrado'),
    ]
    
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    ubicacion = models.CharField(max_length=200)
    nivel_gravedad = models.CharField(max_length=20, choices=GRAVEDAD_CHOICES)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='abierto')
    reportado_por = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incidentes_reportados')
    asignado_a = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='incidentes_asignados')
    fecha_incidente = models.DateTimeField()
    fecha_resolucion = models.DateTimeField(null=True, blank=True)
    evidencias = models.JSONField(default=list, blank=True)  # URLs de archivos
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### VisitaRegistro Model
```python
class VisitaRegistro(models.Model):
    TIPO_VISITA_CHOICES = [
        ('personal', 'Personal'),
        ('trabajo', 'Trabajo'),
        ('delivery', 'Delivery'),
        ('servicio', 'Servicio'),
    ]
    
    visitante_nombre = models.CharField(max_length=200)
    visitante_documento = models.CharField(max_length=50)
    unidad_destino = models.ForeignKey(Unidad, on_delete=models.CASCADE)
    tipo_visita = models.CharField(max_length=20, choices=TIPO_VISITA_CHOICES)
    hora_entrada = models.DateTimeField()
    hora_salida = models.DateTimeField(null=True, blank=True)
    autorizado_por = models.ForeignKey(User, on_delete=models.CASCADE)
    observaciones = models.TextField(blank=True, null=True)
    foto_visitante = models.ImageField(upload_to='visitantes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

## 🔗 URLs y Endpoints Requeridos

### settings.py
```python
# Django REST Framework
INSTALLED_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    # ... tus apps
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js dev server
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

### urls.py principal
```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/users/', include('users.urls')),
    path('api/unidades/', include('unidades.urls')),
    path('api/finanzas/', include('finanzas.urls')),
    path('api/seguridad/', include('seguridad.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### authentication/urls.py
```python
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh'),
    path('user/', views.CurrentUserView.as_view(), name='current_user'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset_password'),
]
```

### users/urls.py
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### finanzas/urls.py
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'transacciones', views.TransaccionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('estadisticas/', views.EstadisticasFinancierasView.as_view(), name='estadisticas'),
    path('reportes/mensual/', views.ReporteMensualView.as_view(), name='reporte_mensual'),
    path('reportes/estado-cuenta/', views.EstadoCuentaView.as_view(), name='estado_cuenta'),
    path('exportar/', views.ExportarTransaccionesView.as_view(), name='exportar'),
    path('categorias/', views.CategoriasView.as_view(), name='categorias'),
    path('metodos-pago/', views.MetodosPagoView.as_view(), name='metodos_pago'),
    path('balance/', views.BalanceGeneralView.as_view(), name='balance'),
]
```

## 📊 Serializers Requeridos

### UserSerializer
```python
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone', 
                 'avatar', 'role', 'unit_number', 'profession', 
                 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 
                 'phone', 'role', 'unit_number', 'profession']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
```

### TransaccionSerializer
```python
class TransaccionSerializer(serializers.ModelSerializer):
    unidad_numero = serializers.CharField(source='unidad.numero', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Transaccion
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at', 'updated_at']
```

## 🎯 ViewSets y Views Requeridos

### AuthenticationViews
```python
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status

class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                          context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            request.user.auth_token.delete()
        except:
            pass
        return Response({'message': 'Logout successful'})
```

### FinanzasViews
```python
class EstadisticasFinancierasView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        mes = request.GET.get('mes')
        anio = request.GET.get('anio')
        
        # Calcular estadísticas
        ingresos_mes = Transaccion.objects.filter(
            tipo='ingreso',
            fecha__month=mes,
            fecha__year=anio
        ).aggregate(total=models.Sum('monto'))['total'] or 0
        
        gastos_mes = Transaccion.objects.filter(
            tipo='gasto',
            fecha__month=mes,
            fecha__year=anio
        ).aggregate(total=models.Sum('monto'))['total'] or 0
        
        pagos_pendientes = Transaccion.objects.filter(
            estado='pendiente'
        ).aggregate(total=models.Sum('monto'))['total'] or 0
        
        pagos_pendientes_count = Transaccion.objects.filter(
            estado='pendiente'
        ).count()
        
        data = {
            'ingresos_mes': ingresos_mes,
            'gastos_mes': gastos_mes,
            'balance': ingresos_mes - gastos_mes,
            'pagos_pendientes': pagos_pendientes,
            'pagos_pendientes_count': pagos_pendientes_count,
            'variacion_ingresos': 12,  # Calcular vs mes anterior
            'variacion_gastos': 8,     # Calcular vs mes anterior
        }
        
        return Response(data)
```

## 🔧 Configuración Adicional

### Filtros y Búsqueda
```python
# Instalar django-filter
pip install django-filter

# En settings.py
INSTALLED_APPS += ['django_filters']

REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# En ViewSets
class TransaccionViewSet(viewsets.ModelViewSet):
    queryset = Transaccion.objects.all()
    serializer_class = TransaccionSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tipo', 'categoria', 'estado', 'unidad']
    search_fields = ['concepto', 'proveedor']
    ordering_fields = ['fecha', 'monto']
    ordering = ['-fecha']
```

### Permisos Personalizados
```python
from rest_framework.permissions import BasePermission

class IsAdministratorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return request.user.is_authenticated
        return request.user.is_authenticated and request.user.role == 'administrator'

class IsOwnerOrAdministrator(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'administrator':
            return True
        return obj.created_by == request.user
```

## 📦 Dependencias Django Requeridas

```bash
pip install django
pip install djangorestframework
pip install django-cors-headers
pip install django-filter
pip install Pillow  # Para ImageField
pip install python-decouple  # Para variables de entorno
```

## 🚀 Comandos de Migración

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

Con esta configuración, tu backend Django estará completamente integrado con el frontend Next.js de CondoManager.