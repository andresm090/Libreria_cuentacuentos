'use strict';

// Articles controller
var app = angular.module('articles').controller('ArticlesController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Articles', 'Libros',
  function ($scope, $http, $stateParams, $location, Authentication, Articles, Libros) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function () {
      // Create new Article object
      var article = new Articles({
        isbn: this.isbn,
        title: this.title,
        precio: this.precio
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('libros/' + response._id);

        // Clear form fields
        $scope.isbn = '';
        $scope.title = '';
        $scope.precio = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('libros');
        });
      }
    };

    // Update existing Article
    $scope.update = function () {
      var article = $scope.article;

      article.$update(function () {
        $location.path('libros/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    //Funcion para actualizar la calificacion
    /*$scope.calificar = function(article, attr){
      article[attr] = article[attr] + 1;
      article.$update(function () {
        //$location.path('libros/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }*/

    //Funcion para actualizar la calificacion
    $scope.calificar = function(article, attr, user){
      article[attr] = article[attr] + 1;
      var u = [];
      for (var i in article.users){
        u.push(article.users[i]);
      }
      u.push(user._id);
      article.users = u;
      article.$update(function () {
        $scope.success = true;
          //$location.path('libros/' + article._id);
      }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };

    // Create new Article
    $scope.createLibro = function (article, attr, user) {
      if ((article.gusto == 0) && (article.no_gusto == 0) && (article.aburrido == 0) && (article.interesa==0) && (article.no_interesa ==0)){
        article[attr] = article[attr] + 1;
        var art = new Articles({
          title: article.title,
          gbook: article.gbook,
          gusto: article.gusto,
          no_gusto: article.no_gusto,
          aburrido: article.aburrido,
          no_interesa: article.no_interesa,
          interesa: article.interesa
        });
        art.users = [user._id];
        art.$save(function (response) {
          $scope.success = true;
          $location.path('libros/busqueda');
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
      } else {
        article[attr] = article[attr] + 1;
        var u = [];
        for (var i in article.users){
          u.push(article.users[i]);
        }
        u.push(user._id);
        var art = new Articles({
          _id: article._id,
          title: article.title,
          gbook: article.gbook,
          gusto: article.gusto,
          no_gusto: article.no_gusto,
          aburrido: article.aburrido,
          no_interesa: article.no_interesa,
          interesa: article.interesa
        });
        art.users = u;
        art.$update(function () {
          $location.path('libros/busqueda');
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }
    };

    $scope.verificarUsuario = function(users, user){
        for (var i in users){
          if (users[i] == user._id){
            return true;
          }
        }
        return false;
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find a list of Articles
    $scope.findBooksUser = function (user) {
      //var libros = Articles.query();
      var aux = Articles.query().$promise.then(function(data) {
        var mislibros = [];
        for (var i in data) {
          for (var j in data[i].users){
            if (data[i].users[j] == user._id){
              mislibros.push(data[i]);
            }
          }
        }
        $scope.articles = mislibros;
      });
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };

    $scope.buscarPorTitulo = function () {
      $scope.buscando = true;
      $scope.articles = Libros.query({
        titulo: $scope.titulo
      });
      $scope.buscando = false;
    };
  }
]);
