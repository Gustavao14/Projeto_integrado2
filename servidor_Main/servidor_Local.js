const express = require('express');
const path = require('path');

const app = express();

const port = 3000;

// Disponibiliza os arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});


app.get('/sound-station', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'SoundStation.html'));
});


app.get('/IA', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'IA.html'));
});


app.use((req, res) => {
    res.status(404).json({
        erro: "Página não encontrada"
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});