using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;


class API_FMA //FMA(Free music Archive) onde esta as musicas para o dataset da TRECKSOUND(IA resposavel pela jugestão de musicas)
{
    const int COL_TRACK_ID = 0;
    const int COL_GENRE_TOP = 40;
 
    static async Task Main(string[] args)
    {
        if (args.Length < 4)
        {
            Console.WriteLine("Uso: dotnet run -- <tracks.csv> <pasta_audios> <url_servidor> <generos_separados_por_virgula>");
            return;
        }
 
        string csvPath = args[0];
        string audioFolder = args[1];
        string serverUrl = args[2];
        var generosDesejados = args[3]
            .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .Select(g => g.ToLowerInvariant())
            .ToHashSet();
 
        var faixasEncontradas = 0;
        var faixasEnviadas = 0;
        var generosNaoEncontrados = generosDesejados.ToHashSet();
 
        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = false,
        });
 
        for (int i = 0; i < 3; i++)
            await csv.ReadAsync();
 
        using var httpClient = new HttpClient();
 
        while (await csv.ReadAsync())
        {
            string trackId = csv.GetField(COL_TRACK_ID)?.PadLeft(6, '0') ?? "";
            string genero = csv.GetField(COL_GENRE_TOP)?.Trim() ?? "";
 
            if (string.IsNullOrEmpty(genero) || !generosDesejados.Contains(genero.ToLowerInvariant()))
                continue;
 
            generosNaoEncontrados.Remove(genero.ToLowerInvariant());
            faixasEncontradas++;
 
            string subpasta = trackId.Substring(0, 3);
            string caminhoArquivo = Path.Combine(audioFolder, subpasta, $"{trackId}.mp3");
 
            if (!File.Exists(caminhoArquivo))
            {
                Console.WriteLine($"[AVISO] Arquivo não encontrado: {caminhoArquivo}");
                continue;
            }
 
            bool enviado = await EnviarParaServidor(httpClient, serverUrl, caminhoArquivo, genero);
            if (enviado)
            {
                faixasEnviadas++;
                Console.WriteLine($"[OK] {trackId}.mp3 ({genero}) enviado");
            }
        }
 
        Console.WriteLine();
        Console.WriteLine($"Total encontrado: {faixasEncontradas} | Total enviado: {faixasEnviadas}");
 
        if (generosNaoEncontrados.Any())
        {
            Console.WriteLine($"[ATENÇÃO] Gêneros não encontrados: {string.Join(", ", generosNaoEncontrados)}");
        }
    }
 
    static async Task<bool> EnviarParaServidor(HttpClient client, string url, string caminhoArquivo, string genero)
    {
        try
        {
            using var form = new MultipartFormDataContent();
            using var stream = File.OpenRead(caminhoArquivo);
            var fileContent = new StreamContent(stream);
            fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse("audio/mpeg");
 
            form.Add(fileContent, "audio", Path.GetFileName(caminhoArquivo));
            form.Add(new StringContent(genero), "genero");
 
            var resposta = await client.PostAsync(url, form);
            return resposta.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERRO] Falha ao enviar {caminhoArquivo}: {ex.Message}");
            return false;
        }
    }
}
