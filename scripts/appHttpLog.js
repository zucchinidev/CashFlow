/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp')
      .config(configuratorInterceptors);

  /*
  * Existe una ventaja al usar el servicio $log. Como todos los servicios, son configurables
  * de tal forma que podemos hacer que en el entorno de producción, todas las llamadas a métodos
  * de $log, se desactiven o solo las llamadas al método info y dejar las de error.
  * O por ejemplo, en caso de que se ejecute $log.error, mandar un log al servidor y almacenarlo.
  */


  /**
   * Agrupación de los interceptores
   * @param {{}} $httpProvider
   */
  function configuratorInterceptors($httpProvider) {
    $httpProvider.interceptors.push(httpLogInterceptors);
  }

  /**
   * @param {{}} $log
   * @return {{}}
   */
  function httpLogInterceptors($log) {
    var interceptor = {};

    interceptor.request = function(request) {
      $log.info('Request: ' + request.url);
      return request;
    };

    interceptor.responseError = function(response) {
      $log.error('Exception: ' + response.status + ' - ' + response.config.url);
    };
    return interceptor;
  }
})();
