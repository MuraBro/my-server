const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const port = process.env.PORT || 3000;
const path = require('path');
const ext = path.extname(filePath);
const contentType = {
  '.html': 'text/html',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.css': 'text/css',
  '.js': 'application/javascript'
}[ext] || 'text/plain';



// HTTPサーバー
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile("index.html", (err, data) => {
      if (err) {
        res.writeHead(500);
        return res.end("Error loading file");
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
  }
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