using System;
using System.Net.Sockets;
using System.Text;
using System.Threading;

class SimuladorTrimpot
{
    static void Main()
    {
        TcpClient cliente = new TcpClient("127.0.0.1", 5000);
        NetworkStream stream = cliente.GetStream();

        Console.WriteLine("Conectado ao servidor Node.js (fake serial)");

        int valor = 2048;
        int direcao = 1;

        while (true)
        {
            valor += direcao * 40;
            if (valor >= 4095) { valor = 4095; direcao = -1; }
            if (valor <= 0)    { valor = 0;    direcao = 1; }

            int porcentagem = (int)Math.Round((valor * 100.0) / 4095);

            string mensagem = $"{{\"valortrimpot\": {valor}, \"valorenviado\": {valor}, \"porcentagem\": {porcentagem}}}\n";

            byte[] dados = Encoding.UTF8.GetBytes(mensagem);
            stream.Write(dados, 0, dados.Length);

            Console.WriteLine($"Enviado: {mensagem.Trim()}");

            Thread.Sleep(250);
        }
    }
}