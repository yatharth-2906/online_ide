const express = require('express');
const { handleGetHome, handleHealth } = require('../CONTROLLERS/home');

const homeRouter = express.Router();

homeRouter.route('/')
.get(handleGetHome);

homeRouter.route('/health')
.get(handleHealth);

module.exports = homeRouter;