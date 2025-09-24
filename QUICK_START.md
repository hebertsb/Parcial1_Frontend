# 🚀 Guía Rápida de Conexión Django

## ⚡ Pasos Rápidos para Conectar

### 1. 🔧 Configurar Frontend
```bash
# En la carpeta del proyecto
cd Frontend_Parcial1

# Crear archivo de configuración
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### 2. 🐍 Configurar Django Backend
```bash
# Crear proyecto Django (si no existe)
django-admin startproject condomanager_backend
cd condomanager_backend

# Instalar dependencias
pip install django djangorestframework django-cors-headers django-filter Pillow

# Crear apps necesarias
python manage.py startapp authentication
python manage.py startapp users
python manage.py startapp unidades
python manage.py startapp finanzas
python manage.py startapp seguridad

# Aplicar configuración (ver DJANGO_BACKEND_CONFIG.md)
# Hacer migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
# Email: admin@condomanager.com
# Password: password123

# Ejecutar servidor
python manage.py runserver
```

### 3. 🧪 Probar Conexión
```bash
# En el navegador, ir a la consola del desarrollo (F12)
# En la página del frontend (http://localhost:3000)

# Ejecutar en la consola:
import('/utils/testBackend.js').then(test => test.runBackendTests())

# O verificar configuración:
import('/utils/testBackend.js').then(test => test.checkConfiguration())
```

## 🔗 URLs de Prueba

### Frontend
- **Desarrollo**: http://localhost:3000
- **Login**: Email: `admin@condomanager.com` | Password: `password123`

### Backend Django
- **API**: http://localhost:8000/api/
- **Admin**: http://localhost:8000/admin/
- **Health**: http://localhost:8000/api/health/ (si implementas endpoint)

## 📋 Checklist de Verificación

### ✅ Frontend (Next.js)
- [ ] `npm run dev` ejecutándose en puerto 3000
- [ ] Archivo `.env.local` creado con `NEXT_PUBLIC_API_URL`
- [ ] Login page carga correctamente
- [ ] No hay errores en consola del navegador

### ✅ Backend (Django)
- [ ] `python manage.py runserver` ejecutándose en puerto 8000
- [ ] CORS configurado para `http://localhost:3000`
- [ ] JWT/Token authentication configurado
- [ ] Modelos creados y migrados
- [ ] Superusuario creado
- [ ] Endpoints de API respondiendo

### ✅ Conexión
- [ ] Frontend puede hacer login
- [ ] API responses en formato JSON correcto
- [ ] Autenticación JWT funcionando
- [ ] CRUD operations funcionando

## 🐛 Problemas Comunes

### Error CORS
```python
# En Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

### Error de Autenticación
```python
# Verificar que Token está en headers
# En Django, usar TokenAuthentication o JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}
```

### API URL Incorrecta
```bash
# Verificar en .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
# SIN slash al final después de api
```

## 📞 Comandos de Debug

### Verificar que Django está corriendo
```bash
curl http://localhost:8000/api/
```

### Verificar login desde terminal
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@condomanager.com","password":"password123"}'
```

### Ver logs de Django
```bash
# En el terminal donde corre Django verás los requests
python manage.py runserver --verbosity=2
```

## 🎯 Estados Esperados

### ✅ Todo Funcionando
- Frontend carga sin errores
- Login exitoso muestra dashboard
- Datos se cargan desde Django
- CRUD operations funcionan

### ⚠️ Problemas Parciales
- Frontend carga pero API no responde → Verificar Django
- Login falla → Verificar credenciales y auth config
- Datos no cargan → Verificar endpoints y permisos

### ❌ No Funciona
- Frontend no carga → Verificar `npm run dev`
- Error 500 → Verificar logs de Django
- Error CORS → Verificar configuración CORS

---

**📱 Para soporte**: Revisa los archivos `README.md` y `DJANGO_BACKEND_CONFIG.md` para información detallada.