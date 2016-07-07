'use strict';

/**
 * Module dependencies.
 */
var articlesPolicy = require('../policies/articles.server.policy'),
  articles = require('../controllers/articles.server.controller');

module.exports = function (app) {
  // Articles collection routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  // Single article routes.all(articlesPolicy.isAllowed)
  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  // Finish by binding the article middleware
  app.param('articleId', articles.articleByID);

  /*app.route('/api/articles/busqueda/:titulo').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update);*/
  app.route('/api/articles/busqueda/:titulo')
    .get(articles.articlesByTitulo);
  //app.param('titulo', articles.articlesByTitulo);
};
