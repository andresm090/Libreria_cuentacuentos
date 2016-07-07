'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
const https = require('https');
var request = require('request');
var books = require('google-books-search');

/**
 * Create a article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;
  
  if (req.body.gbook.saleInfo.retailPrice && req.body.gbook.saleInfo.retailPrice.amount) {
    article.precio = req.body.gbook.saleInfo.retailPrice.amount;
  } else if (req.body.gbook.saleInfo.listPrice && req.body.gbook.saleInfo.listPrice.amount) {
    article.precio = req.body.gbook.saleInfo.listPrice.amount;
  }

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function (req, res) {
  var article = req.article;

  article.title = req.body.title;
  article.gusto = req.body.gusto;
  article.no_gusto = req.body.no_gusto;
  article.aburrido = req.body.aburrido;
  article.no_interesa = req.body.no_interesa;
  article.interesa = req.body.interesa;
  article.users = req.body.users;
  //article.content = req.body.content;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
  var article = req.article;

  article.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
  Article.find().sort('-created').populate('user', 'displayName').exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }

  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
};

exports.articlesByTitulo = function (req, res, next) {
  var titulo = req.params.titulo;

  Article.find({title: new RegExp(titulo, "i")}).exec(function (err, articles) {
    if (err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });

    if (articles.length > 0) {
      console.log("devuelvo de local");
      return res.json(articles);
    }

    console.log("no encontre en local");
    books.search(titulo, function(error, results) {
        if ( ! error ) {
          var libros = [];
          for (var i in results) {
            console.log(results[i].title);
            var article = new Article({
              title: results[i].title,
              gbook: results[i]
            });
            if (results[i].saleInfo.retailPrice && results[i].saleInfo.retailPrice.amount) {
              article.precio = results[i].saleInfo.retailPrice.amount;
            } else if (results[i].saleInfo.listPrice && results[i].saleInfo.listPrice.amount) {
              article.precio = results[i].saleInfo.listPrice.amount;
            }
            libros.push(article);
          }
          return res.json(libros);
        }else {
          console.log("ERROR");
          return res.status(404).send({
            message: 'No se encuentra un libro con ese titulo'
          });
        }
    });
  });
};
