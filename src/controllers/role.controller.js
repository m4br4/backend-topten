const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Obtener todos los roles
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error al obtener roles' });
  }
};

/**
 * Obtener un rol por ID
 */
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    res.json(role);
  } catch (error) {
    console.error('Error al obtener rol:', error);
    res.status(500).json({ message: 'Error al obtener rol' });
  }
};

/**
 * Crear un nuevo rol
 */
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissionIds } = req.body;

    // Verificar si el rol ya existe
    const existingRole = await prisma.role.findUnique({
      where: { name }
    });

    if (existingRole) {
      return res.status(400).json({ message: 'El rol ya existe' });
    }

    // Crear rol con permisos
    const newRole = await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissionIds ? permissionIds.map(id => ({ id })) : []
        }
      },
      include: {
        permissions: true
      }
    });

    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ message: 'Error al crear rol' });
  }
};

/**
 * Actualizar un rol
 */
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissionIds } = req.body;

    // Verificar si el rol existe
    const existingRole = await prisma.role.findUnique({
      where: { id }
    });

    if (!existingRole) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Actualizar rol
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions: {
          set: permissionIds ? permissionIds.map(id => ({ id })) : []
        }
      },
      include: {
        permissions: true
      }
    });

    res.json(updatedRole);
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ message: 'Error al actualizar rol' });
  }
};

/**
 * Eliminar un rol
 */
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el rol existe
    const existingRole = await prisma.role.findUnique({
      where: { id }
    });

    if (!existingRole) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Verificar si hay usuarios con este rol
    const usersWithRole = await prisma.user.count({
      where: { roleId: id }
    });

    if (usersWithRole > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el rol porque hay usuarios asociados a él',
        count: usersWithRole
      });
    }

    // Eliminar rol
    await prisma.role.delete({
      where: { id }
    });

    res.json({ message: 'Rol eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ message: 'Error al eliminar rol' });
  }
};