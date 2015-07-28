/* global JSON*/


/**
 * @type {*|exports|module.exports}
 */
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


app.use(bodyParser());
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/vendor'));
app.use(express.static(__dirname + '/static'));


/**
 * Middelware para implementar un pequeño log
 * TODO cambiar ésto por un sistema de logs
 */
app.use(function(req, res, next) {
  'use strict';
  console.log('Recibida petición ' + req.url);
  if (req.body && Object.keys(req.body) > 0) {
    console.log('Body: ' + JSON.stringify(req.body));
  }
  next();
});


/**
 * Meddelware que se va ejecutar antes de llegar a la función de negocio
 */
app.use('/api/pri/', function(req, res, next) {
  'use strict';
  // nos inventamos la cabecera sessionId para comparar sessiones, TODO en el futuro utilizar la cabecera Authorization
  var sessionId = req.get('sessionId');
  var session = getSession(sessionId);
  console.log('SESION:');
  console.log(session);
  console.log('SESIONID:');
  console.log(sessionId);
  if (session) {
    if (isValidSession(session)) {
      // Ampliar margen de seguridad
      session.timeStamp = new Date();
      // Modificamos la request para que el resto de la pila sepa quien es el usuario
      req.userEmail = session.email;
      // Pasamos el control
      next();
    } else {
      // Sessión caducada
      console.log('Sesión caducada: ' + JSON.stringify(session));
      res.status(419).send('Authentication Timeout '); // 419  no está presente en los estándares HTTP
    }
  } else {
    console.log('Auntorización denegada');
    res.status(401).send('No autorizado!');
  }
});

console.log('ready');


// La seguridad lo manejaremos con dos conceptos básicos, users y sessions
// TODO implementar seguridad OpenAuth
// Por ahora todo va almacenado en memoria, por eso utilizo arrays, posteriormente
// irá en MongoDB
var movements = [],
    users = [],
    sessions = [],
    total = [],
    maxId = 0;


/*====================================================================================================================*/
//                                                      AUTH
/*====================================================================================================================*/


app.route('/api/users')
    .get(getUsers)// TODO OJO: eliminar este middelware, solo utilizar en modo debug
    .post(insertUser);

app.route('/api/sessions')
    .get(getSessions) // TODO OJO: eliminar este middelware, solo utilizar en modo debug
    .post(insertSession);



/*====================================================================================================================*/
//                                                      BUSINESS
/*====================================================================================================================*/

app.get('/api/pub/categories', getCategories);

app.route('/api/pri/movements')
    .get(getMovements)
    .put(updateMovement)
    .delete(deleteMovement)
    .post(insertMovement);

app.get('/api/pri/movements/:id', getMomement);

app.get('/api/pri/total', getTotal);



/*====================================================================================================================*/
//                                                      AUTH
/*====================================================================================================================*/


/**
 * Función tipo GET para obtener todos los usuarios del sistema
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function getUsers(req, res) {
  'use strict';
  res.json(users);
}


/**
 * Función tipo POST para insertar un usuario en el sistema
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function insertUser(req, res) {
  'use strict';
  var user = req.body;
  if (userExists(user)) {
    console.log('El usuario existe en el sistema.');
    // 409 Conflicto
    // Indica que la solicitud no pudo ser procesada debido a un conflicto con el
    // estado actual del recurso que éste identifica.
    res.status(409).send('Email:' + user.email + ' ya registrado en el sistema');
  } else {
    // TODO verificar email...
    console.log('Registrando...:' + user.email);
    users.push(user);
    // TODO session no es más que una conexión de un usuario a una máquina, implementar sesiones de verdad
    res.json(newSession(user.email));
  }
}


/**
 * Función tipo GET para obtener las sessiones
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function getSessions(req, res) {
  'use strict';
  res.json(sessions);
}


/**
 * Función tipo POST para insertar una session
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function insertSession(req, res) {
  'use strict';
  // LOGIN
  var user = req.body;
  if (isValidUser(user)) {
    console.log('Usuario válido');
    res.json(newSession(user.email));
  } else {
    console.log('Credencial no válida: ' + user.email);
    res.status(401).send('No autorizado!');
  }
}


/**
 * Crear nuevas sesiones
 * @param {string} email
 * @return {number} sessionId
 */
function newSession(email) {
  // TODO verificar si existe una sesión para el email y borrar, para no tener sesiones asignadas a un mismo email
  'use strict';
  var sessionId = Math.random(88888) + 11111;
  var timeStamp = new Date();
  sessions.push({
    sessionId: sessionId,
    timeStamp: timeStamp,
    email: email
  });

  return sessionId;
}


/**
 * Verifica si el usuario existe en el sistema
 * @param {{email:string}} user usuario a comprobar
 * @return {boolean} true si el usuario existe.
 */
function userExists(user) {
  'use strict';
  // Verificamos si algún email de cada item de users coincide con el email pasado
  return users.some(function(u) {
    return u.email === user.email;
  });
}


/**
 * Verifica si el usuario pasado como parámetro es un usuario válido
 * @param {{email:string, password:string}} user
 * @return {T} un elemento del array si se cumple la condición del filter o undefined si no encuentra user
 */
function isValidUser(user) {
  'use strict';
  return users.filter(function(u) {
    // Retorna un array con los elementos que pasan la prueba
    return u.email === user.email && u.password === user.password;
  })[0];
}


/**
 * Obtener sesión
 * @param {number} sessionId
 * @return {T} un elemento del array si se cumple la condición del filter o undefined si no encuentra session
 */
function getSession(sessionId) {
  'use strict';
  return sessions.filter(function(session) {
    return session.sessionId === parseFloat(sessionId);
  })[0];
}


/**
 * Verificar si la sesión es válida
 * @param {{}} session
 * @return {boolean}
 */
function isValidSession(session) {
  'use strict';
  // si han pasado menos de 20 minutos la sesión es válida
  return (new Date() - session.timeStamp) < 20 * 60 * 1000;
}


/*====================================================================================================================*/
//                                                      BUSINESS
/*====================================================================================================================*/


/**
 * Función tipo GET para obtener las categorías.
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function getCategories(req, res) {
  'use strict';
  res.json({
    categoryEntry: ['Nominas', 'Extras'],
    categorySpending: ['Alquiler', 'Recibos', 'Ocio', 'Comida']
  });
}


/**
 * Función tipo GET para obtener los movimientos.
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function getMovements(req, res) {
  'use strict';
  var userMovements = movements.filter(function(m) {
    return m.userEmail === req.userEmail;
  });
  if (userMovements) {
    res.json(userMovements);
  } else {
    res.json([]);
  }
}


/**
 * Función tipo GET para obtener un movimiento.
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function getMomement(req, res) {
  'use strict';
  var movement = movements.filter(function(m) {
    return m.userEmail === req.userEmail && m.id === parseInt(req.params.id);
  })[0];
  res.json(movement);
}


/**
 * Función tipo PUT para modificar un movimiento.
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function updateMovement(req, res) {
  'use strict';
  movements[req.body.id] = req.body;
  res.json(movements);
}


/**
 * Función tipo DELETE para borrar un movimiento.
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function deleteMovement(req, res) {
  'use strict';
  movements.splice(parseInt(req.body.id, 10), 1);
  res.json(movements);
}


/**
 * Función tipo POST para crear un movimiento
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function insertMovement(req, res) {
  'use strict';
  var newMovement = req.body;
  newMovement.userEmail = req.userEmail; //req.userEmail definido en el middelware de inicio
  newMovement.id = ++maxId; // TODO eliminar ésto, solo para pruebas hasta persistencia de datos.
  console.log(JSON.stringify(newMovement));
  movements.push(newMovement);
  var userTotal = getTotalUser(req.userEmail);
  if (newMovement.type === 'Ingreso') {
    userTotal.income += parseFloat(newMovement.quantity);
  } else {
    userTotal.expenses += parseFloat(newMovement.quantity);
  }
  res.status(200).send({
    response: 'Movimiento insertado correctamente'
  });
}


/**
 * Función tipo GET para obtener el total acumulado.
 * @param {{Request}} req Objeto Request
 * @param {{Response}} res Objeto Response
 */
function getTotal(req, res) {
  'use strict';
  var totalUser = getTotalUser(req.userEmail);
  res.json(totalUser);
}


/**
 * Obtener el objeto total del usuario del array de totales
 * @param {string} userEmail email del usuario a buscar
 * @return {{}} objeto total o objecto vacío si no llega userEmail
 */
function getTotalUser(userEmail) {
  'use strict';
  console.log('Email user:');
  console.log(userEmail);
  console.log('************');
  if (userEmail === undefined) {
    return {};
  }
  var userTotal;
  userTotal = total.filter(function(t) {
    return t.userEmail === userEmail;
  })[0];

  if (userTotal === undefined) {
    userTotal = {
      income: 0,
      expenses: 0,
      userEmail: userEmail
    };
    total.push(userTotal);
  }
  return userTotal;
}


app.listen(3000);

