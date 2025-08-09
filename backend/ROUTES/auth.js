const express = require('express');
const { handleUserSignup, handleUserLogin, handleUserLogout, handleLoginValidation } = require('../CONTROLLERS/auth');

const authRouter = express.Router();

authRouter.route('/signup')
.post(handleUserSignup);

authRouter.route('/login')
.post(handleUserLogin);

authRouter.route('/logout')
.post(handleUserLogout);

authRouter.route('/validate_token')
.post(handleLoginValidation);

module.exports = authRouter;