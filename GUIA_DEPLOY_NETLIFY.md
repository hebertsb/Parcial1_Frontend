# 🚀 Guía de Deploy en Netlify

## 📋 **Configuración en Netlify Dashboard**

### ⚙️ **Build Settings**

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Build command** | `npm run build` | Comando para construir el proyecto |
| **Publish directory** | `out` | Directorio donde están los archivos compilados |
| **Base directory** | *(vacío)* | Directorio raíz del proyecto |
| **Package directory** | *(vacío)* | No necesario para este proyecto |
| **Functions directory** | `netlify/functions` | Para funciones serverless (opcional) |

### 🌐 **Variables de Entorno en Netlify**

En **Site settings > Environment variables**, añadir:

```env
REACT_APP_API_URL=http://192.168.56.1:8000/api
NEXT_PUBLIC_API_URL=http://192.168.56.1:8000
NEXT_PUBLIC_WS_URL=ws://192.168.56.1:8000/ws
NEXT_PUBLIC_APP_NAME=CondoManager
NEXT_PUBLIC_ENVIRONMENT=production
```

### 🔧 **Configuración de Runtime**

- **Node.js Version:** 18.x (configurado en netlify.toml)
- **Build timeout:** 15 minutos (debería ser suficiente)

## 📁 **Archivos de Configuración Incluidos**

✅ **netlify.toml** - Configuración completa de Netlify  
✅ **.env.production** - Variables de entorno para producción  
✅ **next.config.mjs** - Configuración de Next.js con exportación estática  

## 🚀 **Proceso de Deploy**

1. **Conectar Repositorio:**
   - Conecta tu repositorio GitHub: `hebertsb/Parcial1_Frontend`

2. **Configurar Build:**
   - Build command: `npm run build`
   - Publish directory: `out`

3. **Variables de Entorno:**
   - Netlify detectará automáticamente `.env.production`
   - Opcionalmente añadir variables manualmente en dashboard

4. **Deploy:**
   - Click "Deploy site"
   - Netlify construirá y desplegará automáticamente

## ✅ **Verificación Post-Deploy**

1. **Conectividad Backend:**
   - Verificar que se conecta a `192.168.56.1:8000/api`
   - Probar endpoints de autenticación

2. **Funcionalidades:**
   - Login de usuarios
   - Paneles administrativos
   - Sistema de reconocimiento facial

3. **Performance:**
   - Carga rápida de páginas
   - Assets optimizados

## 🔍 **Troubleshooting**

### **Error: Build Failed**
- Verificar que Node.js version sea 18.x
- Revisar logs de build en Netlify dashboard

### **Error: 404 en rutas**
- Verificar que `netlify.toml` incluye redirects
- Confirmar que `output: 'export'` está en next.config.mjs

### **Error: API no conecta**
- Verificar variables de entorno en Netlify dashboard
- Confirmar que backend está corriendo en `192.168.56.1:8000`

## 📊 **Optimizaciones Incluidas**

- ✅ **Cache Headers** para assets estáticos
- ✅ **Security Headers** (XSS, CSRF protection)
- ✅ **SPA Redirects** para routing de Next.js
- ✅ **Build Optimizations** con SWC minify
- ✅ **Image Optimization** deshabilitada para export

¡Tu proyecto está listo para deploy en Netlify! 🎉