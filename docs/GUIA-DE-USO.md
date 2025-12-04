# Guía de Uso — TimeTrack

Esta guía explica cómo usar la aplicación como Colaborador (empleado) y como Administrador/Supervisor. Incluye flujos habituales, justificaciones, estados del día, y solución de problemas.

- Frontend (desarrollo): http://localhost:3000
- Backend (salud): http://localhost:4000

Si necesitas instalación y variables de entorno, consulta el README principal del proyecto.

---

## 1) Acceso y autenticación

1. Abre el frontend en tu navegador: `http://localhost:3000`.
2. Selecciona tu rol en el conmutador (Colaborador / Administrador).
3. Ingresa tu usuario y contraseña. Tras iniciar sesión:
   - Se guarda un token (JWT) en tu navegador.
   - La sesión expira en ~24 horas; después, inicia sesión otra vez.
4. Si intentas entrar a un panel sin estar autenticado, verás “Debes iniciar sesión” y serás redirigido al login.

Notas:
- Si el login falla siempre, verifica que la contraseña guardada en BD sea el hash bcrypt correspondiente (ver README sobre generación de hashes).

---

## 2) Uso como Colaborador (Empleado)

Al iniciar sesión como Colaborador, accedes al “Panel de Asistencia”. Verás:
- Encabezado con tu nombre y departamento.
- Reloj en vivo con la hora actual.
- Botones “Marcar Entrada” y “Marcar Salida”.
- Resumen del día (hora de entrada/salida si ya existen).
- Historial de los últimos 5 días.
- Observaciones del día (si existen), p. ej. justificaciones.

### 2.1 Marcar Entrada
- Pulsa “Marcar Entrada” al llegar.
- Si tienes más de 15 minutos de retraso respecto a tu horario configurado, aparece un diálogo de “Llegada tarde” para justificar.
  - Escribe una justificación breve (ej. “Tráfico”) y confirma.
- Si ya marcaste entrada hoy, el botón de entrada estará deshabilitado.

### 2.2 Marcar Salida
- Pulsa “Marcar Salida” al terminar tu jornada.
- Casos especiales:
  - Si NO marcaste entrada hoy: aparece un diálogo para registrar el incidente “Salida sin entrada”. Escribe el motivo y confirma.
  - Si te vas antes del horario de salida por más de 15 minutos: aparece un diálogo de “Salida anticipada” para justificar.
- Si ya completaste tu jornada (entrada y salida), el botón de salida estará deshabilitado.

### 2.3 Diálogos de justificación
- Llegada tarde (> 15 min tras la hora de entrada):
  - Debes aportar justificación. La observación queda registrada en el día.
- Salida anticipada (> 15 min antes de la hora de salida):
  - Debes aportar justificación. La observación se añade al registro.
- Salida sin entrada (incidente):
  - Se crea un registro con salida y observación de incidente.

### 2.4 Historial y Observaciones
- El historial muestra tus últimos 5 días con horas de entrada/salida.
- Si hubo justificaciones o incidentes, se listan en “Observaciones”.

### 2.5 Cerrar Sesión
- Haz clic en el icono de salida en la esquina superior derecha.
- La sesión se borra y vuelves al login.

---

## 3) Uso como Administrador/Supervisor

Al iniciar como Administrador o Supervisor, accedes al panel de administración (secciones pueden variar según rol y versión):

- Registros de asistencia:
  - Visualiza registros, filtra por fechas o empleado (según UI disponible), revisa detalles.
  - Consulta registros eliminados (papelera) y, si tu rol lo permite, restaura.
- Empleados:
  - Lista empleados, su departamento, horario y estado.
  - Crea/edita empleados y define su horario (hora_entrada/hora_salida) para que los cálculos de retrasos/anticipos sean coherentes.
- Departamentos:
  - Crea/edita/elimina departamentos para organizar la estructura.
- Resúmenes/estadísticas:
  - Algunas vistas muestran horas trabajadas, totales y KPIs.

Notas de permisos:
- “Admin” puede realizar acciones avanzadas (restauraciones, eliminaciones permanentes, etc.).
- “Supervisor” tiene permisos intermedios, generalmente de consulta y gestión no destructiva.

---

## 4) Estados del día y reglas

- Estados posibles del día para el Colaborador:
  - `fuera`: no hay registro de hoy.
  - `dentro`: marcaste entrada, pero aún no salida.
  - `completo`: ya registraste entrada y salida.

- Reglas operativas básicas:
  - Un único registro por día y empleado.
  - No puedes marcar dos entradas o dos salidas el mismo día.
  - Los diálogos de justificación se activan desde la UI al superar ±15 minutos respecto al horario configurado.
  - El backend valida el flujo (no permite completar dos veces la jornada) y guarda las observaciones.

---

## 5) Notificaciones y mensajes

- La app muestra notificaciones emergentes (toasts) al completar acciones o cuando ocurren errores.
- Ejemplos:
  - “Entrada registrada correctamente” / “Salida registrada correctamente”.
  - “Error al marcar entrada/salida” con detalle si es posible.

---

## 6) Solución de problemas rápida

- No puedo “Marcar Entrada”:
  - Verifica si ya estás “dentro” o si tu jornada aparece como “completo”.
- No puedo “Marcar Salida”:
  - Puede que tu jornada ya esté completa o que necesites justificar salida anticipada.
- Me pide login otra vez:
  - El token expiró; inicia sesión de nuevo.
- El horario no coincide:
  - Solicita a un administrador que revise tu horario (hora_entrada/hora_salida) en tu ficha de empleado.
- CORS o conexión fallida en desarrollo:
  - Backend en `http://localhost:4000`, frontend en `http://localhost:3000`.
  - Ajusta `FRONTEND_URL` en `backend/.env` si es necesario.

---

## 7) Privacidad y seguridad

- Tu token (JWT) se guarda en el navegador para mantener la sesión.
- Cierra sesión en dispositivos compartidos.
- En producción, usa HTTPS y configura dominios permitidos en CORS.

---

## 8) Glosario visual (iconos comunes)

- Entrar: ícono “LogIn”.
- Salir: ícono “LogOut”.
- Usuario: “UserCircle”.
- Departamento: “Building2”.
- Puesto/Trabajo: “Briefcase”.
- Calendario/Horario: “Calendar”.
- Alertas/Observaciones: “AlertCircle”.

---

## 9) Primeros pasos para Administradores (opcional)

1. Crear Departamentos (p. ej., RR.HH., Ventas, IT).
2. Crear Empleados y asignarlos a un departamento.
3. Definir horario (hora_entrada / hora_salida) por empleado.
4. Crear Usuarios del sistema y vincularlos a empleados (para el rol “empleado”).
5. Probar el flujo completo: login (empleado) → marcar entrada → marcar salida.

---

## 10) Documentación relacionada

- Guía técnica de instalación y entorno: `../README.md` (raíz del proyecto).
- Endpoints de la API con ejemplos: `./API-ENDPOINTS.md`.
