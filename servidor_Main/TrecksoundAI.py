import math

# ============================================================
# DATASET
# ============================================================
#
#   energia      -> de 1 (bem lenta) ate 5 (bem agitada)
#   instrumento  -> violao, piano, guitarra, eletronico, percussao, voz
#   clima        -> relaxar, festa, romantico, animado, triste
#   estilo       -> o "rotulo" da musica (varias musicas podem ter o mesmo)

MUSICAS = [
    {"id": 1,  "nome": "Manha de Vidro",      "energia": 1, "instrumento": "violao",     "clima": "relaxar",   "estilo": "acustica"},
    {"id": 2,  "nome": "Neon Boulevard",      "energia": 5, "instrumento": "eletronico", "clima": "festa",     "estilo": "dancante"},
    {"id": 3,  "nome": "Carta Nunca Enviada", "energia": 2, "instrumento": "piano",      "clima": "romantico", "estilo": "romantica"},
    {"id": 4,  "nome": "Asfalto Quente",      "energia": 5, "instrumento": "guitarra",   "clima": "animado",   "estilo": "rock"},
    {"id": 5,  "nome": "Domingo Devagar",     "energia": 2, "instrumento": "violao",     "clima": "relaxar",   "estilo": "acustica"},
    {"id": 6,  "nome": "Batida do Bairro",    "energia": 4, "instrumento": "percussao",  "clima": "festa",     "estilo": "dancante"},
    {"id": 7,  "nome": "Ultimo Trem",         "energia": 1, "instrumento": "piano",      "clima": "triste",    "estilo": "melancolica"},
    {"id": 8,  "nome": "Verao 22",            "energia": 4, "instrumento": "voz",        "clima": "animado",   "estilo": "pop"},
    {"id": 9,  "nome": "Fita Cassete",        "energia": 3, "instrumento": "guitarra",   "clima": "animado",   "estilo": "rock"},
    {"id": 10, "nome": "Cafe as Seis",        "energia": 3, "instrumento": "voz",        "clima": "romantico", "estilo": "romantica"},
]

# ============================================================

# 3 vizinhos mais proximos
K = 3

def calcular_distancia(energia, instrumento, clima, musica):
    # energia max - min = 4.
    dist_energia = abs(energia - musica["energia"]) / 4

    # Instrumento e texto: ou e igual (0) ou e diferente (1).
    if instrumento == musica["instrumento"]:
        dist_instrumento = 0
    else:
        dist_instrumento = 1

    # Clima funciona do mesmo jeito.
    if clima == musica["clima"]:
        dist_clima = 0
    else:
        dist_clima = 1

    # Pitagoras
    soma = dist_energia ** 2 + dist_instrumento ** 2 + dist_clima ** 2
    return math.sqrt(soma)

def buscar_vizinhos(energia, instrumento, clima):
    lista = []

    # Calcula a distancia ate TODAS as musicas
    for musica in MUSICAS:
        distancia = calcular_distancia(energia, instrumento, clima, musica)
        lista.append([distancia, musica["id"], musica["nome"], musica["estilo"]])

    # Ordena da menor distancia para a maior.
    lista.sort()

    # Devolve so os K primeiros
    return lista[:K]

def estilo_mais_votado(vizinhos):
    contagem = {}

    for vizinho in vizinhos:
        estilo = vizinho[3]
        if estilo in contagem:
            contagem[estilo] = contagem[estilo] + 1
        else:
            contagem[estilo] = 1

    # Procura o estilo com mais votos
    estilo_vencedor = ""
    mais_votos = 0
    for estilo in contagem:
        if contagem[estilo] > mais_votos:
            mais_votos = contagem[estilo]
            estilo_vencedor = estilo

    return estilo_vencedor

def recomendar(energia, instrumento, clima):
    vizinhos = buscar_vizinhos(energia, instrumento, clima)
    vencedor = estilo_mais_votado(vizinhos)

    # Entre os vizinhos, pega o primeiro do estilo vencedor.
    for vizinho in vizinhos:
        if vizinho[3] == vencedor:
            return vizinho[1]   # posicao 1 da lista = id da musica

    return vizinhos[0][1]  # seguranca: se algo der errado, toca a mais proxima

# ============================================================
# PERGUNTAS
# ============================================================

def perguntar_numero(texto):
    while True:
        resposta = input(texto)
        if resposta.isdigit() and 1 <= int(resposta) <= 5:
            return int(resposta)
        print("  Digite um numero de 1 a 5.")


def perguntar_opcao(texto, opcoes):
    print(texto)
    for i in range(len(opcoes)):
        print("  " + str(i + 1) + " - " + opcoes[i])

    while True:
        resposta = input("Escolha: ")
        if resposta.isdigit() and 1 <= int(resposta) <= len(opcoes):
            return opcoes[int(resposta) - 1]
        print("  Opcao invalida, tente de novo.")

# ============================================================

def main():
    print("=" * 45)
    print("       RADIO INTELIGENTE")
    print("=" * 45)

    print("\n1) De 1 a 5, o quanto voce quer uma musica agitada?")
    print("   (1 = bem lenta / 5 = pra dancar)")
    energia = perguntar_numero("Resposta: ")

    instrumento = perguntar_opcao(
        "\n2) Qual som combina mais com voce agora?",
        ["violao", "piano", "guitarra", "eletronico", "percussao", "voz"]
    )

    clima = perguntar_opcao(
        "\n3) Que clima voce quer?",
        ["relaxar", "festa", "romantico", "animado", "triste"]
    )

    vizinhos = buscar_vizinhos(energia, instrumento, clima)
    print("\n--- Os " + str(K) + " vizinhos mais proximos ---")
    for vizinho in vizinhos:
        print("  distancia " + str(round(vizinho[0], 2)) + "  ->  " + vizinho[2] + " (" + vizinho[3] + ")")

    print("\nEstilo mais votado: " + estilo_mais_votado(vizinhos))

    id_escolhido = recomendar(energia, instrumento, clima)
    for musica in MUSICAS:
        if musica["id"] == id_escolhido:
            print("\n>>> TOCAR AGORA: ID " + str(musica["id"]) + " - " + musica["nome"])

if __name__ == "__main__":
    main()