"""
QA Extractor - Extrae preguntas y respuestas de transcripciones de videos

Identifica patrones de Q&A en las clases y las estructura para la app
"""

import os
import json
import re
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

SYSTEM_PROMPT = """Eres un experto en Kabbalah. Analiza transcripciones y extrae preguntas y respuestas.

Categorías de Q&A:
1. Conceptos de Kabbalah (definiciones, explicaciones)
2. Prácticas de meditación (cómo meditar, cuándo hacerlo)
3. Interpretación del Zohar (significados ocultos)
4. Vida cotidiana (aplicación práctica)
5. Leyes y costumbres (Kashrut, Shabat, festividades)

Devuelve JSON con estructura:
{
  "qa_pairs": [
    {
      "question": "¿Qué es la Sefirá de Keter?",
      "answer": "Keter es la primera Sefirá...",
      "category": "Conceptos de Kabbalah",
      "video_id": "abc123",
      "timestamp": 450.5,
      "keywords": ["Keter", "Sefirot", "Corona"]
    }
  ]
}
"""

def extract_qa_from_transcript(transcript_file: Path) -> Dict[str, Any]:
    """Extrae Q&A de un archivo de transcripción"""
    
    with open(transcript_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    metadata = data.get('metadata', {})
    transcript = data.get('transcript', [])
    
    # Crear texto completo
    text = " ".join([seg.get('text', '') for seg in transcript[:100]])  # Primeros 100 segmentos
    
    prompt = f"""Analiza esta transcripción y extrae preguntas y respuestas explícitas o implícitas.

Título: {metadata.get('video_title', 'Unknown')}
Video ID: {metadata.get('video_id', 'unknown')}

Texto: {text[:3000]}

Extrae Q&A pairs en JSON."""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        content = response.choices[0].message.content
        
        # Limpiar JSON si viene con markdown
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        result = json.loads(content.strip())
        
        # Agregar metadata
        for qa in result.get('qa_pairs', []):
            qa['video_id'] = metadata.get('video_id', 'unknown')
            qa['video_title'] = metadata.get('video_title', 'Unknown')
        
        return result
        
    except Exception as e:
        print(f"Error processing {transcript_file.name}: {e}")
        return {"qa_pairs": []}

def process_all_transcripts(input_dir: str, output_file: str):
    """Procesa todas las transcripciones y genera DB de Q&A"""
    
    input_path = Path(input_dir)
    all_qa = []
    
    # Buscar archivos JSON
    json_files = list(input_path.glob("*.json"))
    
    print(f"Encontrados {len(json_files)} archivos")
    print("Procesando con IA...")
    
    for i, file in enumerate(json_files[:10], 1):  # Limitar a 10 por ahora
        print(f"[{i}/10] {file.name}")
        
        result = extract_qa_from_transcript(file)
        qa_pairs = result.get('qa_pairs', [])
        
        all_qa.extend(qa_pairs)
        print(f"  Extraídos: {len(qa_pairs)} Q&A pairs")
        
        # Pausa entre requests
        import time
        time.sleep(2)
    
    # Guardar resultado
    output_data = {
        "total_qa": len(all_qa),
        "categories": {},
        "qa_pairs": all_qa
    }
    
    # Contar por categoría
    for qa in all_qa:
        cat = qa.get('category', 'Otros')
        output_data['categories'][cat] = output_data['categories'].get(cat, 0) + 1
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nGuardado en: {output_file}")
    print(f"Total Q&A: {len(all_qa)}")
    print(f"Categorías: {output_data['categories']}")

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', default='transcripciones/Secretos_del_Zohar',
                       help='Directorio de transcripciones')
    parser.add_argument('--output', default='kabbalah-app/data/qa_database.json',
                       help='Archivo de salida')
    
    args = parser.parse_args()
    
    process_all_transcripts(args.input, args.output)
