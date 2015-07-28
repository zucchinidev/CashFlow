/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp')
      .factory('categoriesFactory', categoriesFactory);

  /**
   *
   * @param {{}} $resource
   * @return {*} resource es una factoría que retorna un objeto
   */
  function categoriesFactory($resource) {
    return $resource('/api/pub/categories', {}, {get: {cache: true}});
  }
})();
