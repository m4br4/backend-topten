const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware para verificar el token JWT
 */
exports.verifyToken = async (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si la sesión existe en la base de datos
    const session = await prisma.session.findUnique({
      where: { token }
    });

    if (!session) {
      return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }

    // Verificar si la sesión ha expirado
    if (new Date() > new Date(session.expiresAt)) {
      // Eliminar la sesión expirada
      await prisma.session.delete({
        where: { id: session.id }
      });
      return res.status(401).json({ message: 'Sesión expirada' });
    }

    // Agregar información del usuario al objeto de solicitud
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    console.error('Error en la autenticación:', error);
    res.status(500).json({ message: 'Error en la autenticación' });
  }
};

/**
 * Middleware para verificar roles
 */
exports.hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const userRole = req.user.role;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'No tiene permiso para acceder a este recurso',
        requiredRoles: roles,
        userRole
      });
    }

    next();
  };
};