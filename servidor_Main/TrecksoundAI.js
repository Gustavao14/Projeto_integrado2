require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');
const OpenAi = require('openai');

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

app.use(express.static(path.join(__dirname,'public')));~

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/Soundstation', (req, res) =>{
 res.sendFile(path.join(__dirname, 'public', 'Soundstation.html'));
});

app.get('/Trecksound', (req, res) =>{
 res.sendFile(path.join(__dirname, 'public', 'IA.html'));
});

app.post('/trecksound', async (req, res) =>{
try{
    const{prompt} = req.body;

    if(!prompt){
        return res.status(404).json({ erro: 'Nenhum prompt enviado'});
    }

    const completion = await openai.chat.completions.create({
     model:'gpt-4o-mini',
     messages:[{role:'user', content: prompt}],
    });

    res.json({resposta: conpletion.choices[0].mensage.content});

}catch(erro){
  console.error({erro});
 res.status(500).json({erro: 'Trecksound falou ao processar'});
}
});

app.use((req,res) => {
    res.status(404).json({
        erro:"Página não encontrada"
    })
});

app.listen(port, () =>{
  console.log(`Servidor rodando em http://localhost:${port}`);
});

