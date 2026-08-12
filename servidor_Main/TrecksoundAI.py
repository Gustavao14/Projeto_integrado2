import os
from flask import Flask, jsonify, request
from sklearn.datasets import load_iris
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier


app = Flask(__name__)
PASTA_AUDIOS = "./DATASET_IA"

async def trecksound():

    @app.route("/treinar", methods=["POST"])
    def receber_e_treinar():

        if "audio" not in request.files or "genero" not in request.form:
            return jsonify({"erro": "Dados ausentes"}), 400

        audio = request.files["audio"]
        genero = request.form["genero"]

        # Salva o arquivo enviado pelo Node.js
        pasta_genero = os.path.join(PASTA_AUDIOS, genero)
        os.makedirs(pasta_genero, exist_ok=True)

        audio.save(os.path.join(pasta_genero, audio.filename))

        return jsonify({"status": "Áudio recebido com sucesso!"}), 200

    iris = load_iris()

    X = iris.data
    y = iris.target

    X_treino, X_teste, y_treino, y_teste = train_test_split(
        X,
        y,
        test_size=0.2
    )

    modelo = DecisionTreeClassifier()

    modelo.fit(X_treino, y_treino)

    predicoes = modelo.predict(X_teste)

    acuracia = accuracy_score(y_teste, predicoes)

    print(f"Prova da IA: {acuracia * 100:.2f}%")

    app.run(port=3000)