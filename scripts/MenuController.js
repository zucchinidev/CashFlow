/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp').
      controller('MenuController', menuController);

  function menuController($state, $scope) {
    var vm = this;
    var sectionMessages = {
      'total': 'Sección de totales de los movimientos acumulados',
      'new': 'Inserta un nuevo movimiento',
      'list': 'Listado de movimientos acumulados',
      'not-found': 'Upps parece que el recurso solicitado no existe',
      'signin': 'Logueate para entrar a ver tus movimientos',
      'movement': 'Consultando movimientos...'
    };
    vm.section = '';

    /**
     * Método para determinar si la ruta que pasamos coincide con la actual
     * @param {string} state
     * @return {boolean}
     */
    //vm.isActive = function(state) {
    //  return $state.is(state);
    //};

    vm.setSection = function(state) {
      vm.section = sectionMessages[state];
    };

    /**
     * Evento que se lanza cada vez que cambiamos de estado de forma satisfactoria
     */
    $scope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {
          if (toState) {
            vm.setSection(toState.name);
          } else {
            throw new ExceptionHandler('Estado de la aplicación incorrecto');
          }
        });
  }

  function ExceptionHandler(message) {
    throw new Error(message);
  }
}());
