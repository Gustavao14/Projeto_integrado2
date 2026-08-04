// Importando o módulo http
const http = require('http');
// Criando o servidor
const server = http.createServer((req, res) => {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello, World!\n');
});
// Especificando a porta
const port = 3000;
server.listen(port, () => {
console.log(`Servidor rodando em http://localhost:${port}/`);
});