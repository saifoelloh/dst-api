const Express = require('express');
const {Middleware} = require('../controller');

const AuthRoute = Express.Router();

AuthRoute.post('/login', Middleware.login);

module.exports = AuthRoute;
