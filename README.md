# TimeTrack — Sistema de Control de Asistencias

TimeTrack es una aplicación web para registrar y gestionar la asistencia de empleados. Incluye un panel de colaborador para fichar entrada/salida con justificaciones y un panel administrativo para gestión de empleados, departamentos y registros.

## ✨ Características principales

- Fichaje de entrada/salida por colaborador (automático según estado)
- Justificaciones de llegada tarde, salida anticipada e incidencia de salida sin entrada
- Historial personal de asistencias (últimos días)
- Gestión de empleados, usuarios, departamentos y registros (admin/supervisor)
- Roles y autenticación con JWT (admin, supervisor, empleado)
- API REST con Express + Sequelize + PostgreSQL
- Frontend React con UI moderna (Tailwind) y estado global con Zustand

## 🧱 Arquitectura

Monorepo con dos carpetas principales:

```
CONTROL-DE-ASISTENCIAS---TIMETRACK/
├─ backend/     # API REST (Express + Sequelize + PostgreSQL)
└─ frontend/    # Aplicación React (CRA) + Tailwind + React Router
```

Comunicación: el frontend consume el backend vía HTTP (CORS habilitado). La autenticación usa JWT en el header Authorization: Bearer <token>.

## 🛠 Tecnologías

- Backend: Node 18+, Express 5, Sequelize 6, PostgreSQL 12+, JWT, CORS, Morgan
- Frontend: React 19, react-router-dom, TailwindCSS, Axios, Zustand, Lucide Icons

## 📂 Estructura de carpetas (resumen)

```
backend/
	src/
		app.js                 # Middlewares, CORS y montaje de rutas
		server.js              # Boot del servidor y health checks
		config/db.config.js    # Configuración de PostgreSQL (dotenv)
		database/              # Init Sequelize (test/sync)
		middlewares/           # auth, error handler
		models/                # Sequelize models y relaciones
		controllers/           # Lógica de negocio
		routes/                # Rutas API (empleados, usuarios, registros, departamentos)
	scripts/generate-password-hash.js  # Utilidad para generar hashes bcrypt

frontend/
	src/
		api/                   # Clientes Axios (auth, employee, admin)
		pages/                 # Páginas (Dashboard Admin/Colaborador, Login)
		components/            # Componentes UI y diálogos
		store/useAuthStore.js  # Estado global de autenticación (Zustand)
		app/                   # Estilos y layout global
```

## ⚙️ Requisitos previos

- Node.js 18 o superior
- PostgreSQL 12 o superior en ejecución local
- Windows PowerShell (este README incluye comandos para PowerShell)

## 🔐 Variables de entorno

Backend (`backend/.env`):

```
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=timetrack
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA
DB_DIALECT=postgres

# JWT
JWT_SECRET=cambia_este_secreto_en_produccion
```

Frontend (`frontend/.env` opcional):

```
REACT_APP_API_URL=http://localhost:4000/api
```

Si no defines `REACT_APP_API_URL`, el frontend usará `http://localhost:4000/api` por defecto.

## 🚀 Puesta en marcha (desarrollo)

1) Instalar dependencias

```powershell
cd backend; npm install; cd ..
cd frontend; npm install; cd ..
```

2) Configurar base de datos PostgreSQL

- Crea la base de datos `timetrack` y configura las credenciales en `backend/.env`.
- Asegúrate de que el servicio de PostgreSQL está iniciado.

3) Iniciar el backend (puerto 4000)

```powershell
cd backend; npm run dev
```

4) Iniciar el frontend (puerto 3000)

Abre otra terminal y ejecuta:

```powershell
cd frontend; npm start
```

5) Verificar

- Backend health: http://localhost:4000
- API info: http://localhost:4000/api
- Frontend: http://localhost:3000

## 👤 Usuarios y autenticación

El login genera un token JWT que el frontend almacena y envía en `Authorization: Bearer <token>`.

Importante sobre contraseñas:

- El login valida contraseñas con bcrypt. Por ello, la columna `contraseña` en la tabla `usuarios` debe almacenar el HASH bcrypt, no texto plano.
- El endpoint `POST /api/usuarios` aún no aplica hashing (marcado como TODO). Recomendación: genera el hash y crea el usuario con ese hash directamente en la base de datos, o ajusta el controlador para hashear antes de guardar.

Generar hashes de ejemplo (admin/colaborador):

```powershell
cd backend; node scripts/generate-password-hash.js
```

Luego, inserta el hash en la tabla `usuarios` (columna `contraseña`).

Roles soportados en backend: `admin`, `supervisor`, `empleado`.

## 📲 Flujos de uso (Colaborador)

- Marcar Entrada: si hoy no hay registro, se crea con `hora_entrada`.
- Marcar Salida: si hoy hay entrada y aún no hay salida, se actualiza `hora_salida`.
- Llegada tarde (>15 min del horario configurado en el empleado): el frontend solicita justificación y usa `POST /api/registros/entrada-justificada`.
- Salida anticipada (>15 min antes del horario): el frontend solicita justificación y usa `POST /api/registros/salida-justificada`.
- Salida sin entrada: registra incidente con `POST /api/registros/salida-incidente`.

Estado actual del día (`GET /api/registros/mi-estado`): `fuera`, `dentro` o `completo`.

Historial personal (`GET /api/registros/mi-historial?limit=30`).

Nota: Las reglas de “15 minutos” se aplican en la UI; el backend registra y deja rastros en `observaciones`.

## 🔗 Endpoints principales

- Autenticación: `POST /api/usuarios/login`, `POST /api/usuarios/logout`, `GET /api/usuarios/verify`
- Registros (empleado autenticado): `POST /api/registros/marcar`, `GET /api/registros/mi-estado`, `GET /api/registros/mi-historial`, `POST /api/registros/entrada-justificada`, `POST /api/registros/salida-justificada`, `POST /api/registros/salida-incidente`
- Registros (admin/supervisor): CRUD, filtros por rango, papelera y restauración
- Empleados/Usuarios/Departamentos: CRUD

Consulta la documentación detallada en `docs/API-ENDPOINTS.md`.

## 🧰 Scripts útiles

- Backend
	- `npm run dev`: servidor con nodemon
	- `npm start`: servidor en producción
- Frontend
	- `npm start`: servidor de desarrollo (CRA)
	- `npm run build`: build de producción

## 🔒 Seguridad y buenas prácticas

- Mantén `JWT_SECRET` fuera del repositorio (usa `.env`)
- Usa HTTPS en producción y configura CORS por dominio
- Valida siempre la entrada de datos; maneja errores con el middleware incluido

## 🧪 Comprobaciones rápidas

Backend health (PowerShell):

```powershell
curl http://localhost:4000
```

Respuesta esperada:

```json
{
	"success": true,
	"message": "✅ TimeTrack Backend API",
	"version": "1.0.0",
	"status": "running"
}
```

## 🐞 Troubleshooting

- Puerto ocupado: cambia `PORT` en `backend/.env`.
- No conecta a PostgreSQL: revisa servicio activo, credenciales y DB `timetrack` creada.
- Login falla siempre: verifica que la contraseña en DB sea un hash bcrypt válido para el password ingresado.
- CORS bloqueado: ajusta `FRONTEND_URL` en `backend/.env`.

## 📚 Recursos

- Guía de uso (usuarios finales): `docs/GUIA-DE-USO.md`
- Endpoints de la API: `docs/API-ENDPOINTS.md`
- Backend: `backend/README.md` (detalles técnicos y modelos)

---

TimeTrack © 2025 — MIT License
