// Initialize express para poder usarlo en el archivo
const express = require('express');
//importamos el validador
const validate = require('../controllers/Validate');
//importamos el controlador de la base de datos
const db = require('../controllers/DBController');
const {promisify} = require('util');
const query = promisify(db.query).bind(db);



// creamos la funcion index que se encargara de renderizar la vista principal
exports.index = (req, res)=>{
    //obtengo la api key de google maps
    let apiKey = process.env.API_KEY_MAPS;
    //tal ves mostrar info de las ultimas 3 peliculas
    res.render('index', {apikey:apiKey})
}

//funcion de registro de la aplicacion como api rest@
exports.registro = async (req, res)=>{
    //obtenemos los datos del formulario
    let {nombre, correo, contraseña} = req.body;
    //validamos los datos
    let {error, state} = validate.validateR(nombre, correo, contraseña);
    //si no hay errores
    if(state){
        //validamos que el correo no exista
        let result = await query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correo]);
        //si el correo no existe incertamos el registro
        if(result.length == 0){
            //insertamos el registro
            await query('INSERT INTO usuarios SET ?', {NombreUsuario:nombre, correoElectronico:correo, Contrasena:contraseña, Rol:'cliente'});
            //enviamos un mensaje de exito
            res.status(200).json({state:state,msg: "Registro exitoso"});
        }else{
            //enviamos un mensaje de error
            res.status(400).json({state:false,msg: "El correo ya esta registrado"});
        }
    }else{
        //enviamos un mensaje de error
        res.status(400).json({state:state,msg: error});
    }

}

//funcion de login de la aplicacion como api rest
exports.login = async (req, res)=>{
    //obtenemos los datos del formulario
    let {correo, contraseña} = req.body;
    //realizamos la consulta
    let result = await query('SELECT * FROM usuarios WHERE correoElectronico = ? AND Contrasena = ?', [correo, contraseña]);
    //si el usuario existe creamos la sesion
    if(result.length > 0){
        //creamos la sesion
        req.session.user = result[0];
        //enviamos un mensaje de exito
        res.status(200).json({state:true,msg: "Sesion iniciada"});
    }else{
        //enviamos un mensaje de error
        res.status(400).json({state:false,msg: "Usuario o contraseña incorrectos"});
    }
}

//funcion de cerrar sesion
exports.logout = (req, res)=>{
    //destruimos la sesion
    req.session.destroy();
    //redirigimos al index
    res.redirect('/');
}

////////////////////////////////////////////////////////funciones de cliente////////////////////////////////////////////
//funcions mostrar vista de peliculas
exports.peliculas = async (req, res)=>{
    let user = req.session.user;
    //mostramos funciones mayor a la fecha actual
    let funciones = await query('SELECT * FROM funciones JOIN peliculas ON funciones.PeliculaID = peliculas.PeliculaID JOIN salas ON funciones.SalaID = salas.SalaID WHERE HoraInicio > NOW()');
    res.render('Cliente/peliculas', {funciones:funciones, user:user});
}

//funcion mostrar vista de salas
exports.salas = async (req, res)=>{
    console.log(req.params);
    let user = req.session.user;
    //obtenemos la funcion
    let funcion = await query('SELECT * FROM funciones JOIN peliculas ON funciones.PeliculaID = peliculas.PeliculaID JOIN salas ON funciones.SalaID = salas.SalaID WHERE FuncionID = ?', [req.params.id]);
    //obtengo los acientos ocupados
    let asientos = await query('SELECT * FROM reservas WHERE FuncionID = ?', [req.params.id]);
    // array con los asientos ocupados
    let asientosOcupados = [];
    asientos.forEach(asiento => {
        asientosOcupados.push(asiento.NumeroAsiento);
    });
    //agrego el array de asientos ocupados a la funcion
    funcion[0].Reservas = asientosOcupados;
    
    res.render('Cliente/salas', { funcion: funcion[0], user: user });
}

//funcion de compra de boletos
exports.buy = async (req, res)=>{
    let user = req.session.user;
    //obtenemos los datos del formulario
    let {seats, FuncionID} = req.body;

    //validamos que los asientos mandados no esten ocupados
    let asientos = await query('SELECT * FROM reservas WHERE FuncionID = ? AND NumeroAsiento IN (?)', [FuncionID, seats]);

    if(asientos.length == 0){
        //incertamos los asientos
        seats.forEach(async asiento => {
            await query('INSERT INTO reservas SET ?', {FuncionID, UsuarioID:user.UsuarioID, NumeroAsiento:asiento});
        });
        //enviamos un mensaje de exito
        res.status(200).json({state:true,msg: "Compra exitosa"});
    }else{
        //enviamos un mensaje de error
        res.status(400).json({state:false,msg: "Algunos asientos ya estan ocupados"});
    }
}

//funcion de mostrar vista de compras
exports.misCompras = async (req, res)=>{
    let user = req.session.user;
    //obtenemos las reservas del usuario
    let reservas = await query('SELECT * FROM reservas JOIN funciones ON reservas.FuncionID = funciones.FuncionID JOIN peliculas ON funciones.PeliculaID = peliculas.PeliculaID WHERE UsuarioID = ?', [user.UsuarioID]);

    console.log(reservas);
    res.render('Cliente/misCompras', {compras:reservas, user:user});
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////funciones administrativas///////////////////////////////////////////////

//funcion mostrar vista de administrador de peliculas
exports.adminPeliculas = async (req, res)=>{
    //obtenemos las funciones de la peliculas y sus datos
    let funciones = await query('SELECT * FROM funciones JOIN peliculas ON funciones.PeliculaID = peliculas.PeliculaID JOIN salas ON funciones.SalaID = salas.SalaID');
    //Obtenemos todas las salas de la base de datos
    let salas = await query('SELECT * FROM salas');

    if(req.query.alert){
        res.render('Admin/peliculas', {funciones:funciones, salas:salas, alert:true});
    }else{
        res.render('Admin/peliculas', {funciones:funciones, salas:salas, alert:false});
    }
}

//funcion agregar funcion
exports.addFuncion = async (req, res)=>{
    let {Titulo, Genero, Duracion, Director, Calificacion, SalaID, HoraInicio} = req.body;
    console.log(Titulo, Genero, Duracion, Director, Calificacion, SalaID, HoraInicio);
    
    //validamos los datos
    let {error, state} = validate.ValidarFuncion(Titulo, Genero, Duracion, Director, Calificacion, SalaID, HoraInicio);
    
    if(state){
        //obtenemos la hora final
        let HoraFinal = validate.HoraFinal(HoraInicio, Duracion);
        //valido que no haya una funcion que se traslape con la nueva
        let result = await query('SELECT * FROM funciones WHERE SalaID = ? AND HoraInicio BETWEEN ? AND ? OR HoraFin BETWEEN ? AND ?', [SalaID, HoraInicio, HoraFinal, HoraInicio, HoraFinal]);
        //si no hay traslape
        if(result.length == 0){
            //incertamos los datos de la pelicula
            let movie = await query('INSERT INTO peliculas SET ?', {Titulo, Genero, Duracion, Director, Calificacion});
            //incertamos los datos de la funcion
            let funcion = await query('INSERT INTO funciones SET ?', {PeliculaID:movie.insertId,HoraInicio: HoraInicio,HoraFin:HoraFinal,SalaID:SalaID});
            //redirect al admin de peliculas
            res.redirect('/AdminPeliculas');
        }else{
            //redirijo con un alert=true
            console.log('ya hay una funcion en esa sala y se traslapa');
            res.redirect('/AdminPeliculas?alert=true');
        }
    }else{
        //redirijo con un alert=true
        console.log('hay un error en los datos');
        console.log(error);
        res.redirect('/AdminPeliculas?alert=true');
    }

}

//funcion eliminar funcion
exports.deleteFuncion = async (req, res)=>{
    let {id} = req.params;
    console.log(id);
    
    try{
        //eliminamos la funcion
        await query('DELETE FROM funciones WHERE FuncionID = ?', [id]);
        //mandamos el mensaje de exito
        res.status(200).json({state:true,msg: "Funcion eliminada"});
    }catch(e){
        //mandamos el mensaje de error
        res.status(400).json({state:false,msg: "Error al eliminar la funcion"});
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////