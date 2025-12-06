# TimeTrack Frontend - Aplicación Web de Control de Asistencias

Aplicación web moderna para gestión de asistencia de empleados, construida con Next.js 16, React 19 y Tailwind CSS. Proporciona interfaces diferenciadas para administradores y colaboradores con experiencia de usuario optimizada.

## Características Principales

- Arquitectura SPA (Single Page Application) con Client-Side Rendering
- Interfaz responsive adaptada a dispositivos móviles y desktop
- Sistema de autenticación con JWT y gestión de sesiones
- Dashboards diferenciados por rol (Administrador/Colaborador)
- Paginación avanzada (máximo 7 elementos por página)
- Búsqueda y filtrado en tiempo real
- Animaciones fluidas con Framer Motion
- Componentes reutilizables con Shadcn/ui
- Estado global optimizado con Zustand
- Modo oscuro integrado
- Notificaciones toast con Sonner

## Tecnologías Implementadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 16.0.7 | Framework React con optimizaciones |
| React | 19.2.0 | Librería UI con composición de componentes |
| TypeScript | ^5.0 | Tipado estático para mayor seguridad |
| Tailwind CSS | ^4.0 | Framework CSS utility-first |
| Framer Motion | ^11.15.0 | Animaciones y transiciones fluidas |
| React Router DOM | ^6.30.2 | Navegación cliente sin recargas |
| Zustand | ^5.0.2 | Gestión de estado global ligera |
| Axios | ^1.7.9 | Cliente HTTP con interceptores |
| Radix UI | ^2.x | Primitivos UI accesibles |
| Lucide React | ^0.469.0 | Iconos SVG optimizados |
| Sonner | ^1.7.1 | Sistema de notificaciones toast |

## Estructura del Proyecto

```
frontend-timetrack/
├── public/                         # Archivos estáticos
│   └── index.html                 # HTML base
│
├── src/
│   ├── api/                       # Clientes HTTP y endpoints
│   │   ├── client.js             # Axios configurado
│   │   ├── auth.js               # Autenticación
│   │   ├── admin.js              # Endpoints admin
│   │   └── employee.js           # Endpoints empleados
│   │
│   ├── components/                # Componentes React
│   │   ├── admin/                # Panel administrativo
│   │   │   ├── AdminTopbar.tsx
│   │   │   ├── StatsHeader.tsx
│   │   │   ├── EmployeesManagement.tsx
│   │   │   ├── ActiveRecordsView.js
│   │   │   ├── DeletedRecordsView.js
│   │   │   └── HoursSummary.tsx
│   │   │
│   │   ├── employee/             # Panel colaborador
│   │   │   ├── TimeEntryForm.tsx
│   │   │   ├── TimeEntryTable.tsx
│   │   │   ├── LateArrivalDialog.tsx
│   │   │   ├── EarlyExitDialog.tsx
│   │   │   └── ClockOutDialog.tsx
│   │   │
│   │   ├── layout/               # Layouts y navegación
│   │   │   └── Navbar.tsx
│   │   │
│   │   ├── ui/                   # Componentes UI base
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── ... (30+ componentes)
│   │   │
│   │   └── RoleSwitch.tsx        # Selector de rol animado
│   │
│   ├── pages/                     # Páginas de la aplicación
│   │   ├── LoginPage.tsx         # Autenticación
│   │   ├── AdminDashboard.tsx    # Panel administrador
│   │   └── CollaboratorDashboard.tsx # Panel colaborador
│   │
│   ├── store/                     # Estado global Zustand
│   │   ├── useAuthStore.ts       # Estado autenticación
│   │   └── useGlobalStore.ts     # Estado global app
│   │
│   ├── styles/                    # Estilos globales
│   │   ├── globals.css           # Estilos base + Tailwind
│   │   └── role-switch.css       # Estilos segmented control
│   │
│   ├── App.tsx                    # Componente raíz con routing
│   └── index.js                   # Punto de entrada
│
├── .env.local                     # Variables de entorno
├── next.config.ts                 # Configuración Next.js
├── tailwind.config.ts             # Configuración Tailwind
├── tsconfig.json                  # Configuración TypeScript
├── postcss.config.mjs             # Configuración PostCSS
├── eslint.config.mjs              # Configuración ESLint
└── package.json
```

## Instalación y Configuración

### Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0 o yarn >= 1.22.0
- Backend corriendo en puerto 4000 (local) o URL de producción

### Pasos de Instalación

1. Navegar al directorio del frontend:
```bash
cd frontend-timetrack
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:

Crear archivo `.env.local`:
```env
# Producción (Render)
NEXT_PUBLIC_API_URL=https://control-de-asistencias-timetrack.onrender.com/api

# Desarrollo local
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

4. Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

5. Compilar para producción:
```bash
npm run build
npm start
```

## Configuración de Next.js

### next.config.ts

```typescript
const nextConfig = {
  output: 'export', // Exportación estática para CSR
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true // Necesario para export estático
  }
};
```

### Tailwind CSS v4

Configuración optimizada con PurgeCSS automático:

```typescript
// tailwind.config.ts
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta personalizada
      }
    }
  }
};
```

## Arquitectura de la Aplicación

### Client-Side Rendering (CSR)

La aplicación utiliza CSR en lugar de SSR por las siguientes razones:

1. Sistema privado detrás de login - No requiere SEO
2. Datos dinámicos por usuario - No se beneficia de pre-renderizado
3. Hosting económico - Archivos estáticos en Vercel (gratis)
4. Interactividad constante - Dashboards en tiempo real

### Routing con HashRouter

```typescript
// src/App.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';

<HashRouter>
  <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/dashboard/admin" element={<AdminDashboard />} />
    <Route path="/dashboard/collaborator" element={<CollaboratorDashboard />} />
  </Routes>
</HashRouter>
```

URLs resultantes:
- Login: `/#/`
- Admin: `/#/dashboard/admin`
- Colaborador: `/#/dashboard/collaborator`

## Gestión de Estado

**Zustand** para estado global (autenticación):
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username, password, role) => Promise<void>;
  logout: () => void;
}
```

**useState** para estado local de componentes (formularios, filtros)

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor con Turbopack
                     # Hot Module Replacement ultra-rápido

# Producción
npm run build        # Compila aplicación optimizada
npm start            # Sirve build de producción

# Utilidades
npm run lint         # Ejecuta ESLint
```

## Usuarios de Prueba

Credenciales pre-configuradas:

**Administrador:**
```
Usuario: admin
Contraseña: admin123
Rol: Administrador
```

**Colaborador:**
```
Usuario: colaborador
Contraseña: colab123
Rol: Empleado
```

## Despliegue en Vercel

1. Conectar repositorio a Vercel
2. Configurar proyecto:
   - Framework Preset: Next.js
   - Root Directory: `frontend-timetrack`
   - Build Command: `npm run build`
   - Output Directory: `out`

3. Variables de entorno:
```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com/api
```

4. Deploy automático en cada push a main

## Troubleshooting

**Error: CORS blocked**
- Verificar que NEXT_PUBLIC_API_URL sea correcta
- Verificar que backend tenga FRONTEND_URL configurado

**Error: No se puede conectar al backend**
```bash
# Verificar que backend esté corriendo
curl http://localhost:4000/health
```

**Error 403 en login**
- Backend en Render puede estar dormido (free tier)
- Esperar 30-60 segundos y reintentar
- O cambiar a backend local

## Licencia

MIT License - Ver LICENSE para más detalles
