# 📚 TimeTrack — Documentación Completa del Sistema

> Sistema Integral de Control de Asistencias para Empleados  
> **Versión**: 1.0.0  
> **Última actualización**: Noviembre 2025

---

## 📖 Tabla de Contenidos

1. [Introducción General](#1-introducción-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Tecnologías Utilizadas](#3-tecnologías-utilizadas)
4. [Requisitos del Sistema](#4-requisitos-del-sistema)
5. [Instalación y Configuración](#5-instalación-y-configuración)
6. [Estructura del Proyecto](#6-estructura-del-proyecto)
7. [Base de Datos](#7-base-de-datos)
8. [API REST - Endpoints](#8-api-rest---endpoints)
9. [Guía de Uso](#9-guía-de-uso)
10. [Seguridad](#10-seguridad)
11. [Deployment](#11-deployment)
12. [Mantenimiento](#12-mantenimiento)
13. [Troubleshooting](#13-troubleshooting)
14. [Recursos Adicionales](#14-recursos-adicionales)

---

## 1. Introducción General

### ✨ ¿Qué es TimeTrack?

**TimeTrack** es una aplicación web profesional para registrar y gestionar la asistencia de empleados en organizaciones. Permite a los colaboradores fichar entrada/salida con justificaciones automáticas, y a los administradores gestionar empleados, departamentos y registros de forma centralizada.

### 🎯 Características Principales

- ✅ **Fichaje de entrada/salida** por colaborador con validación automática de horarios
- ✅ **Justificaciones inteligentes** de llegada tarde, salida anticipada e incidencias
- ✅ **Historial personal** de asistencias (últimos 30 días)
- ✅ **Panel administrativo** completo para gestión de empleados, usuarios, departamentos y registros
- ✅ **Sistema de roles** (admin, supervisor, empleado) con autenticación JWT
- ✅ **Soft delete** (papelera) con capacidad de restauración
- ✅ **API REST** profesional con Express + Sequelize + PostgreSQL
- ✅ **Frontend moderno** con React 19, TailwindCSS y Zustand
- ✅ **Seguridad empresarial** con Helmet, Rate Limiting y CORS

### 👥 Roles del Sistema

| Rol | Permisos | Acceso |
|-----|----------|--------|
| **Empleado** | Marcar entrada/salida, ver historial personal | Dashboard Colaborador |
| **Supervisor** | Consultar registros, gestionar empleados | Dashboard Admin (lectura) |
| **Admin** | Control total, restaurar/eliminar registros | Dashboard Admin (completo) |

---

## 2. Arquitectura del Sistema

### 🧱 Estructura General

TimeTrack es un **monorepo** dividido en dos componentes principales:

```
CONTROL-DE-ASISTENCIAS---TIMETRACK/
├─ backend/     # API REST (Express + Sequelize + PostgreSQL)
├─ frontend/    # Aplicación React (CRA) + Tailwind + React Router
└─ docs/        # Documentación del proyecto
```

### 📡 Comunicación Frontend-Backend

- **Protocolo**: HTTP/HTTPS
- **Formato**: JSON
- **Autenticación**: JWT en header `Authorization: Bearer <token>`
- **CORS**: Configurado para permitir frontend específico

```
┌─────────────┐         HTTP/JSON         ┌─────────────┐
│             │ ───────────────────────>  │             │
│  Frontend   │   Authorization: JWT      │   Backend   │
│  (React)    │ <───────────────────────  │  (Express)  │
│             │      Responses (JSON)      │             │
└─────────────┘                            └─────────────┘
      │                                           │
      │                                           │
      v                                           v
  Zustand Store                            PostgreSQL
  (Estado Global)                          (Base de Datos)
```

---

## 3. Tecnologías Utilizadas

### 🖥️ Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | ≥18.0.0 | Runtime de JavaScript |
| Express.js | ^5.1.0 | Framework web |
| Sequelize | ^6.37.5 | ORM para PostgreSQL |
| PostgreSQL | ≥12 | Base de datos relacional |
| JWT | ^9.0.2 | Autenticación con tokens |
| Bcrypt | ^5.1.1 | Hash de contraseñas |
| Helmet | ^8.0.0 | Seguridad de headers HTTP |
| CORS | ^2.8.5 | Control de acceso entre dominios |
| Winston | ^3.17.0 | Logging profesional |
| Express Rate Limit | ^7.5.0 | Rate limiting |
| Dotenv | ^17.2.3 | Variables de entorno |

### 🎨 Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^19.0.0 | Librería UI |
| React Router DOM | ^7.1.3 | Enrutamiento SPA |
| TailwindCSS | ^3.4.17 | Framework CSS |
| Axios | ^1.7.9 | Cliente HTTP |
| Zustand | ^5.0.3 | Gestión de estado global |
| Lucide React | ^0.469.0 | Iconos modernos |
| Framer Motion | ^11.15.0 | Animaciones |
| Sonner | ^1.7.3 | Notificaciones toast |

---

## 4. Requisitos del Sistema

### 💻 Desarrollo Local

- **Sistema Operativo**: Windows 10/11, macOS, Linux
- **Node.js**: Versión 18 o superior
- **PostgreSQL**: Versión 12 o superior
- **RAM**: Mínimo 4GB (recomendado 8GB)
- **Disco**: 500MB libres
- **Editor**: VS Code (recomendado) con extensiones ESLint y Prettier

### 🌐 Producción

- **Backend**: Render (plan gratuito) o similar
- **Base de Datos**: Neon PostgreSQL (serverless gratuito)
- **Frontend**: Vercel (plan gratuito) o Netlify
- **SSL/HTTPS**: Automático en Render y Vercel

---

## 5. Instalación y Configuración

### 📥 Instalación Inicial

#### 1. Clonar el Repositorio

```powershell
git clone https://github.com/D1egoOQuintana/CONTROL-DE-ASISTENCIAS---TIMETRACK.git
cd CONTROL-DE-ASISTENCIAS---TIMETRACK
```

#### 2. Instalar Dependencias del Backend

```powershell
cd backend
npm install
```

#### 3. Instalar Dependencias del Frontend

```powershell
cd ../frontend
npm install
```

### ⚙️ Configuración de Variables de Entorno

#### Backend (`backend/.env`)

Crea el archivo `backend/.env` con el siguiente contenido:

```env
# Servidor
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=timetrack
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA_AQUI
DB_DIALECT=postgres

# JWT
JWT_SECRET=cambia_este_secreto_en_produccion_usa_64_caracteres_aleatorios
JWT_EXPIRES_IN=24h

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Zona Horaria
TZ=-06:00

# Logging
LOG_LEVEL=info
```

**⚠️ IMPORTANTE**: 
- Cambia `DB_PASSWORD` con tu contraseña de PostgreSQL
- Genera un `JWT_SECRET` seguro (ver sección de seguridad)

#### Frontend (`frontend/.env` - Opcional)

```env
REACT_APP_API_URL=http://localhost:4000/api
```

Si no defines esta variable, el frontend usará `http://localhost:4000/api` por defecto.

### 🗄️ Configuración de PostgreSQL

#### 1. Crear la Base de Datos

```powershell
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE timetrack;

# Salir
\q
```

#### 2. Verificar Servicio PostgreSQL

**Windows**:
```powershell
sc query postgresql-x64-16
```

Si no está corriendo:
```powershell
net start postgresql-x64-16
```

### 🚀 Iniciar la Aplicación

#### 1. Iniciar Backend (Terminal 1)

```powershell
cd backend
npm run dev
```

**Salida esperada**:
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
```

#### 2. Iniciar Frontend (Terminal 2)

```powershell
cd frontend
npm start
```

El navegador se abrirá automáticamente en `http://localhost:3000`.

### ✅ Verificación de Instalación

#### Backend Health Check

```powershell
curl http://localhost:4000
```

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "✅ TimeTrack Backend API",
  "version": "1.0.0",
  "status": "running"
}
```

#### API Info

```powershell
curl http://localhost:4000/api
```

#### Frontend

Abre `http://localhost:3000` y deberías ver la pantalla de login.

---

## 6. Estructura del Proyecto

### 📂 Backend (`backend/`)

```
backend/
├── src/
│   ├── app.js                    # Configuración de Express (middlewares, CORS)
│   ├── server.js                 # Boot del servidor y health checks
│   ├── config/
│   │   └── db.config.js          # Configuración de PostgreSQL (dotenv)
│   ├── database/
│   │   └── index.js              # Instancia de Sequelize (test/sync)
│   ├── middlewares/
│   │   ├── auth.middleware.js    # Autenticación JWT
│   │   ├── errorHandler.js       # Manejo global de errores
│   │   └── security.middleware.js # Helmet, rate limiting, SQL injection
│   ├── models/                   # Modelos Sequelize
│   │   ├── index.js              # Relaciones entre modelos
│   │   ├── departamento.model.js
│   │   ├── empleado.model.js
│   │   ├── registro.model.js
│   │   ├── usuario.model.js
│   │   ├── auditoria.model.js
│   │   ├── justificacion.model.js
│   │   ├── turno.model.js
│   │   └── empleado_turno.model.js
│   ├── controllers/              # Lógica de negocio
│   │   ├── departamento.controller.js
│   │   ├── empleado.controller.js
│   │   ├── registro.controller.js
│   │   └── usuario.controller.js
│   ├── routes/                   # Rutas API
│   │   ├── index.js              # Montaje de rutas
│   │   ├── departamento.routes.js
│   │   ├── empleado.routes.js
│   │   ├── registro.routes.js
│   │   ├── usuario.routes.js
│   │   └── health.routes.js
│   └── utils/
│       ├── logger.config.js      # Configuración de Winston
│       └── logger.js             # Logger profesional
├── scripts/
│   ├── create-tables.js          # Crear tablas manualmente
│   ├── generate-password-hash.js # Generar hashes bcrypt
│   └── seed-users.js             # Poblar usuarios de ejemplo
├── docs/
│   └── REGISTROS-ACTIVOS-ELIMINADOS.md
├── .env                          # Variables de entorno (NO SUBIR A GIT)
├── .env.example                  # Template de variables
├── .gitignore
├── package.json
├── README.md
├── DEPLOYMENT-GUIDE.md
└── SECURITY-CHECKLIST.md
```

### 📂 Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── index.js                  # Entry point
│   ├── App.js                    # Router principal
│   ├── api/                      # Clientes Axios
│   │   ├── client.js             # Axios instance con interceptores
│   │   ├── auth.js               # Endpoints de autenticación
│   │   ├── employee.js           # Endpoints de empleado
│   │   ├── admin.js              # Endpoints de admin
│   │   └── users.js              # Endpoints de usuarios
│   ├── pages/                    # Páginas principales
│   │   ├── LoginPage.js
│   │   ├── AdminDashboard.js
│   │   └── CollaboratorDashboard.js
│   ├── components/               # Componentes reutilizables
│   │   ├── Loader.js
│   │   ├── LoginForm.js
│   │   ├── RoleSwitch.js
│   │   ├── admin/
│   │   │   ├── ActiveRecordsView.js
│   │   │   ├── DeletedRecordsView.js
│   │   │   ├── EmployeesManagement.js
│   │   │   ├── EmployeesTable.js
│   │   │   ├── HoursSummary.js
│   │   │   ├── StatsHeader.js
│   │   │   └── Tabs.js
│   │   └── employee/
│   │       ├── ClockOutDialog.js
│   │       ├── EarlyExitDialog.js
│   │       ├── EmployeeDashboard.js
│   │       └── HistoryTable.js
│   ├── store/
│   │   └── useAuthStore.js       # Estado global (Zustand)
│   ├── styles/                   # CSS personalizados
│   │   ├── admin-tabs.css
│   │   ├── background-transition.css
│   │   ├── collaborator-animations.css
│   │   ├── dark-mode-fixes.css
│   │   ├── login.css
│   │   └── role-switch.css
│   └── app/
│       ├── globals.css           # Estilos globales
│       ├── layout.js
│       └── page.js
├── public/
│   └── index.html
├── build/                        # Build de producción
├── .env                          # Variables de entorno (NO SUBIR A GIT)
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── eslint.config.mjs
├── next.config.mjs
├── vercel.json                   # Configuración de Vercel
└── VERCEL-DEPLOYMENT.md
```

---

## 7. Base de Datos

### 🗄️ Modelos y Relaciones

#### Modelo de Datos

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Departamento │ 1───N │   Empleado   │ 1───N │   Registro   │
└──────────────┘       └──────────────┘       └──────────────┘
                              │                       │
                              │ 1:1                   │
                              │                       │
                       ┌──────────────┐               │
                       │   Usuario    │               │
                       └──────────────┘               │
                              │                       │
                              │ 1:N                   │
                              │                       │
                       ┌──────────────┐               │
                       │  Auditoría   │               │
                       └──────────────┘               │
                                                       │
                              ┌────────────────────────┘
                              │
                              v
                       ┌──────────────┐
                       │Justificación │
                       └──────────────┘
```

#### 1. **Departamentos**

Áreas organizacionales de la empresa.

```javascript
{
  id: INTEGER (PK, auto-increment),
  nombre: STRING(100) UNIQUE NOT NULL,
  descripcion: TEXT,
  estado: ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 2. **Empleados**

Información de los colaboradores.

```javascript
{
  id: INTEGER (PK, auto-increment),
  nombre: STRING(100) NOT NULL,
  apellido: STRING(100) NOT NULL,
  email: STRING(100) UNIQUE,
  telefono: STRING(20),
  puesto: STRING(100),
  departamento_id: INTEGER (FK → Departamento),
  hora_entrada: TIME DEFAULT '09:00:00',
  hora_salida: TIME DEFAULT '18:00:00',
  estado: ENUM('activo', 'inactivo') DEFAULT 'activo',
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 3. **Registros**

Marcaciones diarias de entrada/salida.

```javascript
{
  id: INTEGER (PK, auto-increment),
  empleado_id: INTEGER (FK → Empleado),
  fecha: DATEONLY NOT NULL,
  hora_entrada: TIME,
  hora_salida: TIME,
  observaciones: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP,
  deleted_at: TIMESTAMP (soft delete)
}
```

**Restricción única**: Un empleado solo puede tener un registro por día.

```sql
UNIQUE (empleado_id, fecha)
```

#### 4. **Usuarios**

Credenciales de acceso al sistema.

```javascript
{
  id: INTEGER (PK, auto-increment),
  username: STRING(50) UNIQUE NOT NULL,
  contraseña: STRING(255) NOT NULL, // Hash bcrypt
  rol: ENUM('admin', 'supervisor', 'empleado') DEFAULT 'empleado',
  empleado_id: INTEGER UNIQUE (FK → Empleado),
  ultimo_acceso: DATE,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

**Relación 1:1 con Empleado**: Cada usuario está vinculado a un empleado.

#### 5. **Auditoría**

Trazabilidad de todas las operaciones críticas.

```javascript
{
  id: INTEGER (PK, auto-increment),
  usuario_id: INTEGER (FK → Usuario),
  accion: STRING(100) NOT NULL,
  tabla_afectada: STRING(50),
  registro_id: INTEGER,
  detalles: TEXT,
  ip_address: STRING(45),
  created_at: TIMESTAMP
}
```

#### 6. **Justificaciones**

Motivos de faltas, retardos o salidas tempranas.

```javascript
{
  id: INTEGER (PK, auto-increment),
  empleado_id: INTEGER (FK → Empleado),
  registro_id: INTEGER (FK → Registro),
  tipo: ENUM('falta', 'retardo', 'salida_temprana'),
  motivo: TEXT NOT NULL,
  aprobado: BOOLEAN DEFAULT NULL,
  aprobado_por: INTEGER (FK → Usuario),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 7. **Turnos**

Horarios laborales disponibles.

```javascript
{
  id: INTEGER (PK, auto-increment),
  nombre: STRING(50) UNIQUE NOT NULL,
  hora_inicio: TIME NOT NULL,
  hora_fin: TIME NOT NULL,
  descripcion: TEXT,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

#### 8. **EmpleadoTurno**

Asignación de turnos a empleados (tabla intermedia).

```javascript
{
  id: INTEGER (PK, auto-increment),
  empleado_id: INTEGER (FK → Empleado),
  turno_id: INTEGER (FK → Turno),
  fecha_inicio: DATEONLY NOT NULL,
  fecha_fin: DATEONLY,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

### 🔗 Relaciones

```javascript
// En backend/src/models/index.js

// Departamento → Empleado (1:N)
Departamento.hasMany(Empleado, { foreignKey: 'departamento_id' });
Empleado.belongsTo(Departamento, { foreignKey: 'departamento_id' });

// Empleado → Registro (1:N)
Empleado.hasMany(Registro, { foreignKey: 'empleado_id' });
Registro.belongsTo(Empleado, { foreignKey: 'empleado_id' });

// Empleado → Usuario (1:1)
Empleado.hasOne(Usuario, { foreignKey: 'empleado_id' });
Usuario.belongsTo(Empleado, { foreignKey: 'empleado_id' });

// Usuario → Auditoría (1:N)
Usuario.hasMany(Auditoria, { foreignKey: 'usuario_id' });
Auditoria.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Empleado → Justificación (1:N)
Empleado.hasMany(Justificacion, { foreignKey: 'empleado_id' });
Justificacion.belongsTo(Empleado, { foreignKey: 'empleado_id' });

// Turno → EmpleadoTurno (1:N)
Turno.hasMany(EmpleadoTurno, { foreignKey: 'turno_id' });
EmpleadoTurno.belongsTo(Turno, { foreignKey: 'turno_id' });

// Empleado → EmpleadoTurno (1:N)
Empleado.hasMany(EmpleadoTurno, { foreignKey: 'empleado_id' });
EmpleadoTurno.belongsTo(Empleado, { foreignKey: 'empleado_id' });
```

### 🗑️ Soft Delete (Paranoid Mode)

El modelo `Registro` usa **soft delete**:

- No elimina físicamente los registros
- Agrega un timestamp en `deleted_at`
- Los registros eliminados no aparecen en queries normales
- Se pueden restaurar con `.restore()`
- Se pueden eliminar permanentemente con `.destroy({ force: true })`

```javascript
// backend/src/models/registro.model.js
const Registro = sequelize.define('Registro', {
  // ... campos
}, {
  paranoid: true, // Habilita soft delete
  timestamps: true,
  tableName: 'registros'
});
```

---

## 8. API REST - Endpoints

### 🔐 Autenticación

Todas las rutas protegidas requieren el header:

```
Authorization: Bearer <JWT_TOKEN>
```

### 📍 Base URL

**Desarrollo**: `http://localhost:4000/api`  
**Producción**: `https://tu-backend.onrender.com/api`

---

### 👤 Usuarios y Autenticación

#### `POST /api/usuarios/login`

Inicia sesión y devuelve token JWT.

**Body**:
```json
{
  "username": "admin",
  "contraseña": "Admin123!",
  "role": "admin"
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "rol": "admin",
      "empleado": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores**:
- `400`: Credenciales incorrectas
- `401`: Usuario no autorizado para ese rol

---

#### `POST /api/usuarios/logout`

Cierra sesión (limpia token en cliente).

**Headers**: `Authorization: Bearer <token>`

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Sesión cerrada correctamente"
}
```

---

#### `GET /api/usuarios/verify`

Verifica si el token es válido y retorna datos del usuario.

**Headers**: `Authorization: Bearer <token>`

**Respuesta 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "rol": "admin",
    "empleado": { ...datos del empleado }
  }
}
```

---

#### `GET /api/usuarios`

Lista todos los usuarios (sin contraseñas).

**Headers**: `Authorization: Bearer <token>` (admin/supervisor)

**Respuesta 200**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "rol": "admin",
      "empleado": { "nombre": "Juan", "apellido": "Pérez" }
    }
  ]
}
```

---

#### `POST /api/usuarios`

Crear un nuevo usuario.

**Headers**: `Authorization: Bearer <token>` (admin)

**Body**:
```json
{
  "username": "nuevo_usuario",
  "contraseña": "$2b$10$...hash_bcrypt...",
  "rol": "empleado",
  "empleado_id": 10
}
```

**⚠️ NOTA**: El backend NO hashea automáticamente la contraseña. Debes generar el hash con:

```powershell
cd backend
node scripts/generate-password-hash.js
```

**Respuesta 201**:
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": { ...usuario creado }
}
```

---

#### `PUT /api/usuarios/:id`

Actualizar un usuario.

**Headers**: `Authorization: Bearer <token>` (admin)

**Body** (campos opcionales):
```json
{
  "username": "nuevo_nombre",
  "rol": "supervisor"
}
```

---

#### `DELETE /api/usuarios/:id`

Eliminar un usuario.

**Headers**: `Authorization: Bearer <token>` (admin)

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

### 📝 Registros - Flujos de Colaborador

#### `POST /api/registros/marcar`

Marca entrada o salida automáticamente según el estado del día.

**Headers**: `Authorization: Bearer <token>` (empleado)

**Body** (opcional):
```json
{
  "observaciones": "Texto libre"
}
```

**Respuesta 201** (entrada):
```json
{
  "success": true,
  "type": "entrada",
  "data": {
    "id": 123,
    "empleado_id": 10,
    "fecha": "2025-11-15",
    "hora_entrada": "09:05:00",
    "hora_salida": null
  }
}
```

**Respuesta 200** (salida):
```json
{
  "success": true,
  "type": "salida",
  "data": {
    "id": 123,
    "hora_entrada": "09:05:00",
    "hora_salida": "18:00:00"
  }
}
```

**Errores**:
- `409`: Ya marcaste entrada y salida hoy

---

#### `GET /api/registros/mi-estado`

Devuelve el estado de marcación del día actual.

**Headers**: `Authorization: Bearer <token>` (empleado)

**Respuesta 200**:
```json
{
  "success": true,
  "status": "fuera",  // o "dentro" o "completo"
  "data": null  // o datos del registro si existe
}
```

---

#### `GET /api/registros/mi-historial?limit=30`

Devuelve el historial del colaborador autenticado.

**Headers**: `Authorization: Bearer <token>` (empleado)

**Query Params**:
- `limit`: Número de registros (default: 30)

**Respuesta 200**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 123,
      "fecha": "2025-11-15",
      "hora_entrada": "09:00:00",
      "hora_salida": "18:00:00",
      "observaciones": null
    }
  ]
}
```

---

#### `POST /api/registros/entrada-justificada`

Para llegadas tarde (>15 min del horario configurado).

**Headers**: `Authorization: Bearer <token>` (empleado)

**Body**:
```json
{
  "justificacion": "Retraso por tráfico"
}
```

**Respuesta 201**:
```json
{
  "success": true,
  "message": "Entrada registrada con justificación",
  "data": { ...registro creado }
}
```

**Errores**:
- `400`: Falta justificación
- `409`: Ya existe registro hoy

---

#### `POST /api/registros/salida-justificada`

Para salidas anticipadas (>15 min antes del horario).

**Headers**: `Authorization: Bearer <token>` (empleado)

**Body**:
```json
{
  "justificacion": "Salida por cita médica"
}
```

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Salida registrada con justificación",
  "data": { ...registro actualizado }
}
```

**Errores**:
- `404`: No existe entrada hoy
- `409`: Ya había salida registrada

---

#### `POST /api/registros/salida-incidente`

Registra salida sin entrada (incidencia).

**Headers**: `Authorization: Bearer <token>` (empleado)

**Body**:
```json
{
  "motivo": "Olvidé marcar entrada"
}
```

**Respuesta 201**:
```json
{
  "success": true,
  "message": "Salida incidente registrada",
  "data": { ...registro creado }
}
```

**Errores**:
- `409`: Ya existe registro hoy

---

### 📊 Registros - Administración

#### `GET /api/registros`

Lista registros con filtros opcionales.

**Headers**: `Authorization: Bearer <token>` (admin/supervisor)

**Query Params**:
- `fecha`: YYYY-MM-DD
- `empleado_id`: number
- `limit`: number (default: 100)

**Respuesta 200**:
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "id": 123,
      "fecha": "2025-11-15",
      "empleado": {
        "nombre": "Juan",
        "apellido": "Pérez"
      },
      "hora_entrada": "09:00:00",
      "hora_salida": "18:00:00"
    }
  ]
}
```

---

#### `GET /api/registros/rango`

Registros en un rango de fechas.

**Headers**: `Authorization: Bearer <token>` (admin/supervisor)

**Query Params** (requerido):
- `fecha_inicio`: YYYY-MM-DD
- `fecha_fin`: YYYY-MM-DD
- `empleado_id`: number (opcional)

**Ejemplo**:
```
GET /api/registros/rango?fecha_inicio=2025-11-01&fecha_fin=2025-11-30
```

---

#### `GET /api/registros/eliminados`

Lista registros con soft delete (papelera).

**Headers**: `Authorization: Bearer <token>` (admin)

**Respuesta 200**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 123,
      "deleted_at": "2025-11-15T10:30:00Z",
      ...
    }
  ]
}
```

---

#### `POST /api/registros/:id/restaurar`

Restaura un registro eliminado.

**Headers**: `Authorization: Bearer <token>` (admin)

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Registro restaurado exitosamente",
  "data": { ...registro restaurado }
}
```

---

#### `DELETE /api/registros/:id`

Soft delete (papelera).

**Headers**: `Authorization: Bearer <token>` (admin)

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Registro eliminado exitosamente"
}
```

---

#### `DELETE /api/registros/:id/permanente`

Elimina definitivamente un registro (hard delete).

**Headers**: `Authorization: Bearer <token>` (admin)

**Respuesta 200**:
```json
{
  "success": true,
  "message": "Registro eliminado permanentemente"
}
```

---

### 👥 Empleados

#### `GET /api/empleados`

Listar empleados.

**Headers**: `Authorization: Bearer <token>` (admin/supervisor)

**Query Params**:
- `estado`: activo|inactivo
- `departamento_id`: number

**Respuesta 200**:
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "id": 10,
      "nombre": "Juan",
      "apellido": "Pérez",
      "email": "juan.perez@empresa.com",
      "departamento": {
        "id": 1,
        "nombre": "RR.HH."
      },
      "puesto": "Analista",
      "hora_entrada": "09:00:00",
      "hora_salida": "18:00:00"
    }
  ]
}
```

---

#### `GET /api/empleados/:id`

Obtener empleado por ID.

**Headers**: `Authorization: Bearer <token>` (admin/supervisor)

---

#### `POST /api/empleados`

Crear empleado.

**Headers**: `Authorization: Bearer <token>` (admin)

**Body**:
```json
{
  "nombre": "María",
  "apellido": "González",
  "email": "maria.gonzalez@empresa.com",
  "telefono": "555-1234",
  "puesto": "Desarrolladora",
  "departamento_id": 2,
  "hora_entrada": "09:00:00",
  "hora_salida": "18:00:00"
}
```

---

#### `PUT /api/empleados/:id`

Actualizar empleado.

**Headers**: `Authorization: Bearer <token>` (admin)

---

#### `DELETE /api/empleados/:id`

Soft delete / desactivar empleado.

**Headers**: `Authorization: Bearer <token>` (admin)

---

### 🏢 Departamentos

#### `GET /api/departamentos`

Listar departamentos.

**Respuesta 200**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "nombre": "RR.HH.",
      "descripcion": "Recursos Humanos",
      "estado": "activo"
    }
  ]
}
```

---

#### `POST /api/departamentos`

Crear departamento.

**Headers**: `Authorization: Bearer <token>` (admin)

**Body**:
```json
{
  "nombre": "IT",
  "descripcion": "Tecnologías de la Información"
}
```

---

#### `PUT /api/departamentos/:id`

Actualizar departamento.

---

#### `DELETE /api/departamentos/:id`

Eliminar departamento.

---

### 🏥 Health Checks

#### `GET /health`

Estado general del servidor.

**Respuesta 200**:
```json
{
  "success": true,
  "timestamp": "2025-11-15T10:30:00Z",
  "uptime": 123.45,
  "environment": "production",
  "server": "online",
  "database": "connected",
  "dbResponseTime": "50ms"
}
```

---

#### `GET /health/ping`

Ping rápido.

**Respuesta 200**:
```json
{
  "success": true,
  "message": "pong"
}
```

---

### ❌ Manejo de Errores

Formato general de error:

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

**Códigos HTTP**:
- `400`: Validación
- `401`: No autorizado / token inválido
- `403`: Prohibido (rol sin permisos)
- `404`: No encontrado
- `409`: Conflicto (duplicados o estado incompatible)
- `500`: Error interno

---

## 9. Guía de Uso

### 🔐 Acceso y Autenticación

1. Abre el frontend: `http://localhost:3000`
2. Selecciona tu rol en el conmutador (Colaborador / Administrador)
3. Ingresa usuario y contraseña
4. El sistema guarda un token JWT (válido 24 horas)

**Usuarios de ejemplo**:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `Admin123!` | admin |
| `supervisor` | `Supervisor123!` | supervisor |
| `empleado1` | `Empleado123!` | empleado |

### 👨‍💼 Uso como Colaborador (Empleado)

#### Panel de Asistencia

Al iniciar sesión como Colaborador, verás:

- **Encabezado**: Tu nombre y departamento
- **Reloj en vivo**: Hora actual
- **Botones de marcación**: "Marcar Entrada" y "Marcar Salida"
- **Resumen del día**: Horas de entrada/salida si ya existen
- **Historial**: Últimos 5 días
- **Observaciones**: Justificaciones o incidentes

#### Marcar Entrada

1. Pulsa **"Marcar Entrada"** al llegar
2. Si llegas >15 minutos tarde respecto a tu horario:
   - Aparece diálogo de "Llegada tarde"
   - Escribe justificación (ej. "Tráfico")
   - Confirma
3. La entrada queda registrada con observación

#### Marcar Salida

1. Pulsa **"Marcar Salida"** al terminar tu jornada
2. Casos especiales:
   - **Sin entrada**: Aparece diálogo de "Salida sin entrada"
   - **Salida anticipada** (>15 min antes): Aparece diálogo de justificación
3. La salida queda registrada

#### Estados del Día

- **Fuera**: No hay registro de hoy
- **Dentro**: Marcaste entrada, pero aún no salida
- **Completo**: Ya registraste entrada y salida

#### Historial

- Muestra últimos 5 días con horas
- Incluye observaciones si las hay

#### Cerrar Sesión

- Haz clic en el icono de salida (esquina superior derecha)
- La sesión se borra y vuelves al login

---

### 👨‍💻 Uso como Administrador/Supervisor

#### Panel de Administración

Secciones disponibles:

##### 1. Registros de Asistencia

**Pestaña "Registros Activos"**:
- Ver todos los registros activos
- Buscar por nombre de empleado
- Filtrar por fecha
- Ordenar por diferentes criterios
- Eliminar registros (soft delete)

**Pestaña "Eliminados"**:
- Ver registros eliminados (papelera)
- Restaurar registros accidentalmente eliminados
- Eliminar permanentemente (con doble confirmación)
- Filtrar y buscar igual que en activos

##### 2. Empleados

- Lista empleados, su departamento, horario y estado
- Crear/editar empleados
- Definir horario (`hora_entrada`/`hora_salida`)
- Desactivar empleados

##### 3. Departamentos

- Crear/editar/eliminar departamentos
- Organizar la estructura organizacional

##### 4. Resúmenes/Estadísticas

- Horas trabajadas
- Totales y KPIs
- Gráficos (según UI disponible)

#### Permisos por Rol

- **Admin**: Acciones avanzadas (restauraciones, eliminaciones permanentes)
- **Supervisor**: Permisos intermedios (consulta y gestión no destructiva)

---

### 🎯 Primeros Pasos (Administradores)

1. **Crear Departamentos** (ej. RR.HH., Ventas, IT)
2. **Crear Empleados** y asignarlos a un departamento
3. **Definir horario** (hora_entrada / hora_salida) por empleado
4. **Crear Usuarios** del sistema y vincularlos a empleados
5. **Probar flujo completo**: login → marcar entrada → marcar salida

---

## 10. Seguridad

### 🔒 Implementado

#### 1. Protección de Headers HTTP (Helmet)

```javascript
// backend/src/middlewares/security.middleware.js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));
```

**Protege contra**:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME Sniffing
- Otros ataques de headers

---

#### 2. Rate Limiting

```javascript
// Límites implementados:
// General: 100 requests/15min por IP
// Login: 5 intentos/15min (previene fuerza bruta)
// Creación: 10 requests/hora
```

---

#### 3. CORS Seguro

```javascript
// Solo dominios whitelist
const allowedOrigins = [
  'http://localhost:3000',
  'https://tu-frontend.vercel.app'
];
```

---

#### 4. SQL Injection Protection

- ✅ Sequelize ORM (parameterized queries)
- ✅ Middleware de detección de SQL injection
- ✅ Input sanitization con express-validator

---

#### 5. Autenticación JWT

```javascript
// Token con expiración de 24 horas
const token = jwt.sign(
  { id: user.id, rol: user.rol },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

---

#### 6. Passwords con Bcrypt

```javascript
// 10 rounds de hashing
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
```

**Generar hashes**:

```powershell
cd backend
node scripts/generate-password-hash.js
```

---

#### 7. Variables de Entorno

- ✅ `.env` en `.gitignore`
- ✅ Validación de variables críticas al inicio
- ✅ `.env.example` documentado

---

#### 8. SSL/HTTPS

- ✅ Automático en producción (Render + Vercel)
- ✅ `dialectOptions.ssl` en PostgreSQL

---

### 🚨 Checklist de Seguridad

Antes de deployment:

- [ ] ✅ `.env` NO está en el repositorio
- [ ] ✅ `JWT_SECRET` único y seguro (64+ caracteres)
- [ ] ✅ Contraseñas hasheadas con bcrypt
- [ ] ✅ CORS restrictivo (no `origin: '*'`)
- [ ] ✅ Helmet configurado
- [ ] ✅ Rate limiting activo
- [ ] ✅ SQL injection protection
- [ ] ✅ HTTPS/SSL activo
- [ ] ✅ Validación en todos los endpoints
- [ ] ✅ Error handling apropiado
- [ ] ✅ Logs sin datos sensibles
- [ ] ✅ NODE_ENV=production

---

### 🔐 Generar JWT_SECRET Seguro

```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copia el resultado y úsalo en `.env`:

```env
JWT_SECRET=a1b2c3d4e5f6...64_caracteres_aleatorios
```

---

### ⚠️ Errores Críticos que Evitar

#### ❌ NUNCA subas .env al repositorio

```bash
# Verifica que .gitignore incluya:
.env
.env.local
.env.*.local
```

#### ❌ NUNCA uses valores por defecto en producción

```javascript
// ❌ MAL
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ✅ BIEN
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  logger.error('JWT_SECRET no definido');
  process.exit(1);
}
```

#### ❌ NUNCA hardcodees credenciales

```javascript
// ❌ MAL
const db = new Sequelize('dbname', 'user', 'password123');

// ✅ BIEN
const db = new Sequelize(process.env.DATABASE_URL);
```

#### ❌ NUNCA expongas stack traces en producción

```javascript
// ❌ MAL
res.status(500).json({ error: error.stack });

// ✅ BIEN
if (NODE_ENV === 'production') {
  res.status(500).json({ message: 'Error interno' });
} else {
  res.status(500).json({ message: error.message, stack: error.stack });
}
```

---

### 📚 OWASP Top 10 - Protección

Tu backend está protegido contra:

- ✅ A01 - Broken Access Control
- ✅ A02 - Cryptographic Failures
- ✅ A03 - Injection
- ✅ A04 - Insecure Design
- ✅ A05 - Security Misconfiguration
- ✅ A06 - Vulnerable Components
- ✅ A07 - Identification/Auth Failures

---

## 11. Deployment

### 🚀 Backend en Render

#### 1. Crear Base de Datos en Neon

1. Ve a [neon.tech](https://neon.tech) y crea cuenta
2. Crea proyecto: **"timetrack-db"**
3. Copia la **Connection String**:
   ```
   postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
   ```

#### 2. Crear Web Service en Render

1. Ve a [render.com/dashboard](https://render.com/dashboard)
2. **New +** → **Web Service**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `timetrack-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### 3. Variables de Entorno en Render

```env
NODE_ENV=production
DATABASE_URL=postgresql://...tu_connection_string_de_neon...
JWT_SECRET=...genera_uno_seguro_con_64_caracteres...
FRONTEND_URL=https://tu-frontend.vercel.app
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10
TZ=-06:00
LOG_LEVEL=info
```

#### 4. Deploy

Click en **"Deploy"** y espera 2-5 minutos.

#### 5. Verificar

```
https://tu-app.onrender.com/health
```

**Respuesta esperada**:
```json
{
  "success": true,
  "database": "connected",
  "server": "online"
}
```

---

### 🌐 Frontend en Vercel

#### 1. Importar Proyecto

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio
3. Configura:
   - **Framework**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### 2. Variables de Entorno en Vercel

```env
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

**⚠️ IMPORTANTE**: El prefijo debe ser `NEXT_PUBLIC_`

#### 3. Deploy

Click en **"Deploy"** y espera 2-3 minutos.

#### 4. Verificar

Abre `https://tu-proyecto.vercel.app` y prueba el login.

---

### 🔄 Deploy Automático

Cada push a la rama `main` despliega automáticamente en Render y Vercel.

---

### 📊 Monitoreo Post-Deployment

#### Backend (Render)

- Ve a **Logs** en Render Dashboard
- Revisa **Metrics** (CPU, Memory, Requests)

#### Frontend (Vercel)

- Ve a **Analytics** en Vercel Dashboard
- Revisa **Function Logs** si hay errores

---

## 12. Mantenimiento

### 🔄 Actualizar Dependencias

```powershell
# Backend
cd backend
npm audit
npm audit fix
npm outdated
npm update

# Frontend
cd frontend
npm audit
npm audit fix
npm outdated
npm update
```

---

### 📊 Monitoreo Continuo

#### Sentry (Error Tracking)

```powershell
npm install @sentry/node @sentry/tracing
```

```javascript
// backend/src/app.js
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

### 🗄️ Backups de Base de Datos

**Neon hace backups automáticos**, pero puedes hacer uno manual:

```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

---

### 📈 Escalar la Aplicación

#### Aumentar Pool de Conexiones

```javascript
// backend/src/config/db.config.js
pool: {
  max: 20, // Aumentar según plan de Render
  min: 5,
  acquire: 60000,
  idle: 10000
}
```

#### Upgrade de Plan en Render

1. Ve a **Settings** → **Plan**
2. Selecciona un plan paid para más recursos

---

## 13. Troubleshooting

### ❌ Error: "Unable to connect to the database"

**Causa**: PostgreSQL no está corriendo o credenciales incorrectas.

**Solución**:

```powershell
# Verificar servicio PostgreSQL
sc query postgresql-x64-16

# Iniciar si está detenido
net start postgresql-x64-16

# Verificar credenciales en .env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_contraseña_correcta
```

---

### ❌ Error: "Port 4000 already in use"

**Solución**: Cambia el puerto en `.env`:

```env
PORT=5000
```

---

### ❌ Error: "JWT_SECRET is not defined"

**Solución**:

1. Genera un JWT_SECRET:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
2. Agrégalo a `.env`:
   ```env
   JWT_SECRET=...tu_secret_generado...
   ```
3. Reinicia el servidor

---

### ❌ Error: "Login falla siempre"

**Causa**: La contraseña en BD no es un hash bcrypt válido.

**Solución**:

1. Genera hash:
   ```powershell
   cd backend
   node scripts/generate-password-hash.js
   ```
2. Actualiza la BD:
   ```sql
   UPDATE usuarios 
   SET contraseña = '$2b$10$...hash_generado...' 
   WHERE username = 'admin';
   ```

---

### ❌ Error: "CORS blocked"

**Solución**: Ajusta `FRONTEND_URL` en `backend/.env`:

```env
FRONTEND_URL=http://localhost:3000
```

Y verifica el middleware CORS:

```javascript
// backend/src/app.js
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000'
];
```

---

### ❌ Error: "deleted_at column doesn't exist"

**Solución**: Ejecuta la migración de soft delete:

```sql
ALTER TABLE registros 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_registros_deleted_at ON registros(deleted_at);
```

---

### ❌ Error: "Cannot read property 'empleado' of undefined"

**Causa**: El backend no está retornando las relaciones.

**Solución**: Verifica que los controladores incluyan:

```javascript
Registro.findAll({
  include: [
    { model: Empleado, as: 'empleado' }
  ]
});
```

---

### ❌ Error 503 en /health (producción)

**Causa**: Base de datos no responde.

**Solución**:

1. Verifica que Neon esté activo (dashboard)
2. Revisa logs en Render
3. Verifica que `DATABASE_URL` termine en `?sslmode=require`

---

## 14. Recursos Adicionales

### 📚 Documentación Oficial

- [Express.js](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### 🔐 Seguridad

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)

### 🚀 Deployment

- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Docs](https://vercel.com/docs)

### 🛠️ Herramientas

- [Postman](https://www.postman.com/) - Testing de API
- [pgAdmin](https://www.pgadmin.org/) - GUI para PostgreSQL
- [DBeaver](https://dbeaver.io/) - Cliente de BD universal

---

## 🎯 Checklist Final - Listo para Producción

### Código
- [ ] ✅ Sin `console.log()` en producción
- [ ] ✅ Sin TODOs o FIXMEs críticos
- [ ] ✅ Sin credenciales hardcodeadas
- [ ] ✅ Validación en todos los endpoints
- [ ] ✅ Error handling en todas las rutas
- [ ] ✅ Logging apropiado

### Seguridad
- [ ] ✅ Helmet configurado
- [ ] ✅ CORS restrictivo
- [ ] ✅ Rate limiting activo
- [ ] ✅ JWT_SECRET único y seguro
- [ ] ✅ Passwords con bcrypt
- [ ] ✅ SQL injection protection
- [ ] ✅ HTTPS/SSL activo

### Base de Datos
- [ ] ✅ SSL habilitado
- [ ] ✅ Pool size apropiado
- [ ] ✅ Timeouts configurados
- [ ] ✅ Backups configurados

### Variables de Entorno
- [ ] ✅ .env en .gitignore
- [ ] ✅ .env.example actualizado
- [ ] ✅ NODE_ENV=production
- [ ] ✅ DATABASE_URL correcta
- [ ] ✅ FRONTEND_URL correcta

### Testing
- [ ] ✅ Health check funciona
- [ ] ✅ Login funciona
- [ ] ✅ CORS funciona con frontend
- [ ] ✅ Autenticación funciona
- [ ] ✅ Marcación de asistencia funciona

---

## 👥 Equipo y Licencia

**TimeTrack Team** - Noviembre 2025

**Licencia**: MIT License

---

## 📞 Soporte

Para problemas o preguntas:

1. **Revisa esta documentación completa**
2. **Consulta la sección de Troubleshooting**
3. **Revisa logs** en Render/Vercel
4. **GitHub Issues**: Reporta bugs en el repositorio

---

## ✅ Estado del Proyecto

### Implementado ✅
- Sistema de autenticación completo
- Marcación de entrada/salida
- Justificaciones automáticas
- Soft delete (papelera)
- Panel administrativo
- API REST completa
- Seguridad empresarial
- Deployment en producción

### Pendiente ⏳
- Tests automatizados
- CI/CD pipeline
- Refresh tokens
- 2FA (autenticación de dos factores)
- Exportación a CSV/PDF
- Gráficos de estadísticas
- Notificaciones por email
- Reportes avanzados

---

**¡TimeTrack está listo para producción! 🚀**

---

**Última actualización**: Noviembre 15, 2025  
**Versión de documentación**: 1.0.0
