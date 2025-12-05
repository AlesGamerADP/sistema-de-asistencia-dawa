# Usuarios de Prueba Local

Este documento contiene las credenciales de los usuarios de prueba que funcionan cuando el backend no está disponible o en modo desarrollo local.

## Usuario Colaborador

- **Usuario:** `colaborador`
- **Contraseña:** `colab123`
- **Rol:** Colaborador (empleado)

## Usuario Administrador

- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Rol:** Administrador

## Notas

- Estos usuarios solo funcionan en modo desarrollo (localhost)
- Si el backend está disponible, se usará la autenticación real del backend
- Si el backend no está disponible, automáticamente se usarán estos usuarios mock
- Los usuarios mock se marcan con `isMockUser: true` en localStorage

