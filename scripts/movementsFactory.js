/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp')
      .factory('movementsFactory', movementsFactory);

  /**
   * Creación de factoria que controla los movimientos.
   * @param {{}} $resource servicio de Angular para comunicación con el servidor
   * vía XMLHttpRequest o JSONP
   * @return {{movementsFactory}} Factoría de movimientos
   */
  function movementsFactory($resource) {

    /**
     * Objeto que devuelve la factory
     * @type {{}}
     */
    var factory = {};

    /**
     * @type {{Resource}}
     */
    factory.movements = $resource('/api/pri/movements/:id', {
      id: '@id'
    });


    /**
     * @type {{Resource}}
     */
    factory.total = $resource('/api/pri/total');
    // Podría interesar en algunos casos retornar la promesa pero esto implica que del lado del controlador
    // siempre nos veremos obligados a programar con el then
    // factory.total = $resource('/api/pri/total').get().$promise;
    return factory;
  }
}());
