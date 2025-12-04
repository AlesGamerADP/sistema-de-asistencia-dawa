# 🚀 Guía Completa de Deployment en Render

## 📋 Tabla de Contenidos

1. [Prerequisitos](#prerequisitos)
2. [Configuración de Base de Datos en Neon](#configuración-de-base-de-datos-en-neon)
3. [Configuración en Render](#configuración-en-render)
4. [Variables de Entorno](#variables-de-entorno)
5. [Deployment](#deployment)
6. [Verificación y Testing](#verificación-y-testing)
7. [Troubleshooting](#troubleshooting)
8. [Mantenimiento](#mantenimiento)

---

## ✅ Prerequisitos

Antes de empezar, asegúrate de tener:

- ✅ Cuenta en [Render](https://render.com) (plan gratuito disponible)
- ✅ Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless gratis)
- ✅ Cuenta en GitHub con tu repositorio
- ✅ Node.js 18+ instalado localmente (para testing)

---

## 🗄️ Configuración de Base de Datos en Neon

### Paso 1: Crear Proyecto en Neon

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Haz clic en **"Create a project"**
3. Configura tu proyecto:
   - **Name**: `timetrack-db` (o el nombre que prefieras)
   - **Region**: Selecciona la más cercana a tus usuarios
   - **PostgreSQL Version**: 15 o superior

### Paso 2: Obtener Connection String

1. En tu proyecto de Neon, ve a **Dashboard**
2. Encontrarás tu **Connection String** que se ve así:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
3. **¡Copia esta URL completa!** La necesitarás para Render

### Paso 3: Crear las Tablas

Opción A - Usando el SQL Editor de Neon:
1. Ve a **SQL Editor** en Neon
2. Copia y pega el contenido de `backend/scripts/setup_database.sql`
3. Ejecuta el script

Opción B - Usando pgAdmin o DBeaver:
1. Conecta usando la connection string de Neon
2. Ejecuta el script `setup_database.sql`

### Paso 4: Verificar Conexión

Ejecuta este comando localmente para verificar:

```bash
# En Windows PowerShell
$env:DATABASE_URL="tu_connection_string_de_neon"
npm run dev
```

Si ves `✅ Conexión a PostgreSQL establecida correctamente`, ¡todo está bien!

---

## 🌐 Configuración en Render

### Paso 1: Crear Web Service

1. Ve a [render.com/dashboard](https://render.com/dashboard)
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Selecciona tu repositorio `control-asistencia`

### Paso 2: Configuración del Servicio

Rellena los siguientes campos:

| Campo | Valor |
|-------|-------|
| **Name** | `timetrack-backend` |
| **Region** | Same as Neon (o la más cercana) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free (o el que prefieras) |

### Paso 3: Configuración Avanzada

Expande **"Advanced"** y configura:

**Auto-Deploy**: ✅ Yes (para deployments automáticos)

**Health Check Path**: `/health`

---

## 🔐 Variables de Entorno

En la sección **"Environment Variables"** de Render, agrega:

### Variables Obligatorias

```env
NODE_ENV=production
DATABASE_URL=postgresql://tu_usuario:password@ep-xxx.neon.tech/timetrack?sslmode=require
JWT_SECRET=GENERA_UNO_SEGURO_CON_EL_COMANDO_ABAJO
FRONTEND_URL=https://tu-frontend-url.vercel.app
```

### Generar JWT_SECRET Seguro

Ejecuta en tu terminal local:

```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y úsalo como `JWT_SECRET`

### Variables Opcionales

```env
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10
TZ=-06:00
LOG_LEVEL=info
```

---

## 🚀 Deployment

### Opción 1: Deploy Manual

1. En Render Dashboard, haz clic en **"Deploy latest commit"**
2. Espera a que termine (puede tardar 2-5 minutos)
3. Verás logs en tiempo real del deployment

### Opción 2: Deploy Automático

Render hace deploy automáticamente cuando:
- Haces push a la rama `main`
- Haces merge de un Pull Request

---

## ✅ Verificación y Testing

### 1. Verificar Health Check

Una vez que el deployment termine, abre:

```
https://tu-app.onrender.com/health
```

Deberías ver:

```json
{
  "success": true,
  "timestamp": "2025-11-15T...",
  "uptime": 123.45,
  "environment": "production",
  "server": "online",
  "database": "connected",
  "dbResponseTime": "50ms"
}
```

### 2. Verificar Endpoints de API

```bash
# Health básico
GET https://tu-app.onrender.com/health/ping

# Info de la API
GET https://tu-app.onrender.com/api

# Empleados (requiere autenticación)
GET https://tu-app.onrender.com/api/empleados
```

### 3. Monitorear Logs

En Render Dashboard:
1. Ve a tu servicio
2. Haz clic en **"Logs"**
3. Deberías ver:
   ```
   🚀 Iniciando TimeTrack Backend...
   ✅ Conectado a base de datos: Neon PostgreSQL
   🌐 Servidor iniciado en puerto 10000
   ```

---

## 🔧 Troubleshooting

### Error: "No se pudo conectar a la base de datos"

**Causa**: DATABASE_URL incorrecta o Neon inaccesible

**Solución**:
1. Verifica que DATABASE_URL termine en `?sslmode=require`
2. Verifica que copiaste la URL completa de Neon
3. Verifica que Neon esté activo (dashboard de Neon)

### Error: "Port already in use"

**Causa**: Render asigna automáticamente el puerto

**Solución**: 
- ✅ Tu código ya está configurado con `process.env.PORT || 4000`
- No necesitas hacer nada

### Error: "JWT_SECRET is not defined"

**Causa**: Falta variable de entorno

**Solución**:
1. Ve a Render Dashboard → tu servicio → Environment
2. Agrega `JWT_SECRET` con un valor generado
3. Haz redeploy

### Error 503 en /health

**Causa**: Base de datos no responde

**Solución**:
1. Verifica que Neon esté activo
2. Revisa los logs en Render
3. Verifica que DATABASE_URL sea correcta

### Deployment tarda mucho

**Causa**: Normal en plan gratuito de Render

**Solución**:
- Primera vez: 5-10 minutos
- Deployments subsecuentes: 2-5 minutos
- Considera upgrade a plan paid para más velocidad

---

## 🔄 Mantenimiento

### Actualizar el Backend

1. **Push a GitHub**:
   ```bash
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin main
   ```

2. **Render hace deploy automáticamente**

3. **Verifica logs** en Render Dashboard

### Monitorear Performance

Render Dashboard muestra:
- ✅ CPU Usage
- ✅ Memory Usage
- ✅ Request Count
- ✅ Response Times

### Backups de Base de Datos

Neon hace backups automáticos, pero puedes hacer uno manual:

```bash
# Usando pg_dump localmente
pg_dump $DATABASE_URL > backup.sql
```

### Escalar la Aplicación

Si necesitas más recursos:
1. Ve a Render Dashboard → tu servicio → Settings
2. Cambia el **Instance Type** a un plan paid
3. Ajusta el **Pool de Conexiones** en `database.config.js`:
   ```javascript
   pool: {
     max: 20, // Aumentar según plan
     min: 5
   }
   ```

---

## 📊 Checklist Final de Producción

Antes de lanzar a usuarios reales:

- [ ] ✅ DATABASE_URL configurada y verificada
- [ ] ✅ JWT_SECRET único y seguro (no el de ejemplo)
- [ ] ✅ FRONTEND_URL apunta a tu dominio real
- [ ] ✅ Health check responde correctamente
- [ ] ✅ API endpoints funcionan
- [ ] ✅ CORS configurado correctamente
- [ ] ✅ Rate limiting activo
- [ ] ✅ Logs están funcionando
- [ ] ✅ Tablas de BD creadas
- [ ] ✅ .env NO está en el repositorio
- [ ] ✅ NODE_ENV=production en Render
- [ ] ✅ SSL activo (automático en Render)
- [ ] ✅ Auto-deploy configurado
- [ ] ✅ Dominio personalizado (opcional)

---

## 🎯 URLs Importantes

- **Render Dashboard**: https://dashboard.render.com
- **Neon Dashboard**: https://console.neon.tech
- **Tu Backend**: `https://tu-app.onrender.com`
- **Health Check**: `https://tu-app.onrender.com/health`
- **API Docs**: `https://tu-app.onrender.com/api`

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa logs** en Render Dashboard
2. **Verifica health check**: `/health`
3. **Consulta la documentación**:
   - [Render Docs](https://render.com/docs)
   - [Neon Docs](https://neon.tech/docs)
4. **Revisa errores comunes** en la sección Troubleshooting arriba

---

## 🎉 ¡Listo!

Tu backend está ahora en producción con:

- ✅ PostgreSQL en Neon (serverless, escalable)
- ✅ SSL automático
- ✅ Auto-deploy desde GitHub
- ✅ Logs profesionales
- ✅ Seguridad de producción (Helmet, Rate Limiting, CORS)
- ✅ Health checks configurados
- ✅ Manejo de errores robusto

**¡Tu API está lista para recibir tráfico real! 🚀**
