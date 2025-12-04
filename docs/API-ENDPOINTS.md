# API TimeTrack — Endpoints Detallados

Base URL por defecto: `http://localhost:4000/api`

Autenticación: usar header `Authorization: Bearer <JWT>` en las rutas protegidas.

---

## Autenticación (Usuarios)

### POST /usuarios/login
Inicia sesión y devuelve token JWT y datos del usuario.

Body:
```json
{
  "username": "admin",
  "contraseña": "admin123",
  "role": "admin" // opcional; valida el rol que quieres usar
}
```

Respuesta 200:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": { "id": 1, "username": "admin", "rol": "admin", "empleado": null },
    "token": "<jwt>"
  }
}
```

Notas:
- La contraseña en BD debe estar hasheada con bcrypt.
- Roles válidos: `admin`, `supervisor`, `empleado`.

### POST /usuarios/logout
Cierra sesión (no invalida JWT en servidor, limpia cliente).

### GET /usuarios/verify
Verifica si el token es válido y retorna datos del usuario.

Headers:
```
Authorization: Bearer <jwt>
```

---

## Registros — Flujos de Colaborador (Protegido)

Todas requieren `Authorization: Bearer <jwt>`.

### POST /registros/marcar
Marca entrada o salida automáticamente según el estado del día.

Body opcional:
```json
{ "observaciones": "Texto libre" }
```

Respuestas:
- 201 (entrada): `{ success: true, type: "entrada", data: { ... } }`
- 200 (salida): `{ success: true, type: "salida", data: { ... } }`
- 409 si ya marcaste entrada y salida hoy.

### GET /registros/mi-estado
Devuelve el estado de marcación del día.

Respuesta:
```json
{ "success": true, "status": "fuera|dentro|completo", "data": { ...? } }
```

### GET /registros/mi-historial?limit=30
Devuelve el historial del colaborador autenticado.

### POST /registros/entrada-justificada
Para llegadas tarde. Crea registro de entrada con observación.

Body:
```json
{ "justificacion": "Retraso por tráfico" }
```

Errores: 400 si falta justificación; 409 si ya existe registro hoy.

### POST /registros/salida-justificada
Para salidas anticipadas. Actualiza salida y añade observación.

Body:
```json
{ "justificacion": "Salida por cita médica" }
```

Errores: 404 si no existe entrada hoy; 409 si ya había salida.

### POST /registros/salida-incidente
Registra salida sin entrada (incidencia).

Body:
```json
{ "motivo": "Olvidé marcar entrada" }
```

Errores: 409 si ya existe registro hoy.

---

## Registros — Administración (Protegido: admin/supervisor)

Headers: `Authorization: Bearer <jwt>` con rol permitido.

### GET /registros
Lista registros con filtros opcionales.

Query:
```
fecha=YYYY-MM-DD
empleado_id=number
limit=100
```

### GET /registros/rango
Registros en un rango de fechas.

Query (requerido):
```
fecha_inicio=YYYY-MM-DD
fecha_fin=YYYY-MM-DD
empleado_id=number (opcional)
```

### GET /registros/eliminados
Lista registros con soft delete (papelera).

### GET /registros/:id
Obtener un registro.

### POST /registros
Crear un registro completo (entrada/salida manual).

Body mínimo:
```json
{
  "empleado_id": 10,
  "fecha": "2025-11-05",
  "hora_entrada": "09:05:00",
  "hora_salida": "18:00:00",
  "observaciones": "Carga manual"
}
```

### PUT /registros/:id
Actualizar campos de un registro.

### DELETE /registros/:id
Soft delete (papelera).

### POST /registros/:id/restaurar
Restaura de la papelera (admin).

### DELETE /registros/:id/permanente
Elimina definitivamente (admin).

---

## Empleados

### GET /empleados
Listar empleados. Filtros opcionales:
```
estado=activo|inactivo
departamento_id=number
```

### GET /empleados/departamento/:departamentoId
Lista empleados de un departamento.

### GET /empleados/:id
Obtener empleado por ID.

### POST /empleados
Crear empleado.

### PUT /empleados/:id
Actualizar empleado.

### DELETE /empleados/:id
Soft delete / desactivar.

---

## Usuarios

### GET /usuarios
Listar usuarios (sin contraseñas) con sus empleados y departamentos.

### GET /usuarios/:id
Obtener usuario.

### GET /usuarios/rol/:rol
Listar por rol (`admin|supervisor|empleado`).

### POST /usuarios
Crear usuario. Nota: el controlador actual NO hashea la contraseña; guarda el hash ya generado.

Body mínimo:
```json
{
  "username": "nuevo",
  "contraseña": "$2b$10$...hash...",
  "rol": "empleado",
  "empleado_id": 10
}
```

### PUT /usuarios/:id
Actualizar usuario.

### DELETE /usuarios/:id
Eliminar usuario.

---

## Departamentos

### GET /departamentos
Listar departamentos.

### GET /departamentos/:id
Obtener departamento.

### POST /departamentos
Crear departamento.

### PUT /departamentos/:id
Actualizar departamento.

### DELETE /departamentos/:id
Eliminar departamento.

---

## Errores y convenciones

Formato general de error:
```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [ { "field": "campo", "message": "detalle" } ]
}
```

Códigos comunes:
- 400: Validación
- 401: No autorizado / token inválido
- 403: Prohibido (rol sin permisos)
- 404: No encontrado
- 409: Conflicto (duplicados o estado incompatible)
- 500: Error interno

---

## Autorización por roles (resumen)

- Empleado: puede usar rutas `/registros/*` de colaborador y consultar su historial/estado.
- Supervisor/Admin: pueden listar y gestionar registros; Admin gestiona restauraciones y borrados permanentes.

---

Para más detalles de implementación, revisa:
- `backend/src/middlewares/auth.middleware.js`
- `backend/src/controllers/registro.controller.js`
- `backend/src/controllers/usuario.controller.js`
