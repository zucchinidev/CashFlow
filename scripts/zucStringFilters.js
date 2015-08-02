/* global angular */
(function() {
  'use strict';
  angular.module('zucStringFilters', [])
      .filter('clean', clean)
      .filter('fillEmpty', fillEmpty)
      .filter('getPathFromUrl', getPathFromUrl)
      .filter('reverse', reverse)
      .filter('truncate', truncate);


  /**
   * Filtro para limpiar caracteres extraños
   * @return {Function|*}
   */
  function clean() {
    var result;
    result = function(value) {
      if (value && typeof value === 'string') {
        return value.replace(/[^\w+]/g, '_');
      }
      return '';
    };

    return result;
  }


  /**
   * Filtro que imprime tres guiones cuando se pase algo vacío, null o no definido
   * @return {Function|*}
   */
  function fillEmpty() {
    var result;
    result = function(value) {

      if (!value || value === undefined || value.trim() === '') {
        return '---';
      }

      return value;
    };
    return result;
  }


  /**
   * Filtro para obtener el path de una url
   * @return {Function}
   */
  function getPathFromUrl() {
    return function(value) {
      if (value) {
        return value.split('?')[0];
      }
      return '';
    };
  }


  /**
   * Filtro para dar la vuelta un string
   * @return {Function}
   */
  function reverse() {
    return function(value) {
      if (value) {
        return value.split('').reverse().join('');
      }
      return '';
    };
  }


  /**
   * Filtro para recortar y añadir un sufijo a una cadena
   * @return {Function|*}
   */
  function truncate() {
    var result;
    result = function(value, length, sufix) {
      if (value && value !== undefined &&
          length && length !== undefined && length > 0) {

        if (value.length > length) {

          if (!sufix) {
            sufix = '...';
          }

          if (value.length < sufix.length) {
            return sufix.substr(0, length);
          }

          if (value.length > sufix.length) {
            var truncate = value.substr(0, length - sufix.length);
            truncate += sufix;
            return truncate;
          }
        }

        return value;
      }
      return '';
    };
    return result;
  }

})();
