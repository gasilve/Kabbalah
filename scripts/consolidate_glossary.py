import json
import os

# Paths
OUTPUT_FILE = "kabbalah-app/data/glossary.json"

CORE_TERMS = [
    {"termino": "Keter", "hebreo": "כתר", "definicion": "Corona. La primera Sefirá, que representa la voluntad divina.", "fuente": "Fundamentos"},
    {"termino": "Jojmá", "hebreo": "חוכמה", "definicion": "Sabiduría. El potencial puro del pensamiento.", "fuente": "Fundamentos"},
    {"termino": "Biná", "hebreo": "בינה", "definicion": "Entendimiento. El procesamiento de la sabiduría en formas comprensibles.", "fuente": "Fundamentos"},
    {"termino": "Jesed", "hebreo": "חסד", "definicion": "Misericordia. Bondad infinita y expansión.", "fuente": "Fundamentos"},
    {"termino": "Guevurá", "hebreo": "גבורה", "definicion": "Fuerza. Disciplina, juicio y restricción.", "fuente": "Fundamentos"},
    {"termino": "Tiferet", "hebreo": "תפארת", "definicion": "Belleza. Harmonía y equilibrio entre Jesed y Guevurá.", "fuente": "Fundamentos"},
    {"termino": "Netsaj", "hebreo": "נצח", "definicion": "Victoria. Persistencia y eternidad.", "fuente": "Fundamentos"},
    {"termino": "Hod", "hebreo": "הוד", "definicion": "Esplendor. Humildad y sumisión al flujo divino.", "fuente": "Fundamentos"},
    {"termino": "Yesod", "hebreo": "יסוד", "definicion": "Fundamento. El canal que conecta las sefirot superiores con la tierra.", "fuente": "Fundamentos"},
    {"termino": "Maljut", "hebreo": "מלכות", "definicion": "Reino. La manifestación física y receptáculo de la luz.", "fuente": "Fundamentos"},
    {"termino": "Ein Sof", "hebreo": "אין סוף", "definicion": "Sin Fin. La esencia infinita de Dios antes de la creación.", "fuente": "Fundamentos"},
    {"termino": "Tzimtzum", "hebreo": "צמצום", "definicion": "Contracción. El acto por el cual Dios 'hizo espacio' para el universo.", "fuente": "Fundamentos"},
    {"termino": "Shejiná", "hebreo": "שכינה", "definicion": "Presencia. La presencia divina inmanente en el mundo.", "fuente": "Fundamentos"}
]

def main():
    print("🔄 Consolidating glossary terms...")
    
    concepts = {}
    
    # 1. Add core terms
    for term in CORE_TERMS:
        concepts[term['termino'].lower()] = term
        
    # 2. Add from content.json
    try:
        with open("kabbalah-app/data/content.json", 'r', encoding='utf-8') as f:
            data = json.load(f)
            for c in data.get('conceptos_diccionario', []):
                concepts[c['termino'].lower()] = {
                    "termino": c['termino'],
                    "hebreo": c.get('hebreo', ''),
                    "definicion": c.get('definicion', ''),
                    "explicacion": c.get('explicacion', c.get('definicion', '')),
                    "fuente": "Directo"
                }
    except: pass
        
    # 3. Add from zohar_db.json
    try:
        with open("kabbalah-app/data/zohar_db.json", 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data.get('items', []):
                for c in item.get('conceptos', []):
                    term = c['termino']
                    if term.lower() not in concepts:
                        concepts[term.lower()] = {
                            "termino": term,
                            "hebreo": c.get('hebreo', ''),
                            "definicion": c.get('definicion', ''),
                            "fuente": item.get('metadata', {}).get('titulo', 'Zohar')
                        }
    except: pass
        
    # Sort
    sorted_concepts = sorted(concepts.values(), key=lambda x: x['termino'])
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(sorted_concepts, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Consolidated {len(sorted_concepts)} terms.")

if __name__ == "__main__":
    main()
