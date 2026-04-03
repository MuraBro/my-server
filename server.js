const http = require('http');
const WebSocket = require('ws');

const port = process.env.PORT || 3000; //ここが大事

// HTTPサーバー
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Server is running");
});

// WebSocketサーバー
const wss = new WebSocket.Server({ server });

let sharedText = "";

wss.on('connection', (ws) => {
  ws.send(sharedText);

  ws.on('message', (message) => {
    sharedText = message.toString();

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(sharedText);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});