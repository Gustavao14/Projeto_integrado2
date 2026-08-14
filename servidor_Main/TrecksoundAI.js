const express = require('express');
const path = require('path');

const app = express();
const port = 3000;
const cors = require('cors');
const trecksound = new trecksound({trecksound: process.env.trecksound_API_KEY});

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'AI.html'));
});

app.use((req,res) => {
    res.status(404).json({
        erro:"Página não encontrada"
    })
});

app.post('/trecksound', async (req, res) =>{
try{
    const{prompt} = req.body;
    const completion = await trecksound.chat.completions.create({
     model:'gpt-40-mini',
     messages:[{role:'user', content: prompt}],
    });
    
    res.json({resposta: conpletion.choices.mensage.content});

}catch(erro){
 res.status(500).json({erro: 'Trecksound falou ao processar'});
}
});

app.listen(port, () =>{
  console.log(`Servidor rodando em http://localhost:${port}`);
});

