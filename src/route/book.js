const Express = require('express');
const {BookController, Middleware} = require('../controller');

const BookRoute = Express.Router();

BookRoute.get('/', BookController.index)
  .post('/', Middleware.check, Middleware.store, BookController.create)
  .get('/:id', BookController.show)
  .put('/:id', Middleware.check, Middleware.store, BookController.edit)
  .delete('/:id', Middleware.check, BookController.destroy);

module.exports = BookRoute;
