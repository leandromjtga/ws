const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');

// Certificado SSL/TLS
const serverOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/personal365.com.br/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/personal365.com.br/fullchain.pem')
};

const server = https.createServer(serverOptions);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.ep == 0) {
      clients.forEach((conectados) => {
        conectados.send(parsedMessage.message);
      });
    } else {
      const recipient = clients.get(parsedMessage.recipient);
      if (recipient && recipient.readyState === WebSocket.OPEN) {
        console.log("mensagem enviada")
        recipient.send(parsedMessage.message);
      }
    }
  });

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

server.listen(8080, () => {
  console.log('Server running on port 8080');
});
