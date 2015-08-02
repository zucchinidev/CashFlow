/* global angular */
(function() {
  'use strict';
  angular.module('zucMovementsFilters', [])
      .filter('greaterThan', greaterThan);


  /**
   * Filtro para obtener los movimientos tengan una cantidad mayor que el punto elegido
   * @return {Function|*}
   */
  function greaterThan() {
    var result;
    result = function(movements, pointBreak) {
      if (pointBreak) {
        var items = [];
        angular.forEach(movements, function(movement) {
          if (movement.quantity >= pointBreak) {
            items.push(movement);
          }
        });
        return items;
      }
      return movements;
    };

    return result;
  }

})();
