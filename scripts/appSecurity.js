/* global angular */
(function() {
  'use strict';
  angular.module('cashFlowApp')
      .config(configuratorInterceptors);
  /*
  * Los interceptadores se configuran en funciones asignadas a config.
  * Las configuraciones afectan a servicios como $http...
  * Cada servicio configurable tiene un provider al que configurar
  * Ahora voy a utilizar $httpProvider
  * La configuración admite distintas funciones interceptoras,
  * usaremos una función para controlar la seguridad
  * Los provider tienen un array llamado interceptors que contendrán funciones
  * Son muy parecidos a los middleware del lado del servidor, en definitiva lo que hacen
  * es añadir una capa más que será atravesada en la petición al servidor o a la vuelta de la petición
  * Usos comunes de las interceptadoras:
  * LOG
  * SEGURIDAD
  * INSTRUMENTACIÓN
  * CACHE
  * Las funciones interceptoras retornan un objecto interceptor.
  * Definiremos unas funciones que se ejecutarán en la petición y en el caso de error
  * NOTA: aunque actualmente utilizamos ngResource, el interceptor que creamos para $http
  * no tenemos que tocarlo porque en realidad, ngResource es un recubrimiento de $http
  */


  /**
   * Configuración de las funciones interceptadoras
   * @param {{$httpProvider}} $httpProvider objecto para configurar el objeto provider.
   */
  function configuratorInterceptors($httpProvider) {
    $httpProvider.interceptors.push(httpInterceptor);
  }

  /**
   * Interceptador del servicio $http
   * Controlará el tema de seguridad
   * Toda la configuración que hagamos sobre $httpProvider afectará al objeto $http
   * @param {{}} $injector permite hacer injecciones de dependencias (permite evitar dependencias circulares)
   * para ésto injectamos de forma manual
   * @param {{}} $q servicio para trabajar con promesas
   * @param {{}} $cookieStore servicio de ángular para almacenar cookies, guardaremos la sessionId para que siempre
   * esté disponible durante la sesión del usuario
   * @param {{}} $rootScope
   */
  function httpInterceptor($injector, $q, $cookieStore, $rootScope) {
    var interceptor = {};
    interceptor.request = function(request) {
      // Envío en la cabecera de cada petición el token de sesión previamente guardado en una cookie
      request.headers.sessionId = $cookieStore.get('sessionId');
      // Si la petición es inmediata, que se haga y si no que se haga cuando tenga que ocurrir.
      return request || $q.when(request);
    };


    /**
     * Función que se ejecuta cada vez que se produce un error en las respuesta
     * @param {{}} response
     * También se pordría definir una función response (sin el error). Se ejecutaría en cada response
     */
    interceptor.responseError = function(response) {
      // NOTA: utilizo $injector porque $state depende de $q, y por lo tanto si injectáramos de forma
      // tradicional, se produciría una dependencia circular
      var state = $injector.get('$state');
      switch (response.status) {
        case 401:
            // Si no tenemos cookie o es inválida redirigir a registro
            $rootScope.message = 'No autorizado!!';
            state.go('signin');
          break;
        case 419:
            // Si la cookie a expirado, borramos la cookie con key sessionId y redirigimos a registro
            $cookieStore.remove('sessionId');
            state.go('signin');
          break;
      }
      // Rechazamos esta petición para que nos enteremos que algo ha ido mal
      return $q.reject(response);
    };

    return interceptor;
  }
})();
