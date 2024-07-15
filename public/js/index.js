function initMap() {
    var location = {lat: -34.397, lng: 150.644};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}
document.addEventListener('DOMContentLoaded', initMap);


//fetch para el registro
document.getElementById('registro').addEventListener('submit', async (e)=>{
    e.preventDefault();
    let nombre = document.getElementById('registerName').value;
    let correo = document.getElementById('registerEmail').value;
    let contraseña = document.getElementById('registerPassword').value;
    let data = {nombre, correo, contraseña};
    fetch('/registro',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>res.json()).then(data=>{
        if(data.state){
            //mostrar un sweetalert con el mensaje de exito
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: data.msg
            }).then(()=>{
                //muestro el modal de login y oculto el de registro
                $('#registerModal').modal('hide');
                $('#loginModal').modal('show');
            });
        }else{
            //mostrar un sweetalert con el mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.msg
            });
        }
    });
});

//fetch para el login
document.getElementById('login').addEventListener('submit', async (e)=>{
    e.preventDefault();
    let correo = document.getElementById('loginEmail').value;
    let contraseña = document.getElementById('loginPassword').value;
    let data = {correo, contraseña};
    fetch('/login',{
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>res.json()).then(data=>{
        if(data.state){
            //mostrar un sweetalert con el mensaje de exito
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: data.msg
            }).then(()=>{
                //recargo la pagina
                location.reload();
            });
        }else{
            //mostrar un sweetalert con el mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.msg
            });
        }
    });
});