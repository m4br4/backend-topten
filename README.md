# Backend con Node.js, Prisma y PostgreSQL

Este proyecto es un backend completo con sistema de autenticación, gestión de usuarios, roles y permisos utilizando Node.js, Express, Prisma ORM y PostgreSQL.

## Características

- Autenticación completa (registro, login, logout)
- Gestión de usuarios
- Sistema de roles y permisos
- Base de datos PostgreSQL
- ORM Prisma para interactuar con la base de datos
- Docker Compose para facilitar la configuración de PostgreSQL

## Requisitos previos

- Node.js (v14 o superior)
- Docker y Docker Compose
- npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd <nombre-del-directorio>
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno:

Copia el archivo `.env.example` a `.env` y ajusta las variables según tu entorno:

```bash
cp .env.example .env
```

4. Iniciar la base de datos con Docker:

```bash
docker-compose up -d
```

5. Ejecutar migraciones y seed de la base de datos:

```bash
npm run db:setup
```

## Uso

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm run build
npm start
```

## Estructura del proyecto

```
├── docker-compose.yml    # Configuración de Docker para PostgreSQL
├── package.json          # Dependencias y scripts
├── prisma/               # Configuración de Prisma ORM
│   ├── schema.prisma     # Esquema de la base de datos
│   └── seed.js           # Datos iniciales para la base de datos
├── src/                  # Código fuente
│   ├── controllers/      # Controladores
│   ├── middlewares/      # Middlewares
│   ├── routes/           # Rutas de la API
│   └── index.js          # Punto de entrada de la aplicación
└── .env                  # Variables de entorno
```

## API Endpoints

### Autenticación

- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener información del usuario actual

### Usuarios

- `GET /api/users` - Obtener todos los usuarios (admin)
- `GET /api/users/:id` - Obtener un usuario por ID
- `POST /api/users` - Crear un nuevo usuario (admin)
- `PUT /api/users/:id` - Actualizar un usuario
- `PUT /api/users/:id/change-password` - Cambiar contraseña
- `DELETE /api/users/:id` - Eliminar un usuario (admin)

### Roles

- `GET /api/roles` - Obtener todos los roles (admin)
- `GET /api/roles/:id` - Obtener un rol por ID (admin)
- `POST /api/roles` - Crear un nuevo rol (admin)
- `PUT /api/roles/:id` - Actualizar un rol (admin)
- `DELETE /api/roles/:id` - Eliminar un rol (admin)

### Permisos

- `GET /api/permissions` - Obtener todos los permisos (admin)
- `GET /api/permissions/:id` - Obtener un permiso por ID (admin)
- `POST /api/permissions` - Crear un nuevo permiso (admin)
- `PUT /api/permissions/:id` - Actualizar un permiso (admin)
- `DELETE /api/permissions/:id` - Eliminar un permiso (admin)

## Usuarios por defecto

El seed crea dos usuarios por defecto:

1. Administrador:
   - Email: admin@example.com
   - Contraseña: admin123

2. Usuario normal:
   - Email: user@example.com
   - Contraseña: user123

## Pruebas con Postman

Para probar la API con Postman, sigue estos pasos:

1. Importa la colección de Postman incluida en el archivo `postman_collection.json`.

2. Crea un entorno en Postman con las siguientes variables:
   - `baseUrl`: http://localhost:3000
   - `authToken`: (se llenará automáticamente al hacer login)
   - `userId`: (se llenará automáticamente al hacer login)
   - `roleId`: (se llenará automáticamente al obtener roles)
   - `permissionId`: (se llenará automáticamente al obtener permisos)

3. Flujo de prueba recomendado:
   - Inicia sesión con el usuario administrador usando el endpoint `Auth/Login`
   - Obtén la lista de roles con `Roles/Get All Roles` (esto guardará automáticamente un roleId)
   - Obtén la lista de permisos con `Permissions/Get All Permissions` (esto guardará automáticamente un permissionId)
   - Ahora puedes probar el resto de endpoints

4. Para probar con el usuario normal:
   - Cierra sesión con `Auth/Logout`
   - Inicia sesión con el usuario normal (user@example.com/user123)
   - Verifica que no puedes acceder a los endpoints protegidos para administradores

## Licencia

ISC