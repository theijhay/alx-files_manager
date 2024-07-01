const express = require('express');

const router = express.Router();

const AppController = require('../controllers/AppController');

const UsersController = require('../controllers/UsersController')

// Status endpoint
router.get('/status', AppController.getStatus);

// Stats endpoint
router.get('/stats', AppController.getStats);

//User Creation Endpoint
router.post('/users', UsersController.postNew);

module.exports = router;
