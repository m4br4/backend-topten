const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const os = require('os');

/**
 * Controlador para verificar el estado del sistema
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.checkHealth = async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    // Información del sistema
    const systemInfo = {
      uptime: Math.floor(process.uptime()),
      memory: {
        free: os.freemem(),
        total: os.totalmem()
      },
      cpu: os.cpus().length,
      hostname: os.hostname(),
      platform: os.platform(),
      nodeVersion: process.version
    };
    
    // Responder con estado OK y datos del sistema
    res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      system: systemInfo
    });
  } catch (error) {
    console.error('Error en health check:', error);
    
    // Si hay error en la base de datos, reportarlo pero mantener el servicio como parcialmente disponible
    res.status(200).json({
      status: 'DEGRADED',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message,
      system: {
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version
      }
    });
  }
};