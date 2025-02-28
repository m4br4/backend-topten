const express = require('express');
const permissionController = require('../controllers/permission.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas para administradores
router.get('/', hasRole(['admin']), permissionController.getAllPermissions);
router.get('/:id', hasRole(['admin']), permissionController.getPermissionById);
router.post('/', hasRole(['admin']), permissionController.createPermission);
router.put('/:id', hasRole(['admin']), permissionController.updatePermission);
router.delete('/:id', hasRole(['admin']), permissionController.deletePermission);

module.exports = router;