import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
const COL_TRACK_ID = 0;
const COL_GENRE_TOP = 40;

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'IA.html'));
});

app.use((req,res) => {
    res.status(404).json({
        erro:"Página não encontrada"
    })
});

app.listen(port, () =>{
  console.log(`Servidor rodando em http://localhost:${port}`);
});

export async function enviarDatasetPorGenero(csvPath, audioFolder, serverUrl, generos) {
  const generosDesejados = new Set(generos.map(g => g.toLowerCase()));
 
  let faixasEncontradas = 0;
  let faixasEnviadas = 0;
 
  const linhas = await lerCsv(csvPath);
 
  for (const linha of linhas) {
    const trackId = String(linha[COL_TRACK_ID] ?? '').padStart(6, '0');
    const genero = String(linha[COL_GENRE_TOP] ?? '').trim();
 
    if (!genero || !generosDesejados.has(genero.toLowerCase())) continue;
 
    faixasEncontradas++;
 
    const subpasta = trackId.substring(0, 3);
    const caminhoArquivo = path.join(audioFolder, subpasta, `${trackId}.mp3`);
 
    if (!fs.existsSync(caminhoArquivo)) continue;
 
    const enviado = await enviarParaServidor(serverUrl, caminhoArquivo, genero);
    if (enviado) faixasEnviadas++;
  }
 
  return { faixasEncontradas, faixasEnviadas };
}
 
function lerCsv(csvPath) {
  return new Promise((resolve, reject) => {
    const linhas = [];
    fs.createReadStream(csvPath)
      .pipe(parse({ fromLine: 4 })) // pula as 3 linhas de cabeçalho composto do FMA
      .on('data', (row) => linhas.push(row))
      .on('end', () => resolve(linhas))
      .on('error', reject);
  });
}
 
async function enviarParaServidor(url, caminhoArquivo, genero) {
  try {
    const buffer = fs.readFileSync(caminhoArquivo);
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
 
    const form = new FormData();
    form.append('audio', blob, path.basename(caminhoArquivo));
    form.append('genero', genero);
 
    const resposta = await fetch(url, {
      method: 'POST',
      body: form,
    });
 
    return resposta.ok;
  } catch {
    return false;
  }
}
