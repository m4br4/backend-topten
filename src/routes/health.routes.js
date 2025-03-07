const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

/**
 * @route GET /api/health
 * @desc Verificar el estado del sistema
 * @access Public
 */
router.get('/', healthController.checkHealth);

module.exports = router;