'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
  function ($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('articles').factory('Libros', ['$resource',
  function ($resource) {
    return $resource('/api/articles/busqueda/:titulo', {
      titulo: '@_titulo'
    });
  }
]);
