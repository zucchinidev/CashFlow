/* global describe, beforeEach, it, inject, expect */
describe('Filtros de movimientos:', function() {
  'use strict';

  beforeEach(module('zucMovementsFilters'));


  describe('greaterThan:', function() {
    it('Obtener movimientos cuya cantidad sea mayor o igual a 2000',
        inject(function(greaterThanFilter) {
          var movements = [{quantity: 1000},{quantity: 2000},{quantity: 3000}];
          var result = [{quantity: 2000},{quantity: 3000}];
          expect(greaterThanFilter(movements, 2000)).toEqual(result);
        })
    );

    it('No retorna ningún movimiento',
        inject(function(greaterThanFilter) {
          var movements = [{quantity: 1000},{quantity: 2000},{quantity: 3000}];
          var result = [];
          expect(greaterThanFilter(movements, 5000)).toEqual(result);
        })
    );
  });
});
