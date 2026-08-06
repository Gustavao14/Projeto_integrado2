
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname,'html','index.html'));
});
const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello, World!\n');
});

const port = 3000;
server.listen(port, () => {
console.log(`Servidor rodando em http://localhost:${port}/`);
});