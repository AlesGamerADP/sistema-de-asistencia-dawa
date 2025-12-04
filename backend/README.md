# 🚀 TimeTrack Backend - Sistema de Control de Asistencia

Sistema backend profesional para gestión de asistencia de empleados, construido con **Express.js**, **Sequelize ORM** y **PostgreSQL**.

## 📋 Características

- ✅ Arquitectura modular y escalable (MVC)
- ✅ ORM Sequelize con PostgreSQL
- ✅ Modelos con validaciones y relaciones complejas
- ✅ Variables de entorno para configuración segura
- ✅ Soporte para ES Modules (import/export)
- ✅ Pool de conexiones optimizado
- ✅ Manejo de errores centralizado
- ✅ CORS configurado para frontend
- ✅ Sistema de auditoría integrado
- ✅ Gestión de turnos y justificaciones

## 🗂️ Estructura del Proyecto

```
backend/
├── src/
│   ├── config/              # Configuraciones
│   │   └── db.config.js     # Configuración de PostgreSQL
│   ├── database/            # Conexión a BD
│   │   └── index.js         # Instancia de Sequelize
│   ├── models/              # Modelos Sequelize
│   │   ├── index.js         # Relaciones entre modelos
│   │   ├── departamento.model.js
│   │   ├── empleado.model.js
│   │   ├── registro.model.js
│   │   ├── usuario.model.js
│   │   ├── auditoria.model.js
│   │   ├── justificacion.model.js
│   │   ├── turno.model.js
│   │   └── empleado_turno.model.js
│   ├── controllers/         # Controladores (lógica de negocio)
│   ├── routes/              # Rutas de la API
│   ├── utils/               # Utilidades y helpers
│   └── server.js            # Punto de entrada del servidor
├── .env                     # Variables de entorno
├── package.json
└── README.md
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | >=18.0.0 | Runtime de JavaScript |
| Express.js | ^5.1.0 | Framework web |
| Sequelize | ^6.37.5 | ORM para PostgreSQL |
| PostgreSQL | >=12 | Base de datos relacional |
| pg | ^8.16.3 | Driver de PostgreSQL |
| dotenv | ^17.2.3 | Variables de entorno |
| cors | ^2.8.5 | Middleware CORS |
| nodemon | ^3.1.10 | Hot reload en desarrollo |

## 📊 Modelos de Base de Datos

### 1. **Departamentos**
Departamentos o áreas de la organización.

### 2. **Empleados**
Información de los empleados con estado (activo/inactivo).

### 3. **Registros**
Registros diarios de asistencia (entrada/salida).
- **Restricción única:** Un empleado = un registro por día.

### 4. **Usuarios**
Usuarios del sistema con roles (admin/supervisor/empleado).
- **Relación 1:1** con Empleados.

### 5. **Auditoría**
Trazabilidad de todas las operaciones del sistema.

### 6. **Justificaciones**
Justificaciones de faltas, retardos o salidas tempranas.

### 7. **Turnos**
Horarios laborales (matutino, vespertino, nocturno, etc.).

### 8. **EmpleadoTurno**
Asignación de turnos a empleados con fechas de validez.

## 🔗 Relaciones entre Modelos

```
Departamento 1:N Empleado
Empleado 1:N Registro
Empleado 1:1 Usuario
Empleado 1:N Justificación
Empleado 1:N EmpleadoTurno
Usuario 1:N Auditoría
Usuario 1:N Justificación (aprobador)
Turno 1:N EmpleadoTurno
```

## ⚙️ Instalación y Configuración

### 1. **Instalar Dependencias**

```bash
cd backend
npm install
```

Esto instalará:
- express
- sequelize
- pg y pg-hstore
- dotenv
- cors
- nodemon (dev)

### 2. **Configurar PostgreSQL**

Asegúrate de tener PostgreSQL instalado y corriendo.

**Crear la base de datos:**

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear la base de datos
CREATE DATABASE timetrack;

-- Salir
\q
```

### 3. **Configurar Variables de Entorno**

Edita el archivo `.env` con tus credenciales:

```env
# Puerto del servidor
PORT=4000

# Entorno (development/production)
NODE_ENV=development

# Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=timetrack
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_DIALECT=postgres

# URL del frontend (CORS)
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** Cambia `DB_PASSWORD` con tu contraseña real de PostgreSQL.

### 4. **Iniciar el Servidor**

**Modo desarrollo (con hot reload):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

### 5. **Verificar que funciona**

Si todo está correcto, verás en la consola:

```
🚀 Iniciando TimeTrack Backend...

📊 Verificando conexión con PostgreSQL...
✅ Conexión a PostgreSQL establecida correctamente.

🔄 Sincronizando modelos con la base de datos...
✅ Modelos sincronizados con la base de datos.

✅ Servidor iniciado correctamente

   🌐 URL: http://localhost:4000
   📂 Entorno: development
   🗄️  Base de datos: PostgreSQL (timetrack)
   📊 Modelos cargados: 8

💡 Presiona Ctrl+C para detener el servidor
```

## 🧪 Probar la Conexión

### 1. **Health Check Principal**

```bash
curl http://localhost:4000
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "✅ TimeTrack Backend funcionando correctamente",
  "timestamp": "2025-10-06T...",
  "environment": "development",
  "database": "PostgreSQL - timetrack"
}
```

### 2. **Verificar Estado de la BD**

```bash
curl http://localhost:4000/api/health
```

Respuesta esperada:

```json
{
  "success": true,
  "database": "Conectada",
  "models": [
    "Departamento",
    "Empleado",
    "Registro",
    "Usuario",
    "Auditoria",
    "Justificacion",
    "Turno",
    "EmpleadoTurno"
  ],
  "timestamp": "2025-10-06T..."
}
```

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia el servidor en modo producción |
| `npm run dev` | Inicia el servidor en modo desarrollo (nodemon) |
| `npm test` | Ejecuta los tests (pendiente de implementar) |

## � Documentación relacionada

- Guía general del proyecto (instalación, flujos y troubleshooting): ver README en la raíz del repo.
- Endpoints detallados de la API: `../docs/API-ENDPOINTS.md`.

## �🔧 Próximos Pasos

### 1. **Crear Controladores**

Ejemplo: `src/controllers/empleado.controller.js`

```javascript
import db from '../models/index.js';
const { Empleado, Departamento } = db;

export const getAllEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.findAll({
      include: [{ model: Departamento, as: 'departamento' }]
    });
    res.json({ success: true, data: empleados });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### 2. **Crear Rutas**

Ejemplo: `src/routes/empleado.routes.js`

```javascript
import express from 'express';
import { getAllEmpleados } from '../controllers/empleado.controller.js';

const router = express.Router();

router.get('/', getAllEmpleados);

export default router;
```

### 3. **Registrar Rutas en server.js**

```javascript
import empleadoRoutes from './routes/empleado.routes.js';
app.use('/api/empleados', empleadoRoutes);
```

## 🐛 Solución de Problemas

### Error: "Unable to connect to the database"

**Causas:**
- PostgreSQL no está corriendo
- Credenciales incorrectas en `.env`
- Base de datos `timetrack` no existe

**Solución:**

```bash
# Verificar si PostgreSQL está corriendo
# Windows:
sc query postgresql-x64-16

# Crear la base de datos si no existe
psql -U postgres
CREATE DATABASE timetrack;
```

### Error: "Port 4000 already in use"

**Solución:** Cambia el puerto en `.env`:

```env
PORT=5000
```

### Error: "Cannot find module"

**Solución:** Reinstala las dependencias:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 🔐 Seguridad (Recomendaciones)

- ✅ Nunca subas el archivo `.env` al repositorio (está en `.gitignore`)
- ✅ Usa contraseñas seguras para PostgreSQL
- ✅ Implementa JWT para autenticación
- ✅ Valida y sanitiza todas las entradas del usuario
- ✅ Usa HTTPS en producción
- ✅ Implementa rate limiting

## 📚 Recursos Adicionales

- [Documentación de Express.js](https://expressjs.com/)
- [Documentación de Sequelize](https://sequelize.org/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Buenas prácticas de Node.js](https://github.com/goldbergyoni/nodebestpractices)

## 👥 Equipo

**TimeTrack Team** - Octubre 2025

## 📄 Licencia

MIT License - Puedes usar este código libremente.

---

**¿Necesitas ayuda?** Revisa la sección de Solución de Problemas o consulta la documentación oficial de cada tecnología.

¡Happy Coding! 🚀
