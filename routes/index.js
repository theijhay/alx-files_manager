const express = require('express');

const router = express.Router();

const AppController = require('../controllers/AppController');

const UsersController = require('../controllers/UsersController');

const AuthController = require('../controllers/AuthController');

// Status endpoint
router.get('/status', AppController.getStatus);

// Stats endpoint
router.get('/stats', AppController.getStats);

// User Creation Endpoint
router.post('/users', UsersController.postNew);

// User Connection Endpoint
router.get('/connect', AuthController.getConnect);

// User disconnection Endpoint
router.get('/disconnect', AuthController.getDisconnect);

// User users Endpoint
router.get('/users/me', UsersController.getMe);

module.exports = router;
