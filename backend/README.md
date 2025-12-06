# TimeTrack Backend - API REST para Control de Asistencias

Sistema backend robusto y escalable para la gestión de asistencia de empleados, construido con Express.js, Sequelize ORM y PostgreSQL. Implementa arquitectura MVC con medidas de seguridad de nivel empresarial.

## Características del Sistema

- Arquitectura modular y escalable siguiendo patrón MVC
- ORM Sequelize con soporte completo para relaciones complejas
- Sistema de autenticación JWT con refresh tokens
- Rate limiting y protección contra ataques comunes
- Validación exhaustiva de datos de entrada
- Soft deletes para mantener integridad histórica
- Sistema de auditoría integrado
- Pool de conexiones optimizado para alta concurrencia
- Manejo centralizado de errores
- CORS configurado para entornos multi-dominio
- Logging con Winston para producción
- Soporte para múltiples zonas horarias

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/                    # Configuraciones del sistema
│   │   ├── db.config.js          # Configuración PostgreSQL
│   │   └── database.config.js    # Configuración Sequelize
│   │
│   ├── database/                  # Conexión y gestión de BD
│   │   └── index.js              # Instancia Sequelize singleton
│   │
│   ├── models/                    # Modelos de datos (Sequelize)
│   │   ├── index.js              # Relaciones y asociaciones
│   │   ├── departamento.model.js # Departamentos de la empresa
│   │   ├── empleado.model.js     # Datos de empleados
│   │   ├── usuario.model.js      # Usuarios del sistema
│   │   ├── registro.model.js     # Registros de asistencia
│   │   ├── justificacion.model.js # Justificaciones
│   │   ├── auditoria.model.js    # Log de auditoría
│   │   ├── turno.model.js        # Turnos de trabajo
│   │   └── empleado_turno.model.js # Asignación de turnos
│   │
│   ├── controllers/               # Lógica de negocio
│   │   ├── empleado.controller.js
│   │   ├── usuario.controller.js
│   │   ├── registro.controller.js
│   │   └── departamento.controller.js
│   │
│   ├── routes/                    # Definición de rutas API
│   │   ├── index.js              # Router principal
│   │   ├── empleado.routes.js
│   │   ├── usuario.routes.js
│   │   ├── registro.routes.js
│   │   ├── departamento.routes.js
│   │   └── health.routes.js
│   │
│   ├── middlewares/               # Middlewares personalizados
│   │   ├── auth.middleware.js    # Verificación JWT
│   │   ├── security.middleware.js # Helmet, rate limiting, CORS
│   │   └── errorHandler.js       # Manejo global de errores
│   │
│   ├── utils/                     # Utilidades y helpers
│   │   └── logger.config.js      # Configuración Winston
│   │
│   ├── app.js                     # Configuración Express
│   └── server.js                  # Punto de entrada
│
├── scripts/                       # Scripts de utilidad
│   ├── create-tables.js          # Creación de tablas
│   ├── seed-users.js             # Datos iniciales
│   ├── generate-password-hash.js # Generador de hashes
│   └── fix-unique-index.js       # Reparación de índices
│
├── docs/                          # Documentación adicional
│   ├── API-ENDPOINTS.md
│   └── SECURITY-CHECKLIST.md
│
├── .env.example                   # Plantilla de variables de entorno
├── package.json
└── README.md
```

## Tecnologías Implementadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | >= 18.0.0 | Runtime de JavaScript |
| Express.js | ^5.x | Framework web minimalista |
| Sequelize | ^6.x | ORM para PostgreSQL |
| PostgreSQL | >= 12.0 | Base de datos relacional |
| JWT | ^9.x | Autenticación stateless |
| Bcrypt | ^6.x | Hashing de contraseñas |
| Helmet | ^8.x | Seguridad de headers HTTP |
| Express Rate Limit | ^7.x | Protección contra abuso |
| CORS | ^2.x | Control de acceso cross-origin |
| Morgan | ^1.x | Logger de peticiones HTTP |
| Winston | ^3.x | Sistema de logging robusto |
| Dotenv | ^17.x | Gestión de variables de entorno |
| Compression | ^1.x | Compresión gzip de respuestas |

## Instalación y Configuración

### Requisitos Previos

- Node.js versión 18 o superior
- PostgreSQL versión 12 o superior
- npm o yarn como gestor de paquetes

### Pasos de Instalación

1. **Clonar el repositorio y navegar al backend:**
```bash
cd backend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

Configurar las siguientes variables:
```env
# Configuración del Servidor
PORT=4000
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
DB_NAME=timetrack_db
DB_DIALECT=postgres

# Configuración del Pool de Conexiones
DB_POOL_MAX=5
DB_POOL_MIN=0
DB_POOL_ACQUIRE=30000
DB_POOL_IDLE=10000

# Autenticación JWT
JWT_SECRET=tu_secreto_muy_seguro_y_largo_aqui_min_32_caracteres
JWT_EXPIRES_IN=24h

# CORS - Frontend permitido
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

4. **Crear base de datos:**

Opción A - Usando el script incluido:
```bash
npm run db:create
```

Opción B - Manualmente:
```sql
CREATE DATABASE timetrack_db;
```

5. **Ejecutar migraciones y seeds:**
```bash
npm run db:seed
```

### Iniciar el Servidor

**Modo desarrollo (con auto-reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:4000`

### Verificar Health Check

```bash
curl http://localhost:4000/health

# O usando npm
npm run health
```

Respuesta esperada:
```json
{
  "status": "OK",
  "timestamp": "2024-12-05T10:30:00.000Z",
  "uptime": 150.25,
  "database": "connected"
}
```

## Modelos de Datos

### Departamento
Representa las áreas de la empresa.
```javascript
{
  id: INTEGER (PK),
  nombre: STRING(100),
  descripcion: TEXT,
  activo: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Empleado
Información del personal.
```javascript
{
  id: INTEGER (PK),
  nombre: STRING(100),
  apellido: STRING(100),
  dni: STRING(20) UNIQUE,
  email: STRING(100) UNIQUE,
  telefono: STRING(20),
  direccion: TEXT,
  fecha_nacimiento: DATE,
  fecha_contratacion: DATE,
  puesto: STRING(100),
  salario: DECIMAL(10,2),
  hora_entrada: TIME,
  hora_salida: TIME,
  departamento_id: INTEGER (FK),
  activo: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE,
  deletedAt: DATE
}
```

### Usuario
Credenciales de acceso al sistema.
```javascript
{
  id: INTEGER (PK),
  username: STRING(50) UNIQUE,
  contraseña: STRING(255), // Hashed con bcrypt
  email: STRING(100) UNIQUE,
  rol: ENUM('admin', 'supervisor', 'empleado'),
  empleado_id: INTEGER (FK),
  ultimo_acceso: DATE,
  activo: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Registro
Entradas y salidas de empleados.
```javascript
{
  id: INTEGER (PK),
  empleado_id: INTEGER (FK),
  fecha: DATE,
  hora_entrada: TIME,
  hora_salida: TIME,
  tipo_registro: ENUM('entrada', 'salida'),
  observaciones: TEXT,
  justificacion_id: INTEGER (FK),
  activo: BOOLEAN,
  createdAt: DATE,
  updatedAt: DATE,
  deletedAt: DATE
}
```

## API Endpoints

### Autenticación

**POST /api/usuarios/login**
```json
Request:
{
  "username": "admin",
  "contraseña": "admin123",
  "role": "admin"
}

Response:
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "rol": "admin",
      "empleado": { ... }
    }
  }
}
```

### Empleados

**GET /api/empleados**
- Autenticación: Requerida
- Roles: admin, supervisor
- Query params: `page`, `limit`, `departamento_id`, `activo`

**POST /api/empleados**
```json
Request:
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "12345678",
  "email": "juan.perez@empresa.com",
  "telefono": "555-1234",
  "fecha_contratacion": "2024-01-15",
  "puesto": "Desarrollador",
  "hora_entrada": "09:00",
  "hora_salida": "18:00",
  "departamento_id": 1
}
```

**PUT /api/empleados/:id**
- Actualiza datos del empleado

**DELETE /api/empleados/:id**
- Soft delete (marca como inactivo)

### Registros

**GET /api/registros**
- Lista registros activos con paginación

**POST /api/registros**
```json
Request:
{
  "empleado_id": 1,
  "tipo_registro": "entrada",
  "observaciones": "Llegada puntual"
}
```

**GET /api/registros/eliminados**
- Lista registros marcados como eliminados

**POST /api/registros/:id/restaurar**
- Restaura un registro eliminado

### Departamentos

**GET /api/departamentos**
**POST /api/departamentos**
**PUT /api/departamentos/:id**
**DELETE /api/departamentos/:id**

## Seguridad Implementada

### Autenticación y Autorización
- JWT con expiración configurable (default: 24h)
- Refresh token rotation para sesiones largas
- Middleware de verificación por ruta
- Control de acceso basado en roles (RBAC)

### Protección de Datos
- Bcrypt para hashing de contraseñas (salt rounds: 10)
- Sanitización de inputs con express-validator
- Protección contra SQL injection mediante Sequelize
- Escape de datos en respuestas

### Seguridad HTTP
- Helmet para headers seguros (CSP, HSTS, XSS protection)
- CORS con whitelist de dominios permitidos
- Rate limiting: 1000 req/15min general, 5 req/15min login
- Trust proxy habilitado para producción

### Auditoría
- Logging de todas las peticiones con Morgan
- Sistema de auditoría para cambios críticos
- Timestamps en todas las tablas
- Soft deletes para mantener historial

## Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor con nodemon

# Producción
npm start                # Inicia servidor en modo producción

# Base de datos
npm run db:create        # Crea tablas en PostgreSQL
npm run db:seed          # Inserta datos de prueba
npm run db:setup         # Ejecuta create + seed

# Utilidades
npm run health           # Verifica estado del servidor
```

## Manejo de Errores

El sistema implementa un manejador centralizado de errores que captura:

- Errores de validación de Sequelize
- Errores de autenticación (401)
- Errores de autorización (403)
- Errores de recursos no encontrados (404)
- Errores de servidor (500)

Formato de respuesta de error:
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": {
    "code": "ERROR_CODE",
    "details": { ... }
  }
}
```

## Despliegue en Producción

### Render

1. Crear nuevo Web Service en Render
2. Conectar repositorio de GitHub
3. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node
4. Agregar PostgreSQL database (Plan gratuito disponible)
5. Configurar variables de entorno en Settings
6. Deploy automático en cada push a main

### Variables de Entorno Requeridas

```env
NODE_ENV=production
PORT=4000
DB_HOST=<render-postgres-host>
DB_PORT=5432
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_NAME=<db-name>
JWT_SECRET=<secret-seguro>
FRONTEND_URL=https://tu-frontend.vercel.app
```

## Troubleshooting

**Error: No se puede conectar a PostgreSQL**
```bash
# Verificar que PostgreSQL está corriendo
pg_isready

# Verificar credenciales en .env
# Verificar que la base de datos existe
psql -U postgres -l
```

**Error: JWT malformed**
- Verificar que JWT_SECRET esté configurado
- Verificar formato del token en Authorization header

**Error 403 en login**
- Verificar rate limiting (5 intentos máximo)
- Verificar CORS (FRONTEND_URL debe coincidir)

## Contribución

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para guías de contribución.

## Licencia

MIT License - Ver LICENSE para más detalles
