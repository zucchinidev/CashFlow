/* global describe, beforeEach, it, inject, expect */
describe('Filtros string:', function() {
  'use strict';
  var truncateFilter,
      fillEmptyFilter;

  beforeEach(module('zucStringFilters'));

  beforeEach(inject(function(_truncateFilter_) {
    truncateFilter = _truncateFilter_;
  }));

  beforeEach(inject(function(_fillEmptyFilter_) {
    fillEmptyFilter = _fillEmptyFilter_;
  }));


  describe('truncate:', function() {

    it('Cortar el string y añadir el sufijo elegido',
        function(truncateFilter) {
          var foo = 'cashflow@cashflow.com', length = 16, sufix = '...';
          expect(truncateFilter(foo, length, sufix)).toEqual('cashflow@cash...');
        }
    );

    it('Si el largo es mayor que el string, permanece inmutable',
      function(truncateFilter) {
        var foo = 'cashflow@cashflow.com', length = 24, sufix = '...';
        expect(truncateFilter(foo, length, sufix)).toEqual('cashflow@cashflow.com');
      }
    );

    it('Si el largo del string pasado es menor que el nº de caracteres del sufijo, el retorno es el ' +
        'propio sufijo repetido el nº de caracteres elegido',
      function(truncateFilter) {
        var foo = 'cashflow', length = 7, sufix = '.........';
        expect(truncateFilter(foo, length, sufix)).toEqual('.......');
      }
    );

    it('Si el string pasado no está definido, retorna cadena vacía',
      function(truncateFilter) {
        var foo = null, length = 7, sufix = '.........';
        expect(truncateFilter(foo, length, sufix)).toEqual('');
      }
    );

    it('Si el largo elegido no está definido, retorna cadena vacía',
      function(truncateFilter) {
        var foo = 'cashflow@cashflow.com', length = null, sufix = '.........';
        expect(truncateFilter(foo, length, sufix)).toEqual('');
      }
    );

    it('Si el sufijo elegido no está definido, se asigna como sufijo los caracteres ...',
      function(truncateFilter) {
        var foo = 'cashflow@cashflow.com', length = 12, sufix = null;
        expect(truncateFilter(foo, length, sufix)).toEqual('cashflow@...');
      }
    );
  });


  describe('reverse:', function() {
    it('filtro reverse debe retornar la cadena en el sentido inverso',
      inject(function(reverseFilter) {
        var value = 'abcd';
        expect(reverseFilter(value)).toEqual('dcba');
      })
    );

    it('filtro reverse si el parámetro pasado no está definido retorna cadena vacía',
      inject(function(reverseFilter) {
        expect(reverseFilter(undefined)).toEqual('');
      })
    );
  });





  describe('getPathFromUrl:', function() {
    it('filtro getPathFromUrl debe retornar el path de una url sin la sección de la query',
      inject(function(getPathFromUrlFilter) {
        var testURL = '/products/list?sortdirection=dsc&sort=price&page=3';
        expect(getPathFromUrlFilter(testURL)).toEqual('/products/list');
      })
    );

    it('filtro getPathFromUrl debe retornar el path de una url aún si no existe la sección de la query',
        inject(function(getPathFromUrlFilter) {
          var testURL = '/products/list';
          expect(getPathFromUrlFilter(testURL)).toEqual('/products/list');
        })
    );
  });


});
