
from pathlib import Path

path = Path("c:/Users/paparinots/Documents/Kabbalah/transcripciones/arbol_vida")
print(f"Path exists: {path.exists()}")

files_index = list(path.glob("001_*"))
print(f"Files starting with 001_: {len(files_index)}")
for f in files_index:
    print(f" - {f.name} (Suffix: {f.suffix})")

print("Checking specific file:")
specific = path / "001_Kabbalah： Los secretos del árbol de la vida - clase 1.es.json3"
print(f" Specific exists: {specific.exists()}")
