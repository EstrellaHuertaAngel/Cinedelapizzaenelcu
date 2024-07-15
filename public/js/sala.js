const miWebSocket = new WebSocket("ws://localhost:8080");
const account = document.getElementById('account').innerText;
const funcionID = document.getElementById('FuncionID').innerText;
const amout = document.getElementById('cardAmount');

// Escucha el evento de conexión
async function messageHandler(event) {
    let json = JSON.parse(event.data);
    console.log(json);
    // Valido que el mensaje no sea del mismo usuario
    if (json.account != account) {
        // Valido que el mensaje sea de la misma función
        if (json.FuncionID == funcionID) {
            // Valido que el mensaje sea del mismo estado
            if (json.state == "reserved") {
                // Busco el asiento y lo cambio a reservado
                document.querySelectorAll('.seat.available').forEach(seat => {
                    if (seat.getAttribute('data-seat') == json.Aciento) {
                        seat.classList.remove('available');
                        seat.classList.add('reserved');
                    }
                });
            } else {
                // Busco el asiento y lo cambio a disponible
                document.querySelectorAll('.seat.reserved').forEach(seat => {
                    if (seat.getAttribute('data-seat') == json.Aciento) {
                        seat.classList.remove('reserved');
                        seat.classList.add('available');
                    }
                });
            }
        }
    }
}

async function errorHandler(event) {
    console.log(event);
}

async function openHandler(event) {
    console.log(event);
}

async function closeHandler(event) {
    console.log(event);
}

function sendMessage(Aciento, FuncionID, account, state) {
    let message = {
        Aciento: Aciento,
        FuncionID: FuncionID,
        account: account,
        state: state
    };
    miWebSocket.send(JSON.stringify(message));
}

const selectedSeats = new Set();

document.querySelectorAll('.seat.available').forEach(seat => {
    seat.addEventListener('click', () => {
        const seatNumber = seat.getAttribute('data-seat');
        if (selectedSeats.has(seatNumber)) {
            if (!seat.classList.contains('reserved')) {
                selectedSeats.delete(seatNumber);
                seat.classList.remove('selected');
                sendMessage(seatNumber, funcionID, account, "available");
            }
        } else {
            if (!seat.classList.contains('reserved')) {
                selectedSeats.add(seatNumber);
                seat.classList.add('selected');
                sendMessage(seatNumber, funcionID, account, "reserved");
            }
        }
    });
});

function BuySeats() {
    const seatsArray = Array.from(selectedSeats);
    if (seatsArray.length === 0) {
        alert("Por favor, selecciona al menos un asiento.");
        return;
    }
    //obtengo el costo total por los asientos seleccionados
    let total = seatsArray.length * 150;
    amout.innerText = "$"+total+" MXN";
    //muestro el modal de proceder a la compra
    $('#buyModal').modal('show');
}


function ConfirmBuy() {
    const seatsArray = Array.from(selectedSeats);
    fetch('/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ seats: seatsArray, FuncionID: funcionID })
    }).then(response => response.json()).then(data => {
        if (data.state) {
            //mostrar un sweetalert con el mensaje de exito
            Swal.fire({
                icon: 'success',
                title: 'Exito',
                text: data.msg
            }).then(() => {
                //lo envio a sus compras
                location.href = '/misCompras';
            });
        } else {
            //mostrar un sweetalert con el mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.msg
            }).then(() => {
                //recargo la pagina
                location.reload();
            })
        }
    });
}



function logout() {
    window.location.href = '/logout';
}

// Asignamos los eventos del WebSocket
miWebSocket.addEventListener("message", messageHandler);
miWebSocket.addEventListener("error", errorHandler);
miWebSocket.addEventListener("open", openHandler);
miWebSocket.addEventListener("close", closeHandler);
