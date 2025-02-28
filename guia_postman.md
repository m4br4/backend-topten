# Guía para probar las APIs con Postman

Esta guía te ayudará a probar todas las APIs del backend utilizando Postman.

## Configuración inicial

1. **Instala Postman**: Si aún no lo tienes, descarga e instala [Postman](https://www.postman.com/downloads/).

2. **Importa la colección**: 
   - Abre Postman
   - Haz clic en "Import" (botón en la esquina superior izquierda)
   - Selecciona el archivo `postman_collection.json` incluido en este proyecto
   - Confirma la importación

3. **Crea un entorno**:
   - Haz clic en el icono de engranaje (⚙️) en la esquina superior derecha
   - Selecciona "Add" para crear un nuevo entorno
   - Nombra el entorno (por ejemplo, "Backend Local")
   - Agrega las siguientes variables:
     - `baseUrl`: http://localhost:3000
     - `authToken`: (déjalo vacío por ahora)
     - `userId`: (déjalo vacío por ahora)
     - `roleId`: (déjalo vacío por ahora)
     - `permissionId`: (déjalo vacío por ahora)
   - Guarda el entorno
   - Asegúrate de seleccionar este entorno en el desplegable de la esquina superior derecha

## Flujo de prueba recomendado

### 1. Iniciar el servidor

Antes de comenzar las pruebas, asegúrate de que:
- La base de datos PostgreSQL esté funcionando (`docker-compose up -d`)
- El servidor esté en ejecución (`npm run dev`)

### 2. Autenticación

#### Iniciar sesión como administrador

1. Abre la carpeta "Auth" en la colección
2. Selecciona la petición "Login"
3. El cuerpo de la petición ya debe contener:
   ```json
   {
       "email": "admin@example.com",
       "password": "admin123"
   }
   ```
4. Haz clic en "Send"
5. Deberías recibir una respuesta exitosa con un token JWT
6. El token se guardará automáticamente en la variable `authToken` del entorno
7. El ID del usuario se guardará automáticamente en la variable `userId` del entorno

#### Verificar la autenticación

1. Selecciona la petición "Me" en la carpeta "Auth"
2. Haz clic en "Send"
3. Deberías recibir información sobre el usuario administrador

### 3. Obtener roles y permisos

#### Obtener roles

1. Abre la carpeta "Roles" en la colección
2. Selecciona la petición "Get All Roles"
3. Haz clic en "Send"
4. Deberías recibir una lista de roles
5. El ID del primer rol se guardará automáticamente en la variable `roleId` del entorno

#### Obtener permisos

1. Abre la carpeta "Permissions" en la colección
2. Selecciona la petición "Get All Permissions"
3. Haz clic en "Send"
4. Deberías recibir una lista de permisos
5. El ID del primer permiso se guardará automáticamente en la variable `permissionId` del entorno

### 4. Probar operaciones CRUD

Ahora puedes probar todas las operaciones CRUD en las diferentes entidades:

#### Usuarios

- **Crear usuario**: Usa la petición "Create User" en la carpeta "Users"
- **Obtener usuarios**: Usa la petición "Get All Users" en la carpeta "Users"
- **Obtener usuario por ID**: Usa la petición "Get User by ID" en la carpeta "Users"
- **Actualizar usuario**: Usa la petición "Update User" en la carpeta "Users"
- **Cambiar contraseña**: Usa la petición "Change Password" en la carpeta "Users"
- **Eliminar usuario**: Usa la petición "Delete User" en la carpeta "Users"

#### Roles

- **Crear rol**: Usa la petición "Create Role" en la carpeta "Roles"
- **Actualizar rol**: Usa la petición "Update Role" en la carpeta "Roles"
- **Eliminar rol**: Usa la petición "Delete Role" en la carpeta "Roles"

#### Permisos

- **Crear permiso**: Usa la petición "Create Permission" en la carpeta "Permissions"
- **Actualizar permiso**: Usa la petición "Update Permission" en la carpeta "Permissions"
- **Eliminar permiso**: Usa la petición "Delete Permission" en la carpeta "Permissions"

### 5. Probar con usuario normal

Para probar las restricciones de acceso:

1. Cierra la sesión actual:
   - Selecciona la petición "Logout" en la carpeta "Auth"
   - Haz clic en "Send"

2. Inicia sesión como usuario normal:
   - Selecciona la petición "Login" en la carpeta "Auth"
   - Modifica el cuerpo de la petición:
     ```json
     {
         "email": "user@example.com",
         "password": "user123"
     }
     ```
   - Haz clic en "Send"
   - El nuevo token se guardará automáticamente

3. Intenta acceder a rutas protegidas:
   - Prueba "Get All Users" en la carpeta "Users"
   - Deberías recibir un error 403 (Forbidden)

## Ejemplos de peticiones

### Crear un nuevo usuario

```json
{
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User",
    "roleId": "{{roleId}}",
    "isActive": true
}
```

### Crear un nuevo rol

```json
{
    "name": "editor",
    "description": "Editor con permisos limitados",
    "permissionIds": ["{{permissionId}}"]
}
```

### Crear un nuevo permiso

```json
{
    "name": "content:manage",
    "description": "Permite gestionar contenido"
}
```

## Solución de problemas

### Token expirado

Si recibes un error de token expirado, simplemente vuelve a iniciar sesión para obtener un nuevo token.

### Variables no disponibles

Si las variables como `roleId` o `permissionId` no se están guardando automáticamente:

1. Ejecuta manualmente las peticiones "Get All Roles" y "Get All Permissions"
2. Copia manualmente los IDs de la respuesta
3. Actualiza las variables en tu entorno de Postman

### Error de conexión

Si recibes errores de conexión, verifica que:
- El servidor esté en ejecución
- La URL base sea correcta (http://localhost:3000)
- La base de datos PostgreSQL esté funcionando