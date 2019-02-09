const Express = require('express');
const {AuthorController, Middleware} = require('../controller');

const AuthorRoute = Express.Router();

AuthorRoute.get('/', Middleware.check, AuthorController.index)
  .post('/', Middleware.store, AuthorController.create)
  .get('/list', AuthorController.list)
  .get('/:id', AuthorController.show)
  .put('/:id', Middleware.check, Middleware.store, AuthorController.edit)
  .delete('/:id', AuthorController.destroy);

module.exports = AuthorRoute;
