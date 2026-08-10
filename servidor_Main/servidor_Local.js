const express = require('express');
const path = require('path');

const app = espress();
const port = 3000;

app.use(express.static(path.join(__dirname,'html', 'Home.html')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'Home.html'));
});

app.use((req,res) => {
    res.status(404).json({
        erro:"Página não encontrada"
    })
});

app.listen(port, () =>{
  console.log(`Servidor rodando em http://localhost:${port}`);
});