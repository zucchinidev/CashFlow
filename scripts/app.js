/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp',
      ['ui.router', 'ngCookies', 'ngResource', 'zucStringFilters', 'zucMovementsFilters'])
      .config(configRoutes);


  function configRoutes($stateProvider) {
    $stateProvider
        .state('total', {
          url: '/',
          controller: 'CashController as cash',
          templateUrl: 'total.html'
        })
        .state('new', {
          url: '/new',
          controller: 'CashController as cash',
          templateUrl: 'new.html'
        })
        .state('list', {
          url: '/list',
          controller: 'CashController as cash',
          templateUrl: 'list.html'
        })
        .state('signin', {
          url: '/signin',
          controller: 'RegisterController as register',
          templateUrl: 'signin.html'
        })
        .state('signup', {
          url: '/signup',
          controller: 'RegisterController as register',
          templateUrl: 'signup.html'
        })
        .state('movement', {
          url: '/movement/:id',
          controller: 'MovementController as mv',
          templateUrl: 'movement.html'
        })
        .state('not-found', {
          url: '*path',
          controller: 'CashController as cash',
          templateUrl: 'notfound.html'
        });
  }
})();
