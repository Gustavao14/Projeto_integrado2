from sklearn.tree import DecisionTreeClassifier 
from sklearn.datasets import load_iris 
from sklearn.model_selection import train_test_split \
from enviarDatasetPorGenero import CsvHelper
from sklearn.metrics import accuracy_score 

iris = load_iris()
X = iris.data
y = iris.target

X_treino, X_teste, y_treino, y_teste = train_teste_split(X, y, teste_size = 0.2)

modelo = DecisionTreeClassifier()
modelo.fit(X_treino, y_treino)

predicoes = modelo. predict(X_teste)

acuracia = accuracy_score(y_teste, predicoes)
print(f"Prova da IA:{acuracia * 100:.2f}% ")