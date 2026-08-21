const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// DATASET 
// energia: indica em um numero de 1 a 5 o quão a musica é agitada
// clima: seria o que a musica transmite
// estilo: preve o estilo que a musica é

const MUSICAS = [
    { id: 1,  nome: "Manha de Vidro",      energia: 1, instrumento: "violao",     clima: "relaxar",   estilo: "acustica" },
    { id: 2,  nome: "Neon Boulevard",      energia: 5, instrumento: "eletronico", clima: "festa",     estilo: "dancante" },
    { id: 3,  nome: "Carta Nunca Enviada", energia: 2, instrumento: "piano",      clima: "romantico", estilo: "romantica" },
    { id: 4,  nome: "Asfalto Quente",      energia: 5, instrumento: "guitarra",   clima: "animado",   estilo: "rock" },
    { id: 5,  nome: "Domingo Devagar",     energia: 2, instrumento: "violao",     clima: "relaxar",   estilo: "acustica" },
    { id: 6,  nome: "Batida do Bairro",    energia: 4, instrumento: "percussao",  clima: "festa",     estilo: "dancante" },
    { id: 7,  nome: "Ultimo Trem",         energia: 1, instrumento: "piano",      clima: "triste",    estilo: "melancolica" },
    { id: 8,  nome: "Verao 22",            energia: 4, instrumento: "voz",        clima: "animado",   estilo: "pop" },
    { id: 9,  nome: "Fita Cassete",        energia: 3, instrumento: "guitarra",   clima: "animado",   estilo: "rock" },
    { id: 10, nome: "Cafe as Seis",        energia: 3, instrumento: "voz",        clima: "romantico", estilo: "romantica" }
];

const K = 3; // constante criada para escolher 3 vizinhos proximos
const INSTRUMENTOS_VALIDOS = ["violao", "piano", "guitarra", "eletronico", "percussao", "voz"];
const CLIMAS_VALIDOS = ["relaxar", "festa", "romantico", "animado", "triste"];


// LÓGICA DO KNN 

function calcularDistancia(energia, instrumento, clima, musica)// função que vai pegar os dados que o usuario digitou para calcular a distancia
 {
    const distEnergia = Math.abs(energia - musica.energia) / 4;// energia = resposta do usuario e musica.energia é o valor especifico de energia daquela musica 
    let distInstrumento
    if(instrumento === musica.instrumento){
        distInstrumento = 0;
    } else{
        distInstrumento = 1;clima === musica.clima
    }

    let distClima;
    if(clima === musica.clima){
       distClima = 0;
    } else{
        distClima = 1;
    } 
    const soma = distEnergia ** 2 + distInstrumento ** 2 + distClima ** 2;//ele joga na formula pra calcular a distancia
    return Math.sqrt(soma); // retorna resultado da distancia
}

function buscarVizinhos(energia, instrumento, clima)
 {
    const lista = MUSICAS.map(musica => ({
        distancia: calcularDistancia(energia, instrumento, clima, musica),
        id: musica.id,
        nome: musica.nome,
        estilo: musica.estilo
    }));
    lista.sort((a, b) => a.distancia - b.distancia);
    return lista.slice(0, K);
}

function estiloMaisVotado(vizinhos) {
    const contagem = {};
    for (const vizinho of vizinhos) {
        contagem[vizinho.estilo] = (contagem[vizinho.estilo] || 0) + 1;
    }
    let estiloVencedor = "";
    let maisVotos = 0;
    for (const estilo in contagem) {
        if (contagem[estilo] > maisVotos) {
            maisVotos = contagem[estilo];
            estiloVencedor = estilo;
        }
    }
    return estiloVencedor;
}

function recomendar(energia, instrumento, clima) {
    const vizinhos = buscarVizinhos(energia, instrumento, clima);
    const vencedor = estiloMaisVotado(vizinhos);
    for (const vizinho of vizinhos) {
        if (vizinho.estilo === vencedor) return vizinho.id;
    }
    return vizinhos[0].id;
}


// ESTADO DA CONVERSA

const conversas = {};

function novaConversa() {
    return { etapa: "inicio", energia: null, instrumento: null, clima: null };
}

// PÁGINAS

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

app.get('/SoundStation', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'SoundStation.html'));
});

app.get('/Trecksound', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'IA.html'));
});


// ROTA DO CHAT

app.post('/trecksound', (req, res) => {
    const prompt = (req.body.prompt || "").trim();
    const idUsuario = "usuario1"; // usuario fixo

    if (!conversas[idUsuario]) {
        conversas[idUsuario] = novaConversa();
    }
    const estado = conversas[idUsuario];

    // frase de início 
    if (estado.etapa === "inicio") {
        if (prompt === "quero indicações") {
            estado.etapa = "energia";
            return res.json({
                resposta: "De 1 a 5, o quanto você quer uma música agitada? (1 = bem lenta / 5 = pra dançar)"
            });
        }
        return res.json({ resposta: "Não entendi. Digite 'quero indicações' para começar." });
    }

    //energia 
    if (estado.etapa === "energia") {
        const numero = Number(prompt);
        if (Number.isInteger(numero) && numero >= 1 && numero <= 5) {
            estado.energia = numero;
            estado.etapa = "instrumento";
            return res.json({
                resposta: "Qual som combina mais com você agora? (" + INSTRUMENTOS_VALIDOS.join(", ") + ")"
            });
        }
        return res.json({ resposta: "Digite um número de 1 a 5." });
    }

    // ---------- ETAPA 3: instrumento ----------
    if (estado.etapa === "instrumento") {
        const escolha = prompt.toLowerCase();
        if (INSTRUMENTOS_VALIDOS.includes(escolha)) {
            estado.instrumento = escolha;
            estado.etapa = "clima";
            return res.json({
                resposta: "Que clima você quer? (" + CLIMAS_VALIDOS.join(", ") + ")"
            });
        }
        return res.json({
            resposta: "Opção inválida. Escolha entre: " + INSTRUMENTOS_VALIDOS.join(", ")
        });
    }

    // recomendação 
    if (estado.etapa === "clima") {
        const escolha = prompt.toLowerCase();
        if (CLIMAS_VALIDOS.includes(escolha)) {
            estado.clima = escolha;

            const idEscolhido = recomendar(estado.energia, estado.instrumento, estado.clima);
            const musicaEscolhida = MUSICAS.find(m => m.id === idEscolhido);

            conversas[idUsuario] = novaConversa(); // reseta pra permitir nova consulta

            return res.json({
                resposta: "Música recomendada: " + musicaEscolhida.nome + " (" + musicaEscolhida.estilo + ")"
            });
        }
        return res.json({
            resposta: "Opção inválida. Escolha entre: " + CLIMAS_VALIDOS.join(", ")
        });
    }

    
    conversas[idUsuario] = novaConversa();
    return res.json({ resposta: "Algo deu errado, vamos recomeçar. Digite 'quero indicações'." });
});


app.use((req, res) => {
    res.status(404).json({ erro: "Página não encontrada" });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});