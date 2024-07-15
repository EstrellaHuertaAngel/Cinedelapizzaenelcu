// Importaciones para el websocket
const WebSocket = require("ws");
const http = require("http");
// Creamos una instacia del servidor HTTP (Web)
const server = http.createServer();
// Creamos y levantamos un servidor de WebSockets a partir del servidor HTTP
const wss = new WebSocket.Server({ server });
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

//data base connection
const conn = require('./controllers/DBController');
const {promisify} = require('util')
const query = promisify(conn.query).bind(conn);

// Escuchamos los eventos de conexión
wss.on("connection",  function connection(ws) {
    // Escuchamos los mensajes entrantes
    ws.on("message", function incoming(data) {
        // Iteramos todos los clientes que se encuentren conectados
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data.toString());
            }
        });
    });
});

// Levantamos servidor HTTP
server.listen(8080);
console.log("Servidor funcionando. Utiliza ws://localhost:8080 para conectar.");
