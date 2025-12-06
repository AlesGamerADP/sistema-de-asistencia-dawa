# Sistema de Control de Asistencias TimeTrack

Sistema completo de gestión de asistencia de empleados con panel administrativo y colaborador. Construido con arquitectura moderna cliente-servidor, utilizando Next.js para el frontend y Express.js con PostgreSQL para el backend.

## Descripción General

TimeTrack es una aplicación empresarial diseñada para controlar y gestionar la asistencia de empleados en tiempo real. Proporciona interfaces diferenciadas según el rol del usuario (administrador, colaborador) y permite el registro preciso de entradas, salidas y justificaciones.

### Características Principales

- **Gestión de Asistencias**: Registro automático de entrada/salida con validación de horarios
- **Sistema de Justificaciones**: Manejo de llegadas tardías, salidas anticipadas y ausencias
- **Panel Administrativo**: Control total de empleados, departamentos y registros
- **Panel de Colaborador**: Vista personal de asistencias e historial
- **Reportes y Estadísticas**: Análisis de horas trabajadas, cumplimiento de horarios
- **Sistema de Roles**: Autenticación JWT con permisos diferenciados
- **Paginación Avanzada**: Máximo 7 registros por página en todas las vistas
- **Búsqueda y Filtrado**: Herramientas para localizar información rápidamente

## Arquitectura del Sistema

### Stack Tecnológico

**Backend**
- Node.js 18+ con Express.js 5
- PostgreSQL 12+ como base de datos relacional
- Sequelize ORM para modelado de datos
- JWT para autenticación stateless
- Bcrypt para hashing de contraseñas
- Helmet y Rate Limiting para seguridad

**Frontend**
- Next.js 16.0.7 con Turbopack
- React 19.2.0 con hooks modernos
- Tailwind CSS v4 para estilos
- Framer Motion para animaciones
- Zustand para manejo de estado global
- Axios para comunicación HTTP
- React Router DOM 6.30.2 para navegación

### Estructura del Proyecto

```
sistema-de-asistencia-dawa/
├── backend/                    # API REST y lógica de negocio
│   ├── src/
│   │   ├── config/            # Configuraciones de base de datos
│   │   ├── controllers/       # Controladores de negocio
│   │   ├── database/          # Conexión Sequelize
│   │   ├── middlewares/       # Auth, seguridad, errores
│   │   ├── models/            # Modelos de datos
│   │   ├── routes/            # Definición de endpoints
│   │   ├── utils/             # Utilidades y helpers
│   │   ├── app.js            # Configuración Express
│   │   └── server.js         # Punto de entrada
│   ├── scripts/               # Scripts de utilidad
│   └── package.json
│
├── frontend-timetrack/         # Aplicación web cliente
│   ├── src/
│   │   ├── api/              # Clientes HTTP y endpoints
│   │   ├── components/       # Componentes React reutilizables
│   │   │   ├── admin/       # Componentes del panel admin
│   │   │   ├── employee/    # Componentes de colaboradores
│   │   │   ├── layout/      # Layouts y navegación
│   │   │   └── ui/          # Componentes UI base
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── store/           # Estado global Zustand
│   │   ├── styles/          # Estilos globales
│   │   └── App.tsx          # Componente raíz
│   ├── public/              # Archivos estáticos
│   ├── next.config.ts       # Configuración Next.js
│   ├── tailwind.config.ts   # Configuración Tailwind
│   └── package.json
│
└── docs/                      # Documentación del proyecto
```

## Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.0.0
- PostgreSQL >= 12.0
- npm o yarn
- Git

### Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=timetrack_db

# Servidor
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secreto_muy_seguro_aqui

# Frontend (para CORS)
FRONTEND_URL=http://localhost:3000
```

4. Crear base de datos y tablas:
```bash
npm run db:create
```

5. Poblar con datos iniciales:
```bash
npm run db:seed
```

6. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El backend estará disponible en `http://localhost:4000`

### Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend-timetrack
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
# URL del backend
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

4. Iniciar servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## Uso del Sistema

### Acceso Inicial

**Administrador**
- Usuario: `admin`
- Contraseña: `admin123`
- Rol: Administrador

**Colaborador**
- Usuario: `colaborador`
- Contraseña: `colab123`
- Rol: Empleado

### Flujo de Trabajo

1. **Login**: Seleccionar rol e ingresar credenciales
2. **Dashboard**: Vista según rol asignado
3. **Registro de Asistencia**: Marcar entrada/salida (colaboradores)
4. **Gestión**: Administrar empleados, departamentos, registros (admin)
5. **Reportes**: Consultar estadísticas y resúmenes

## API Endpoints

### Autenticación
- `POST /api/usuarios/login` - Iniciar sesión
- `POST /api/usuarios/logout` - Cerrar sesión
- `GET /api/usuarios/me` - Obtener usuario actual

### Empleados
- `GET /api/empleados` - Listar empleados
- `POST /api/empleados` - Crear empleado
- `PUT /api/empleados/:id` - Actualizar empleado
- `DELETE /api/empleados/:id` - Eliminar empleado (soft delete)

### Registros
- `GET /api/registros` - Listar registros activos
- `POST /api/registros` - Crear registro de asistencia
- `PUT /api/registros/:id` - Actualizar registro
- `DELETE /api/registros/:id` - Eliminar registro
- `GET /api/registros/eliminados` - Listar registros eliminados
- `POST /api/registros/:id/restaurar` - Restaurar registro

### Departamentos
- `GET /api/departamentos` - Listar departamentos
- `POST /api/departamentos` - Crear departamento
- `PUT /api/departamentos/:id` - Actualizar departamento
- `DELETE /api/departamentos/:id` - Eliminar departamento

## Despliegue

### Backend (Render)

1. Conectar repositorio a Render
2. Configurar variables de entorno
3. Comando de build: `npm install`
4. Comando de inicio: `npm start`
5. Agregar PostgreSQL database

### Frontend (Vercel)

1. Conectar repositorio a Vercel
2. Directorio raíz: `frontend-timetrack`
3. Framework: Next.js
4. Comando de build: `npm run build`
5. Variables de entorno: `NEXT_PUBLIC_API_URL`

## Seguridad

- Autenticación JWT con tokens de expiración
- Hashing de contraseñas con Bcrypt (salt rounds: 10)
- Rate limiting para prevenir ataques de fuerza bruta
- CORS configurado con whitelist de dominios
- Helmet para headers de seguridad HTTP
- Validación de inputs con express-validator
- SQL injection protection mediante Sequelize ORM
- XSS protection en frontend

## Contribución

1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## Licencia

MIT License - ver archivo LICENSE para más detalles


## Documentación Adicional

- [Backend README](./backend/README.md) - Documentación detallada del API
- [Frontend README](./frontend-timetrack/README.md) - Documentación de la aplicación web
- [API Endpoints](./docs/API-ENDPOINTS.md) - Especificación completa de endpoints
- [Guía de Uso](./docs/GUIA-DE-USO.md) - Manual de usuario
