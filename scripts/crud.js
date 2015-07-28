(function() {
  'use strict';
  var express = require('express');
  var bodyParser = require('body-parser');
  var app = express();
  var movements = [];
  // Permite recuperar como objetos javascript el contenido emitido por el cliente
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(function(req, res, next) {
    console.log('recibida petición: ' + req.url);
    next();
  });

  app.get('/', function(req, res) {
    res.send('Hola express');
  });

  app.get('/categories', getCategories);

  // API mevements
  app.get('/movements', getMovements);
  app.post('/movements/create', createMovement);
  app.get('/movement/:id', getMomement);
  app.put('/movement/:id/update', updateMovement);
  app.delete('/movement/:id/delete', deleteMovement);


  /**
   * Middelware tipo GET para obtener las categorías.
   * @param {{Request}} req Objeto Request
   * @param {{Response}} res Objeto Response
   */
  function getCategories(req, res) {
    res.json({
      categoryEntry: ['Nominas', 'Extras'],
      categorySpending: ['Alquiler', 'Recibos', 'Ocio', 'Comida']
    });
  }


  /**
   * Middelware tipo GET para obtener los movimientos.
   * @param {{Request}} req Objeto Request
   * @param {{Response}} res Objeto Response
   */
  function getMovements(req, res) {
    return res.json(movements);
  }

  /**
   * Middelware tipo GET para obtener un movimiento.
   * @param {{Request}} req Objeto Request
   * @param {{Response}} res Objeto Response
   */
  function getMomement(req, res) {
    res.json(movements[req.params.id]);
  }

  /**
   * Middelware tipo POST para crear un movimiento
   * @param {{Request}} req Objeto Request
   * @param {{Response}} res Objeto Response
   */
  function createMovement(req, res) {
    var newMovement = req.body;
    console.log(req.body);
    newMovement.id = movements.length;
    res.json(movements.push(newMovement));
  }

  /**
   * Middelware tipo PUT para modificar un movimiento.
   * @param {{Request}} req Objeto Request
   * @param {{Response}} res Objeto Response
   */
  function updateMovement(req, res) {
    movements[req.params.id] = req.body;
    res.json(movements);
  }

  /**
   * Middelware tipo DELETE para borrar un movimiento.
   * @param {{Request}} req Objeto Request
   * @param {{Response}} res Objeto Response
   */
  function deleteMovement(req, res) {
    movements.splice(req.params.id, 1);
    res.json(movements);
  }
  app.listen(3000);
})();
