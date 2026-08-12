const express = require('express');
const path = require('path');

const app = express();

// Disponibiliza os arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

// Sound Station
app.get('/sound-station', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'SoundStation.html'));
});

// IA
app.get('/IA', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'IA.html'));
});

// Página não encontrada
app.use((req, res) => {
    res.status(404).json({
        erro: "Página não encontrada"
    });
});

module.exports = app;