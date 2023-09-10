const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Map();

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);



    const parsedMessage = JSON.parse(message);
    //SE RECEBER 0 DO OBJETO ENVIA A MENSAGEM PARA TODOS
    if (parsedMessage.ep == 0) {
      clients.forEach(function (conectados, i) {
        conectados.send(parsedMessage.message);
      })
      //SE RECEBER 1 DO OBJETO ENVIA A MENSAGEM PARA UM USUÁRIO EM ESÉCIFICO
    } else {
      const recipient = clients.get(parsedMessage.recipient);
      //console.log(recipient);
      if (recipient && recipient.readyState === WebSocket.OPEN) {
        console.log("mensagem enviada")
        recipient.send(parsedMessage.message);
      }
    }
  });
  //REMOVE O USUPARIO DA LISTA
  socket.on('close', () => {
    console.log('Client disconnected');
    clients.forEach((clientSocket, clientId) => {
      if (clientSocket === socket) {
        clients.delete(clientId);
      }
    });
  });


  const clientId = Math.random().toString(36).substr(2, 9);
  clients.set(clientId, socket);
  socket.send(JSON.stringify({ type: 'clientId', clientId }));

});
