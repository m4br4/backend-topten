const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * Registrar un nuevo usuario
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, roleId } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Verificar si el rol existe
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return res.status(400).json({ message: 'El rol especificado no existe' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        roleId
      }
    });

    // Eliminar la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

/**
 * Iniciar sesión
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(401).json({ message: 'Usuario desactivado' });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role.name
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Expira en 1 día

    // Guardar sesión en la base de datos
    await prisma.session.create({
      data: {
        token,
        expiresAt,
        userId: user.id
      }
    });

    // Eliminar la contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

/**
 * Cerrar sesión
 */
exports.logout = async (req, res) => {
  try {
    const { token } = req.body;

    // Eliminar la sesión de la base de datos
    await prisma.session.deleteMany({
      where: { token }
    });

    res.json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

/**
 * Obtener información del usuario actual
 */
exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Eliminar la contraseña de la respuesta
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error al obtener información del usuario:', error);
    res.status(500).json({ message: 'Error al obtener información del usuario' });
  }
};