const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken, hasRole } = require('../middlewares/auth.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas para administradores
router.get('/', hasRole(['admin']), userController.getAllUsers);
router.post('/', hasRole(['admin']), userController.createUser);
router.delete('/:id', hasRole(['admin']), userController.deleteUser);

// Rutas para usuarios y administradores
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.put('/:id/change-password', userController.changePassword);

module.exports = router;