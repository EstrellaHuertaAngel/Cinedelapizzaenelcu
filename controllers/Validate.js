//dependencia de manejo de tiempo
const moment = require('moment');

//validacion de los datos del formulario de registro
exports.validateR = function validarRegistro(nombre, correo, contraseña){
    let error = "";
    let state = true;
    //CAMPOS VACIOS
    if(nombre == "" || correo == "" || contraseña == ""){
        error = "Todos los campos son obligatorios";
        state = false;
    }
    //validamos con test si el correo es valido
    if(!/\S+@\S+\.\S+/.test(correo)){
        error = "Correo no valido";
        state = false;
    }
    //validamos la contraseña
    if(contraseña.length < 6){
        error = "La contraseña debe tener al menos 6 caracteres";
        state = false;
    }
    //validamos el nombre con test si es valido
    if(!/^[a-zA-Z ]+$/.test(nombre)){
        error = "Nombre no valido";
        state = false;
    }

    return {error, state};

}

//validacion de los datos del formulario de agregar funcion
exports.ValidarFuncion = function validarFuncion(Titulo,Genero,Duracion,Director,Calificacion,SalaID,HoraInicio){
    let error = "";
    let state = true;
    //CAMPOS VACIOS
    if(Titulo == "" || Genero == "" || Duracion == "" || Director == "" || Calificacion == "" || SalaID == "" || HoraInicio == ""){
        error = "Todos los campos son obligatorios";
        state = false;
    }
    //validamos el titulo con test si es valido
    if(!/^[a-zA-Z ]+$/.test(Titulo)){
        error = "Titulo no valido";
        state = false;
    }
    //validamos el genero con test si es valido
    if(!/^[a-zA-Z ]+$/.test(Genero)){
        error = "Genero no valido";
        state = false;
    }
    //validamos la duracion con test si es valido
    if(!/^[0-9 ]+$/.test(Duracion)){
        error = "Duracion no valida";
        state = false;
    }
    //validamos el director con test si es valido
    if(!/^[a-zA-Z ]+$/.test(Director)){
        error = "Director no valido";
        state = false;
    }
    //validamos la calificacion con test si es valido
    if(!/^[0-9 ]+$/.test(Calificacion)){
        error = "Calificacion no valida";
        state = false;
    }
    //validamos la sala con test si es valido
    if(!/^[0-9 ]+$/.test(SalaID)){
        error = "Sala no valida";
        state = false;
    }
    //validamos que la fecha se mayor a la fecha actual
    let fecha = new Date();
    let fechaForm = new Date(fecha);
    if(fechaForm < fecha){
        error = "La fecha no puede ser menor a la fecha actual";
        state = false;
    }
    return {error, state};
}

//funcion hora final
exports.HoraFinal = function horaFinal(horaInicio, duracion){
    const duracionEnMinutos = parseInt(duracion, 10);
    const horaInicioMoment = moment(horaInicio);
  
    if (!horaInicioMoment.isValid()) {
      throw new Error('La hora de inicio no es válida.');
    }
  
    const horaFinal = horaInicioMoment.add(duracionEnMinutos, 'minutes');
    return horaFinal.format('YYYY-MM-DDTHH:mm');
}