
const http = require('http');
const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname,'html','index.html'));
});


const port = 3000;
app.listen(port, () => {
console.log(`Servidor rodando em http://localhost:${port}/`);
});