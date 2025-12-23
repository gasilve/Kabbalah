"""
Revelations Extractor - Extrae secretos y revelaciones místicas del Zohar

Identifica enseñanzas profundas y secretos revelados en las clases
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Configurar cliente IA
PROVIDER = os.getenv('AI_PROVIDER', 'deepseek')
if PROVIDER == 'deepseek':
    client = OpenAI(
        api_key=os.getenv('DEEPSEEK_API_KEY', 'sk-63a73a89f00d4151a76213c00dd6d69a'),
        base_url="https://api.deepseek.com"
    )
    MODEL = "deepseek-chat"
else:
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    MODEL = "gpt-4o-mini"

SYSTEM_PROMPT = """Eres un experto en Kabbalah y el Zohar. Analiza transcripciones e identifica REVELACIONES y SECRETOS místicos.

Busca:
1. Frases como "El secreto es...", "La revelación de...", "El misterio oculto..."
2. Interpretaciones místicas de versículos bíblicos
3. Conexiones ocultas en la Torah
4. Significados profundos de letras, números, nombres
5. Enseñanzas sobre la estructura de realidad/creación

Clasifica por nivel:
- principiante: Conceptos básicos, fácilmente comprensibles
- intermedio: Requiere conocimiento de Kabbalah
- avanzado: Conceptos profundos, múltiples capas de significado

Devuelve JSON:
{
  "revelations": [
    {
      "title": "El Secreto de la Rosa",
      "revelation": "La rosa representa...",
      "parasha": "Bereshit",
      "level": "intermedio",
      "themes": ["misericordia", "pueblo de Israel"],
      "biblical_ref": "Génesis 1:1",
      "video_id": "abc123",
      "timestamp": 450.5
    }
  ]
}
"""

def extract_revelations_from_transcript(transcript_file: Path) -> Dict[str, Any]:
    """Extrae revelaciones de un archivo de transcripción"""
    
    with open(transcript_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    metadata = data.get('metadata', {})
    transcript = data.get('transcript', [])
    
    # Crear texto completo
    text = " ".join([seg.get('text', '') for seg in transcript[:150]])  # Más contexto
    
    prompt = f"""Analiza y extrae REVELACIONES MÍSTICAS y SECRETOS del Zohar.

Título: {metadata.get('video_title', 'Unknown')}
Video ID: {metadata.get('video_id', 'unknown')}

Texto: {text[:4000]}

Identifica secretos revelados y explícalos en JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4  # Un poco más creativo
        )
        
        content = response.choices[0].message.content
        
        # Limpiar JSON
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        result = json.loads(content.strip())
        
        # Agregar metadata
        for rev in result.get('revelations', []):
            rev['video_id'] = metadata.get('video_id', 'unknown')
            rev['video_title'] = metadata.get('video_title', 'Unknown')
            rev['source'] = 'Zohar'
        
        return result
        
    except Exception as e:
        print(f"Error processing {transcript_file.name}: {e}")
        return {"revelations": []}

def process_all_transcripts(input_dir: str, output_file: str):
    """Procesa todas las transcripciones y genera DB de revelaciones"""
    
    input_path = Path(input_dir)
    all_revelations = []
    
    json_files = list(input_path.glob("*.json"))
    
    print(f"Encontrados {len(json_files)} archivos")
    print("Procesando con IA...")
    
    for i, file in enumerate(json_files[:10], 1):  # Limitar a 10
        print(f"[{i}/10] {file.name}")
        
        result = extract_revelations_from_transcript(file)
        revelations = result.get('revelations', [])
        
        all_revelations.extend(revelations)
        print(f"  Extraídas: {len(revelations)} revelaciones")
        
        import time
        time.sleep(2)
    
    # Organizar por Parashá
    by_parasha = {}
    for rev in all_revelations:
        parasha = rev.get('parasha', 'General')
        if parasha not in by_parasha:
            by_parasha[parasha] = []
        by_parasha[parasha].append(rev)
    
    # Guardar resultado
    output_data = {
        "total_revelations": len(all_revelations),
        "by_parasha": by_parasha,
        "by_level": {
            "principiante": len([r for r in all_revelations if r.get('level') == 'principiante']),
            "intermedio": len([r for r in all_revelations if r.get('level') == 'intermedio']),
            "avanzado": len([r for r in all_revelations if r.get('level') == 'avanzado']),
        },
        "revelations": all_revelations
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nGuardado en: {output_file}")
    print(f"Total revelaciones: {len(all_revelations)}")
    print(f"Por nivel: {output_data['by_level']}")
    print(f"Parashat: {list(by_parasha.keys())}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', default='transcripciones/Secretos_del_Zohar',
                       help='Directorio de transcripciones')
    parser.add_argument('--output', default='kabbalah-app/data/revelations_db.json',
                       help='Archivo de salida')
    
    args = parser.parse_args()
    
    process_all_transcripts(args.input, args.output)
