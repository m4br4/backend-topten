const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Obtener todos los permisos
 */
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ message: 'Error al obtener permisos' });
  }
};

/**
 * Obtener un permiso por ID
 */
exports.getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await prisma.permission.findUnique({
      where: { id }
    });

    if (!permission) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    res.json(permission);
  } catch (error) {
    console.error('Error al obtener permiso:', error);
    res.status(500).json({ message: 'Error al obtener permiso' });
  }
};

/**
 * Crear un nuevo permiso
 */
exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Verificar si el permiso ya existe
    const existingPermission = await prisma.permission.findUnique({
      where: { name }
    });

    if (existingPermission) {
      return res.status(400).json({ message: 'El permiso ya existe' });
    }

    // Crear permiso
    const newPermission = await prisma.permission.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error al crear permiso:', error);
    res.status(500).json({ message: 'Error al crear permiso' });
  }
};

/**
 * Actualizar un permiso
 */
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Verificar si el permiso existe
    const existingPermission = await prisma.permission.findUnique({
      where: { id }
    });

    if (!existingPermission) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    // Actualizar permiso
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        description
      }
    });

    res.json(updatedPermission);
  } catch (error) {
    console.error('Error al actualizar permiso:', error);
    res.status(500).json({ message: 'Error al actualizar permiso' });
  }
};

/**
 * Eliminar un permiso
 */
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el permiso existe
    const existingPermission = await prisma.permission.findUnique({
      where: { id }
    });

    if (!existingPermission) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    // Verificar si hay roles con este permiso
    const rolesWithPermission = await prisma.role.count({
      where: {
        permissions: {
          some: {
            id
          }
        }
      }
    });

    if (rolesWithPermission > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el permiso porque hay roles asociados a él',
        count: rolesWithPermission
      });
    }

    // Eliminar permiso
    await prisma.permission.delete({
      where: { id }
    });

    res.json({ message: 'Permiso eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar permiso:', error);
    res.status(500).json({ message: 'Error al eliminar permiso' });
  }
};