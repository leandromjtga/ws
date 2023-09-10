const WebSocket = require('ws');
const http = require('http');

// Crie um servidor HTTP simples
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Servidor WebSocket em execução\n');
});

// Crie um servidor WebSocket que ouve na mesma porta do servidor HTTP
const wss = new WebSocket.Server({ server });

// Defina um manipulador de eventos para quando um cliente se conectar ao servidor WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente conectado.');

  // Defina manipuladores de eventos para mensagens recebidas do cliente
  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
    
    // Enviar uma resposta de volta ao cliente
    ws.send(`Você disse: ${message}`);
  });

  // Defina um manipulador de eventos para quando o cliente se desconectar
  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });
});

// Inicie o servidor HTTP na porta 8080
server.listen(8080, () => {
  console.log('Servidor HTTP e WebSocket estão ouvindo na porta 8080.');
});
