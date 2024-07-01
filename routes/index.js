const express = require('express');

const router = express.Router();

const AppController = require('../controllers/AppController');

// Status endpoint
router.get('/status', AppController.getStatus);

// Stats endpoint
router.get('/stats', AppController.getStats);

module.exports = router;
