const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const port = process.env.PORT || 3000;

// HTTPサーバー
const server = http.createServer((req, res) => {

  let filePath = '.' + req.url;
  if (filePath === './') filePath = './index.html';

  // ★ここに入れる！！
  const ext = path.extname(filePath);

  const contentType = {
    '.html': 'text/html',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.css': 'text/css',
    '.js': 'application/javascript'
  }[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });

});

// WebSocket
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
  console.log("Server running");
});