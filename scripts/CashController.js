/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp')
      .controller('CashController', cashController);

  /**
   * Controlador cash
   * @param {{angular.factory}} movementsFactory factorías que meneja los movimientos
   * @param {{angular.factory}} categoriesFactory factoría que maneja las categorías
   * de la factoría de movimientos
   */
  function cashController(movementsFactory, categoriesFactory) {
    // El viewmodel o vm es la propia función
    var vm;
    vm = this;

    vm.total = {
      income: 0,
      expenses: 0
    };


    /**
     * Obtener las categorías, get no retorna un objeto categories si no que retorna
     * algo vitaminado, retorna una promesa con sus propios métodos.
     * Retorna algo asíncrono y por lo tanto si lo que viene tras la llamada
     * no depende del resutado de las categorías, podremos realizar la llamada en una
     * sola línea y sin tener en cuenta el then(function).
     * OJO OJO: si retorna un objeto, hay que utilizar get si por algún motivo
     * retornara un array, hay que utilizar query()
     */
    vm.categories = categoriesFactory.get();


    /**
     * Obtener los movimientos a partir de la factoría.
     * NOTA: cuando esperamos un array hay que utilizar el método query, y luego
     * resource hace una get de manera interna
     * Retorna una HttpPromise
     */
    vm.movements = movementsFactory.movements.query();


    /**
     * Montamos la estructura a partir de la promesa,
     * este objeto, sigue un patrón llamado Active Record, objeto que no solo tiene
     * datos si no que también tienen métodos para poder saber leer y guardar esos datos.
     * A estos objetos no les importa las propiedades que puedan tener, pero si les importa
     * que métodos y eventos tienen, hay un método que se llama $save que hace un http.post()
     * y manda el propio objeto con todos sus datos.
     */
    vm.newMovement = new movementsFactory.movements();
    vm.newMovement.entry = 1;
    vm.newMovement.date = new Date();
    vm.newMovement.quantity = 0;

    /**
     * Obtener el total a partir de la factoría
     */
    vm.total = movementsFactory.total.get();

    /**
     * Método que salva el movimiento, lo hace en base a una promesa
     * y lo inserta en movements.
     * $save hace un post y en la request manda el propio objeto
     */
    vm.saveMovement = function() {
      vm.newMovement.type = vm.type();
      vm.newMovement.$save()
          .then(processingMovement);
    };

    /**
     * Método para obtener el balance de mis movimientos
     * @return {number} ingresos menos gastos
     */
    vm.balance = function() {
      return vm.total.income - vm.total.expenses;
    };

    /**
     * Obtener el tipo de movimiento realizado en formato string
     * @return {string}
     */
    vm.type = function() {
      return vm.newMovement.entry && 'Ingreso' || 'Gasto';
    };


    /**
     * Función para tratar el resultado del servidor al guardar un moviento
     * @param {{}} result
     */
    function processingMovement(result) {
      // Cuando ha terminado el guardado del movimiento es el momento de actualizar datos
      vm.movements = movementsFactory.movements.query();
      vm.total = movementsFactory.total.get();
      vm.newMovement.cuantity = 0;
      vm.newMovement.entry = 1;
      vm.newMovement.date = new Date();
    }
  }
})();
