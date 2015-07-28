/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp')
      .controller('MovementController', movementController);

  /**
   * @param {{}} movementsFactory
   * @param {{}} $stateParams es un servicio de ui-router
   */
  function movementController(movementsFactory, $stateParams) {
    var vm = this;
    var id = $stateParams.id;
    vm.movement = movementsFactory.movements.get({id: id});
  }
})();
