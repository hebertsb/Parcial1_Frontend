# 🌐 Configuración de Variables de Entorno

## 📋 **Archivos de Configuración**

### 🏠 **Desarrollo Local**
- **Archivo:** `.env.local` (ignorado por Git)
- **API URL:** `http://127.0.0.1:8000/api`
- **Uso:** `npm run dev`

### 🚀 **Producción (Netlify)**
- **Archivo:** `.env.production` (incluido en Git)
- **API URL:** `http://192.168.56.1:8000/api`
- **Uso:** Deploy automático en Netlify

## 🔧 **Variables Configuradas**

| Variable | Desarrollo | Producción |
|----------|------------|------------|
| `REACT_APP_API_URL` | `http://127.0.0.1:8000/api` | `http://192.168.56.1:8000/api` |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000` | `http://192.168.56.1:8000` |
| `NEXT_PUBLIC_WS_URL` | `ws://127.0.0.1:8000/ws` | `ws://192.168.56.1:8000/ws` |

## 🛠️ **Configuración Proxy**

Para desarrollo local se desactiva el proxy corporativo:
```env
NO_PROXY=localhost,127.0.0.1,0.0.0.0
```

## 📝 **Notas de Configuración**

- ✅ **Desarrollo:** Usa `127.0.0.1` para evitar proxy corporativo
- ✅ **Producción:** Usa `192.168.56.1` según especificación del backend
- ✅ **Netlify:** Detecta automáticamente `.env.production` en deploy
- ✅ **Seguridad:** Variables locales no se suben al repositorio

## 🚀 **Deploy en Netlify**

1. Netlify detecta automáticamente `.env.production`
2. Las variables se inyectan en tiempo de build
3. La app se conecta automáticamente al backend en `192.168.56.1:8000`

## 🔍 **Verificación**

Para verificar que las variables están correctas:
```bash
# Desarrollo
echo $REACT_APP_API_URL  # debería mostrar http://127.0.0.1:8000/api

# En la app, verificar en consola del navegador
console.log(process.env.REACT_APP_API_URL)
```