// expres y router son dos formas de manejar las rutas en express
const express = require('express');
const router = express.Router();
//importamos el controlador principal
const controller = require('../controllers/Main');
//importamos los middlewares de autenticacion
const auth = require('../controllers/Middler');

//ruta principal
router.get('/',auth.SessionInvalid, controller.index);
router.post('/registro',auth.SessionInvalid, controller.registro);
router.post('/login',auth.SessionInvalid , controller.login);
router.get('/logout', controller.logout);

//ruta de peliculas
router.get('/peliculas',auth.SessionValidClient, controller.peliculas);
//ruta de sala de transmision
router.get('/reservar/:id',auth.SessionValidClient, controller.salas);
//ruta de compra de boletos
router.post('/buy',auth.SessionValidClient, controller.buy);
//ruta de mis compras
router.get('/misCompras',auth.SessionValidClient, controller.misCompras);




//ruta de administrador de peliculas
router.get('/AdminPeliculas',auth.SessionValidAdmin, controller.adminPeliculas);
//ruta agregar funcion
router.post('/admin/add-funcion',auth.SessionValidAdmin, controller.addFuncion);
//ruta eliminar funcion
router.delete('/admin/delete-funcion/:id',auth.SessionValidAdmin, controller.deleteFuncion);



//exportamos el modulo
module.exports = router;