'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Libros',
      state: 'articles',
      type: 'dropdown'
    });

    // Add the Search item
    Menus.addSubMenuItem('topbar', 'articles',{
      title: 'Buscar libro',
      state: 'articles.busqueda'
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Lista de Libros',
      state: 'articles.list'
    });

    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Mis Libros',
      state: 'articles.mybooks'
    });

    // Add the dropdown create item
    /*Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Crear Libro',
      state: 'articles.create'
    });*/
  }
]);
