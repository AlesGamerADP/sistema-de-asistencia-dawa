# 🚀 Guía de Deployment en Vercel - Frontend TimeTrack

## ✅ Checklist Pre-Deployment

Antes de desplegar, verifica que todo esté listo:

- [x] ✅ `package.json` tiene scripts `build` y `start`
- [x] ✅ Variable de entorno usa `NEXT_PUBLIC_API_URL` (no `REACT_APP_API_URL`)
- [x] ✅ `vercel.json` configurado con rewrites y headers de seguridad
- [x] ✅ `.env.local` y `.env.example` creados
- [x] ✅ Backend CORS permite dominios `*.vercel.app`
- [x] ✅ `.gitignore` incluye `.env.local`

---

## 🧪 1. Prueba Local Antes de Desplegar

### Instalar dependencias:
```bash
cd frontend
npm install
```

### Probar en desarrollo:
```bash
npm start
# Abre http://localhost:3000
```

### Simular build de producción:
```bash
npm run build
npm start
```

**✋ Si hay errores en el build, arregla antes de continuar.**

---

## 🌐 2. Despliegue en Vercel (Interfaz Web)

### Paso 1: Acceder a Vercel
1. Ve a https://vercel.com/new
2. Inicia sesión con GitHub

### Paso 2: Importar Proyecto
1. Busca el repositorio `CONTROL-DE-ASISTENCIAS---TIMETRACK`
2. Click en **Import**

### Paso 3: Configurar Proyecto
- **Framework Preset**: Selecciona **Create React App**
- **Root Directory**: Escribe `frontend`
- **Build Command**: `npm run build` (auto-detectado)
- **Output Directory**: `build` (auto-detectado)
- **Install Command**: `npm install` (auto-detectado)

### Paso 4: Variables de Entorno
Click en **Environment Variables** y agrega:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://control-de-asistencias-timetrack.onrender.com/api` | Production, Preview, Development |

**⚠️ IMPORTANTE**: El nombre debe ser exactamente `NEXT_PUBLIC_API_URL`

### Paso 5: Deploy
1. Click en **Deploy**
2. Espera 2-3 minutos
3. Vercel te dará una URL: `https://tu-proyecto.vercel.app`

---

## 📋 3. Verificar Deployment

### Checklist Post-Deploy:
1. ✅ Abre la URL de Vercel
2. ✅ Prueba login con credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `Admin123!`
3. ✅ Verifica la consola del navegador (F12) para errores
4. ✅ Revisa la pestaña **Network** para ver las llamadas API
5. ✅ Prueba registro de asistencia
6. ✅ Prueba rutas protegidas (dashboard admin/colaborador)

### Logs de Deployment:
- Ve a **Vercel Dashboard** → Tu proyecto → **Deployments** → Click en el último deploy
- Revisa **Build Logs** si hay errores

---

## 🔧 4. Configuración Avanzada (Opcional)

### Dominios Personalizados
1. Ve a **Settings** → **Domains**
2. Agrega tu dominio (ej. `timetrack.com`)
3. Configura DNS según las instrucciones de Vercel

### Variables de Entorno Adicionales
Si necesitas más variables (analytics, features, etc.):

```env
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
NEXT_PUBLIC_APP_NAME=TimeTrack
NEXT_PUBLIC_ENABLE_FEATURE_X=true
```

Agrégalas en **Settings** → **Environment Variables**

---

## 🐛 5. Troubleshooting

### ❌ Error: "Failed to compile"
**Solución**: 
1. Revisa los logs de build en Vercel
2. Prueba `npm run build` localmente
3. Arregla errores de sintaxis o imports

### ❌ Error: "API calls failing (CORS)"
**Solución**:
1. Verifica que `NEXT_PUBLIC_API_URL` esté configurado
2. Confirma que backend CORS permite `*.vercel.app`
3. Revisa logs del backend en Render

### ❌ Error: "Environment variable undefined"
**Solución**:
1. Asegúrate que la variable tenga el prefijo `NEXT_PUBLIC_`
2. Re-deploya después de agregar variables en Vercel
3. Limpia cache: **Deployments** → **⋯** → **Redeploy**

### ❌ Error: "404 on page refresh"
**Solución**: Ya está solucionado con `vercel.json` (rewrites automáticos)

---

## 🔄 6. Re-deployment y Updates

### Deploy Automático:
Cada push a la rama `main` despliega automáticamente.

### Deploy Manual:
1. Ve a **Deployments**
2. Click **⋯** en el último deploy
3. Click **Redeploy**

### Preview Deployments:
Cada pull request crea un preview deployment automático.

---

## 📊 7. Monitoreo

### Analytics:
- Ve a **Analytics** en Vercel Dashboard
- Revisa visitas, performance, errores

### Logs:
- **Deployments** → Click en deploy → **Function Logs**
- Filtra por errores o búsquedas

---

## 🎯 8. Checklist Final

Antes de dar por terminado:

- [ ] ✅ Deployment exitoso (sin errores)
- [ ] ✅ Login funciona correctamente
- [ ] ✅ API calls llegan al backend en Render
- [ ] ✅ CORS sin errores en consola
- [ ] ✅ Autenticación con JWT funciona
- [ ] ✅ Rutas protegidas redirigen correctamente
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Dominio personalizado (si aplica)

---

## 📦 9. Archivos Clave Creados

```
frontend/
├── vercel.json          # Rewrites y headers de seguridad
├── .env.local           # Variables locales (no subir a Git)
├── .env.example         # Template de variables
└── src/
    └── api/
        └── client.js    # Actualizado con NEXT_PUBLIC_API_URL
```

---

## 🔗 10. URLs Importantes

- **Frontend en Vercel**: `https://tu-proyecto.vercel.app`
- **Backend en Render**: `https://control-de-asistencias-timetrack.onrender.com`
- **Health Check Backend**: `https://control-de-asistencias-timetrack.onrender.com/health`

---

## 💡 11. Próximos Pasos

1. **Prueba completa del flujo**: Login → Dashboard → Registro de asistencia
2. **Configura dominio personalizado** (opcional)
3. **Agrega Google Analytics** (opcional)
4. **Configura monitoreo de errores** con Sentry (opcional)
5. **Optimiza imágenes** y assets

---

## 🆘 12. Soporte

Si encuentras problemas:

1. **Logs de Vercel**: Deployments → View Logs
2. **Logs de Render**: Dashboard → Logs
3. **Consola del navegador**: F12 → Console/Network
4. **GitHub Issues**: Reporta bugs en el repositorio

---

## ✅ ¡Listo!

Tu frontend está preparado para producción. Ahora puedes:

```bash
git add .
git commit -m "feat: configurar frontend para deployment en Vercel"
git push origin main
```

Vercel desplegará automáticamente. 🚀

---

**Última actualización**: Noviembre 2025
**Backend**: Render (PostgreSQL + Node.js)
**Frontend**: Vercel (React + Next.js)
