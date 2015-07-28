/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp')
      .controller('RegisterController', registerController);

  function registerController($http, $rootScope, $state, $cookieStore) {
    var baseUrl = 'http://localhost:3000/api/';
    var vm = this;
    vm.user = {};

    /**
     * Sistema de logueo, atacamos a /api/sessions, manadamos en el body un objeto user.
     */
    vm.signin = function() {
      $http.post(baseUrl + 'sessions/', vm.user)
          .success(function(response) {
            $rootScope.email = vm.user.email;
            $rootScope.message = 'Te logueaste con éxito';
            $cookieStore.put('sessionId', response);
            $state.go('total');
          })
          .error(function() {
            console.log('Error post http signin');
          });
    };



    vm.signup = function() {
      $http.post(baseUrl + 'users/', vm.user)
          .success(function(response) {
            $rootScope.email = vm.user.email;
            $rootScope.message = 'Te has registrado con éxito';
            $cookieStore.put('sessionId', response);
            $state.go('total');
          })
          .error(function(data) {
            console.log(data);
            console.log('Error post http signup');
          });
    };
  }
})();
