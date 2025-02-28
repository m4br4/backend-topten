const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando seed...');

    // Crear permisos básicos
    const permissions = await Promise.all([
      prisma.permission.upsert({
        where: { name: 'user:read' },
        update: {},
        create: {
          name: 'user:read',
          description: 'Permite ver usuarios'
        }
      }),
      prisma.permission.upsert({
        where: { name: 'user:create' },
        update: {},
        create: {
          name: 'user:create',
          description: 'Permite crear usuarios'
        }
      }),
      prisma.permission.upsert({
        where: { name: 'user:update' },
        update: {},
        create: {
          name: 'user:update',
          description: 'Permite actualizar usuarios'
        }
      }),
      prisma.permission.upsert({
        where: { name: 'user:delete' },
        update: {},
        create: {
          name: 'user:delete',
          description: 'Permite eliminar usuarios'
        }
      }),
      prisma.permission.upsert({
        where: { name: 'role:manage' },
        update: {},
        create: {
          name: 'role:manage',
          description: 'Permite gestionar roles'
        }
      }),
      prisma.permission.upsert({
        where: { name: 'permission:manage' },
        update: {},
        create: {
          name: 'permission:manage',
          description: 'Permite gestionar permisos'
        }
      })
    ]);

    console.log('Permisos creados:', permissions.length);

    // Crear roles
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {
        permissions: {
          connect: permissions.map(p => ({ id: p.id }))
        }
      },
      create: {
        name: 'admin',
        description: 'Administrador con acceso completo',
        permissions: {
          connect: permissions.map(p => ({ id: p.id }))
        }
      }
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {
        permissions: {
          connect: [
            { name: 'user:read' }
          ]
        }
      },
      create: {
        name: 'user',
        description: 'Usuario estándar',
        permissions: {
          connect: [
            { name: 'user:read' }
          ]
        }
      }
    });

    console.log('Roles creados:', [adminRole.name, userRole.name]);

    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password: adminPassword
      },
      create: {
        email: 'admin@example.com',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        roleId: adminRole.id
      }
    });

    // Crear usuario normal
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {
        password: userPassword
      },
      create: {
        email: 'user@example.com',
        password: userPassword,
        firstName: 'Normal',
        lastName: 'User',
        roleId: userRole.id
      }
    });

    console.log('Usuarios creados:', [admin.email, user.email]);
    console.log('Seed completado exitosamente');
  } catch (error) {
    console.error('Error durante el seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();