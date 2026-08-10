
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(process.cwd(),'public')));

app.get('/', (req, res) => {
res.sendFile(process.cwd(),'servidor_Main','html','Home.html');
});

app.get('/IA', (req,res) =>{
res.sendFile(process.cwd(),'servidor_Main','html','IA.html');
});

app.use((req,res) => {
res.status(404).json({
erro:"Página não encontrada"
});
});

module.exports = app;