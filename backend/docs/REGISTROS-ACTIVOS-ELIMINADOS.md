# Vista de Registros Activos y Eliminados - Panel de Administrador

## 📋 Descripción

Sistema completo de gestión de registros de asistencia con soporte para:
- ✅ Visualización de registros activos
- 🗑️ Gestión de registros eliminados (soft delete)
- 🔄 Restauración de registros
- ⚠️ Eliminación permanente
- 🔍 Búsqueda y filtrado avanzado
- 📱 Diseño responsive
- 🌙 Soporte para modo oscuro

## 🚀 Instalación

### 1. Actualizar Base de Datos

Ejecuta el siguiente script SQL en tu base de datos:

```bash
cd backend/scripts
mysql -u tu_usuario -p tu_database < add-soft-delete-to-registros.sql
```

O ejecuta manualmente:

```sql
ALTER TABLE registros 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_registros_deleted_at ON registros(deleted_at);
```

### 2. Reiniciar el Backend

```bash
cd backend
npm run dev
```

El servidor detectará automáticamente los cambios en el modelo y sincronizará con la base de datos.

### 3. Instalar Dependencias del Frontend (si es necesario)

```bash
cd frontend
npm install framer-motion lucide-react sonner
```

### 4. Iniciar el Frontend

```bash
cd frontend
npm run dev
```

## 📦 Nuevos Archivos

### Backend
- ✅ `backend/src/models/registro.model.js` - Actualizado con soporte paranoid
- ✅ `backend/src/controllers/registro.controller.js` - Nuevos controladores agregados
- ✅ `backend/src/routes/registro.routes.js` - Nuevas rutas agregadas
- ✅ `backend/scripts/add-soft-delete-to-registros.sql` - Script de migración

### Frontend
- ✅ `frontend/src/components/admin/ActiveRecordsView.js` - Vista de registros activos
- ✅ `frontend/src/components/admin/DeletedRecordsView.js` - Vista de registros eliminados
- ✅ `frontend/src/api/admin.js` - Nuevos endpoints agregados
- ✅ `frontend/src/pages/AdminDashboard.js` - Actualizado para integrar nuevas vistas

## 🔌 Nuevos Endpoints

### GET `/api/registros/eliminados`
Obtiene todos los registros eliminados (soft deleted).

**Respuesta:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### POST `/api/registros/:id/restaurar`
Restaura un registro eliminado.

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro restaurado exitosamente",
  "data": {...}
}
```

### DELETE `/api/registros/:id/permanente`
Elimina permanentemente un registro (hard delete).

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro eliminado permanentemente",
  "data": { "id": 123 }
}
```

### DELETE `/api/registros/:id`
Elimina un registro (soft delete - ahora con paranoid mode).

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro eliminado exitosamente",
  "data": { "id": 123 }
}
```

## 🎨 Características

### Vista de Registros Activos
- 🔍 Búsqueda por nombre de empleado
- 📅 Filtro por fecha
- 🔄 Ordenamiento múltiple (fecha, nombre)
- 🗑️ Eliminación de registros (soft delete)
- 📊 Visualización de duración de jornada
- 🏷️ Estados visuales (completado, en curso)
- 💬 Visualización de observaciones

### Vista de Registros Eliminados
- ⚠️ Alerta visual de zona de registros eliminados
- 🔍 Búsqueda y filtrado igual que registros activos
- 🔄 Restauración de registros
- ⚠️ Eliminación permanente con confirmación doble
- 📅 Muestra fecha de eliminación
- 🔴 Indicador visual (borde rojo) para registros eliminados

### Características Generales
- 📱 **Responsive**: Funciona perfectamente en móviles, tablets y desktop
- 🌙 **Dark Mode**: Soporte completo para modo oscuro
- ⚡ **Animaciones**: Transiciones suaves con Framer Motion
- 🎯 **UX Intuitiva**: Iconos claros y colores semánticos
- ♿ **Accesible**: Títulos descriptivos en botones
- 🔔 **Notificaciones**: Feedback inmediato con toasts

## 🎯 Uso

### Panel de Administrador

1. **Acceder al panel**: Navega a `/admin` (requiere rol admin o supervisor)

2. **Pestaña "Registros Activos"**:
   - Ver todos los registros activos
   - Buscar por nombre de empleado
   - Filtrar por fecha
   - Ordenar por diferentes criterios
   - Eliminar registros (soft delete)

3. **Pestaña "Eliminados"**:
   - Ver registros eliminados
   - Restaurar registros accidentalmente eliminados
   - Eliminar permanentemente (con doble confirmación)
   - Filtrar y buscar igual que en activos

## 🔒 Seguridad

- ✅ Todas las rutas protegidas con autenticación
- ✅ Solo admin puede eliminar registros
- ✅ Solo admin/supervisor pueden ver registros
- ✅ Soft delete por defecto (seguridad ante errores)
- ✅ Confirmaciones antes de eliminaciones permanentes

## 🐛 Troubleshooting

### Error: "deleted_at column doesn't exist"
**Solución**: Ejecuta el script SQL de migración.

### Error: "Cannot read property 'empleado' of undefined"
**Solución**: Verifica que el backend esté retornando las relaciones (include empleado).

### Registros no aparecen en "Eliminados"
**Solución**: Verifica que el modelo tenga `paranoid: true` y que la columna `deleted_at` exista.

### No se puede restaurar un registro
**Solución**: Verifica que el backend tenga el controlador `restaurarRegistro` y la ruta configurada.

## 📝 Notas Técnicas

### Soft Delete (Paranoid Mode)
El sistema usa el modo "paranoid" de Sequelize, que:
- No elimina físicamente los registros
- Agrega un timestamp en `deleted_at`
- Los registros eliminados no aparecen en queries normales
- Se pueden restaurar con `.restore()`
- Se pueden eliminar permanentemente con `.destroy({ force: true })`

### Timestamps
- `created_at`: Fecha de creación del registro
- `updated_at`: Fecha de última actualización
- `deleted_at`: Fecha de eliminación (NULL si activo)

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en los archivos de componentes:
- **Azul** (blue-500): Registros activos, entradas
- **Rojo** (red-500): Eliminaciones, salidas
- **Verde** (green-500): Restauraciones, completados
- **Amarillo** (yellow-500): En curso, advertencias

### Animaciones
Las animaciones están controladas por Framer Motion y se pueden ajustar en las props `initial`, `animate`, `exit`.

## 📚 Dependencias

- **Backend**:
  - Sequelize (ORM)
  - Express (Server)
  
- **Frontend**:
  - React
  - Framer Motion (Animaciones)
  - Lucide React (Iconos)
  - Sonner (Notificaciones)
  - Tailwind CSS (Estilos)

## 🚀 Próximas Mejoras

- [ ] Exportar registros a CSV/PDF
- [ ] Filtro por departamento
- [ ] Gráficos de estadísticas
- [ ] Paginación para grandes volúmenes
- [ ] Búsqueda avanzada con múltiples criterios
- [ ] Bulk actions (acciones masivas)

## 👨‍💻 Autor

Sistema de Control de Asistencias - TimeTrack

## 📄 Licencia

Este proyecto es privado.
