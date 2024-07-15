/*  
Nota: como vez esta es la estructura basica de un servidor con express
1. Importamos las librerias necesarias como express, dotenv, body-parser, cors, session
|   - express: es el framework de nodejs que nos permite crear un servidor
|   - dotenv: nos permite configurar las variables de entorno
|   - body-parser: nos permite parsear los datos que vienen del cliente
|   - cors: nos permite habilitar las peticiones entre servidores
|   - session: nos permite crear sesiones en el servidor
2. Inicializamos la app
3. Configuramos la app
4. Configuramos las sesiones y variables de entorno
5. Importamos las rutas
6. Iniciamos el servidor
*/


//constantes principales de la app
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');


//inicializamos la app
const app = express();

//configuramos la app 
app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))
app.set('view engine', 'ejs')

//configurara las sesiones y variebles de entorno
app.use(session({secret:"Cabimbiatusecreto",resave: false,saveUninitialized:false}));
dotenv.config({ path: './env/.env' })

//importamos las rutas
app.use('/', require('./router/router'));


//iniciamos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`SERVER UP runnung in http://localhost:${PORT}`)
})