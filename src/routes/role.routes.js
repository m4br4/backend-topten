const express = require('express');
const roleController = require('../controllers/role.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas para administradores
router.get('/', hasRole(['admin']), roleController.getAllRoles);
router.get('/:id', hasRole(['admin']), roleController.getRoleById);
router.post('/', hasRole(['admin']), roleController.createRole);
router.put('/:id', hasRole(['admin']), roleController.updateRole);
router.delete('/:id', hasRole(['admin']), roleController.deleteRole);

module.exports = router;