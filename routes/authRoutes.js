const { Router } = require('express');
const authController = require('../controllers/authController');
// import all controllers
// import SessionController from './app/controllers/SessionController';

const routes = new Router();

//routes.get

// Add routes
routes.get('/signup', authController.signup_get);
routes.post('/signup', authController.signup_post);
routes.get('/login', authController.login_get);
routes.post('/login', authController.login_post);


module.exports = routes;
