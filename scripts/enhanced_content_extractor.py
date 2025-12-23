"""
Enhanced Content Extractor - Versión completa con resumen de clase, meditaciones, glosario y Q&A temático

Este script procesa transcripciones de videos y extrae:
1. RESUMEN DE CLASE - Explicación "premasticada" de lo que enseña el rabino
2. MEDITACIONES por INTENCIÓN - Buscables por propósito (salud, amor, prosperidad, etc.)
3. GLOSARIO DE SÍMBOLOS - Símbolos del Zohar (rosa, burro, vino, etc.)
4. Q&A TEMÁTICO - Preguntas categorizadas por temas y problemas
"""

import os
import json
import time
from typing import Dict, List, Any
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
import argparse

load_dotenv()

# Configuración para servidor Ollama remoto
OLLAMA_HOST = os.getenv('OLLAMA_HOST', '192.168.100.21')
OLLAMA_USER = os.getenv('OLLAMA_USER', 'willy')
OLLAMA_PASSWORD = os.getenv('OLLAMA_PASSWORD', 'Passw0rd')
OLLAMA_PORT = os.getenv('OLLAMA_PORT', '11434')
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.1:8b')

# Cliente OpenAI compatible (Ollama usa la misma API)
client = OpenAI(
    api_key="ollama",  # Ollama no requiere key real
    base_url=f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/v1"
)

# Directorios
OUTPUT_DIR = Path("contenido_procesado")
OUTPUT_DIR.mkdir(exist_ok=True)

SYSTEM_PROMPT = """Eres un experto rabino y maestro de Kabbalah que analiza clases del Zohar.

Tu trabajo es extraer TODO el conocimiento de la clase de forma estructurada para que los estudiantes puedan:
1. Entender rápidamente de qué trata la clase (resumen)
2. Encontrar meditaciones por su intención/propósito
3. Aprender símbolos del Zohar y su significado
4. Buscar respuestas a preguntas específicas sobre conceptos

Devuelve SOLO JSON válido sin explicaciones adicionales."""

EXTRACTION_PROMPT = """Analiza esta transcripción de una clase del Zohar y extrae el contenido de forma EXHAUSTIVA.

TÍTULO: {title}
DURACIÓN: {duration} minutos
VIDEO ID: {video_id}

TRANSCRIPCIÓN:
{transcript_text}

Extrae y devuelve un JSON con esta estructura EXACTA:

{{
  "resumen_clase": {{
    "titulo": "{title}",
    "video_id": "{video_id}",
    "duracion_minutos": {duration},
    "resumen_breve": "Resumen de 2-3 oraciones de lo que enseña el rabino en esta clase",
    "resumen_detallado": "Explicación completa de 2-3 párrafos con las enseñanzas principales",
    "temas_principales": ["tema1", "tema2", "tema3"],
    "parasha_relacionada": "Nombre de la Parashá si se menciona, sino 'General'",
    "nivel_dificultad": "principiante|intermedio|avanzado"
  }},
  
  "meditaciones": [
    {{
      "titulo": "Nombre descriptivo de la meditación",
      "descripcion": "Qué hace esta meditación y para qué sirve",
      "instrucciones_completas": "Paso a paso COMPLETO de cómo realizar la meditación",
      "timestamp_inicio": 0.0,
      "timestamp_fin": 0.0,
      "intenciones": ["salud", "proteccion", "prosperidad", "amor", "sabiduria", "paz", "familia", "fertilidad"],
      "nombres_divinos": {{
        "nombre_hebreo": "מטטרון",
        "transliteracion": "Metatron",
        "pronunciacion": "Me-ta-tron",
        "significado": "Qué significa este nombre",
        "cuando_usar": "En qué situaciones invocar este nombre"
      }},
      "visualizaciones": ["Descripción de visualizaciones a realizar"],
      "duracion_sugerida": "5 minutos"
    }}
  ],
  
  "glosario_simbolos": [
    {{
      "simbolo": "Rosa",
      "hebreo": "שושנה",
      "transliteracion": "Shoshana",
      "significado_literal": "Flor rosa",
      "significado_mistico": "Representa al Pueblo de Israel, la Shejiná, tiene 13 pétalos que simbolizan los 13 atributos de misericordia",
      "contexto_en_clase": "Dónde y cómo se menciona en esta clase específica",
      "referencias_biblicas": ["Cantar de los Cantares 2:2"],
      "temas_relacionados": ["misericordia", "pueblo de Israel", "Shejiná"]
    }}
  ],
  
  "preguntas_respuestas": [
    {{
      "pregunta": "¿Qué significa X concepto?",
      "respuesta": "Explicación clara y completa basada en lo que dice el rabino",
      "categoria": "Conceptos de Kabbalah|Práctica|Vida cotidiana|Festividades|Símbolos del Zohar",
      "problemas_que_resuelve": ["orgullo", "envidia", "duda", "miedo", "etc"],
      "conceptos_clave": ["becerro de oro", "amar al prójimo", "etc"],
      "timestamp": 120.5,
      "nivel": "principiante|intermedio|avanzado",
      "keywords": ["palabra1", "palabra2"]
    }}
  ],
  
  "revelaciones_secretos": [
    {{
      "titulo": "El Secreto de...",
      "revelacion": "Explicación del secreto revelado",
      "nivel_profundidad": "principiante|intermedio|avanzado",
      "timestamp": 450.5,
      "temas": ["tema1", "tema2"]
    }}
  ],
  
  "nombres_divinos_mencionados": [
    {{
      "nombre_hebreo": "יהוה",
      "transliteracion": "YHVH",
      "pronunciacion_kabbalistica": "Yud-Hei-Vav-Hei",
      "significado": "El nombre impronunciable",
      "poder": "Qué poder tiene este nombre",
      "contexto": "Cómo se usa en la clase"
    }}
  ],
  
  "letras_hebreas": [
    {{
      "letra": "א",
      "nombre": "Alef",
      "valor_gematria": 1,
      "significado_literal": "Buey",
      "significado_mistico": "Unidad divina, maestro",
      "contexto_en_clase": "Cómo se explica en esta clase"
    }}
  ],
  
  "conceptos_kabbalah": [
    {{
      "concepto": "Nombre del concepto",
      "hebreo": "Hebreo (si hay)",
      "definicion": "Definición breve",
      "explicacion_detallada": "Explicación detallada extraída del video",
      "como_aplicar": "Aplicación práctica mencionada"
    }}
  ],
  
  "referencias_biblicas": [
    {{
      "cita": "Libro Capitulo:Versiculo",
      "texto_hebreo": "",
      "traduccion": "",
      "interpretacion_zohar": ""
    }}
  ],

  "oraciones": [
    {{
      "titulo": "Nombre de la oración",
      "texto_hebreo": "",
      "traduccion": "",
      "proposito": "Propósito mencionado"
    }}
  ]
}}

INSTRUCCIONES CRÍTICAS DE CALIDAD:
- NO INVENTES NADA. Si no se menciona en el texto, NO lo incluyas.
- NO devuelvas las oraciones/ejemplos del prompt (como "Ana Bejoaj") a menos que se mencionen EXPLÍCITAMENTE en el video.
- Si una categoría está vacía, devuelve una lista vacía [], NO un objeto con cadenas vacías.
- Para 'oraciones', solo incluye si el rabino recita o enseña una oración específica.
- Para 'nombres_divinos', solo incluye los que se mencionen o visualicen explícitamente.
- Extrae TODO el contenido relevante, pero sé fiel a la fuente.
"""

def load_transcription(json_path: Path) -> Dict[str, Any]:
    """Carga una transcripción desde JSON y normaliza metadata"""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Detector de formato json3 / raw chat (YouTube)
    if 'wireMagic' in data and 'events' in data:
        transcript = []
        for event in data.get('events', []):
            if 'segs' in event:
                start_ms = event.get('tStartMs', 0)
                text = "".join([seg.get('utf8', '') for seg in event['segs']])
                if text.strip():
                    transcript.append({
                        'start': start_ms / 1000.0,
                        'text': text
                    })
        
        # Inferir metadata
        return {
            'metadata': {
                'video_title': json_path.stem,
                'video_id': 'unknown',
                'duration_minutes': transcript[-1]['start'] / 60 if transcript else 0,
                'total_words': sum(len(s['text'].split()) for s in transcript)
            },
            'transcript': transcript
        }
    
    # Soporte para Whisper JSON puro (solo 'text' y 'segments')
    if 'segments' in data and 'text' in data and 'metadata' not in data:
        transcript = []
        for seg in data['segments']:
            transcript.append({
                'start': seg.get('start', 0),
                'text': seg.get('text', '').strip()
            })
        
        # Construir estructura completa
        return {
            'metadata': {
                'video_title': json_path.stem,
                'video_id': 'whisper_generated',
                'duration_minutes': transcript[-1]['start'] / 60 if transcript else 0,
                'total_words': sum(len(s['text'].split()) for s in transcript)
            },
            'transcript': transcript
        }
            
    # Soporte para Whisper JSON con metadata parcial
    if 'segments' in data and 'transcript' not in data:
        transcript = []
        for seg in data['segments']:
            transcript.append({
                'start': seg.get('start', 0),
                'text': seg.get('text', '').strip()
            })
        
        # Inferir metadata si no existe
        if 'metadata' not in data:
             data['metadata'] = {
                 'video_title': json_path.stem,
                 'video_id': 'whisper_generated',
                 'duration_minutes': transcript[-1]['start'] / 60 if transcript else 0,
                 'total_words': sum(len(s['text'].split()) for s in transcript)
             }
        
        data['transcript'] = transcript
        return data

    return data

def create_transcript_text(transcript_data: List[Dict]) -> str:
    """Convierte segmentos de transcripción a texto continuo con timestamps"""
    lines = []
    for segment in transcript_data:
        timestamp = f"[{int(segment['start'] // 60):02d}:{int(segment['start'] % 60):02d}]"
        lines.append(f"{timestamp} {segment['text']}")
    return "\n".join(lines)

def extract_enhanced_content(transcription: Dict[str, Any]) -> Dict[str, Any]:
    """Extrae contenido enriquecido con IA"""
    
    metadata = transcription['metadata']
    transcript_data = transcription['transcript']
    
    # Crear texto de transcripción
    transcript_text = create_transcript_text(transcript_data)
    
    # Limitar a ~15000 palabras
    words = transcript_text.split()
    if len(words) > 15000:
        transcript_text = ' '.join(words[:15000]) + "\n\n[TRANSCRIPCIÓN TRUNCADA...]"
    
    # Crear prompt
    prompt = EXTRACTION_PROMPT.format(
        title=metadata['video_title'],
        video_id=metadata['video_id'],
        duration=metadata['duration_minutes'],
        transcript_text=transcript_text
    )
    
    print(f"\n🤖 Procesando: {metadata['video_title'][:60]}...")
    print(f"   📊 {metadata['total_words']} palabras, {metadata['duration_minutes']:.1f} min")
    
    try:
        response = client.chat.completions.create(
            model=OLLAMA_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=8000  # Permitir respuestas largas
        )
        
        content = response.choices[0].message.content
        
        # Limpiar JSON si viene con markdown
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        elif "```" in content:
            content = content.split("```")[1].split("```")[0]
        
        result = json.loads(content.strip())
        
        # Estadísticas
        stats = {
            'meditaciones': len(result.get('meditaciones', [])),
            'simbolos': len(result.get('glosario_simbolos', [])),
            'qa': len(result.get('preguntas_respuestas', [])),
            'revelaciones': len(result.get('revelaciones_secretos', [])),
            'oraciones': len(result.get('oraciones', []))
        }
        
        print(f"   ✓ {stats['meditaciones']} meditaciones | "
              f"{stats['simbolos']} símbolos | "
              f"{stats['qa']} Q&A | "
              f"{stats['revelaciones']} revelaciones | "
              f"{stats['oraciones']} oraciones")
        
        return result
        
    except Exception as e:
        print(f"   ✗ Error: {str(e)}")
        return None

def process_video(json_file: Path) -> Dict[str, Any]:
    """Procesa un video completo"""
    
    print(f"\n{'='*70}")
    print(f"📹 {json_file.stem}")
    print(f"{'='*70}")
    
    # Verificar si ya existe
    output_file = OUTPUT_DIR / f"{json_file.stem}_enhanced.json"
    if output_file.exists():
        print(f"   ⏭️  Ya procesado (saltando): {output_file.name}")
        return None
    
    # Cargar transcripción
    transcription = load_transcription(json_file)
    
    # Extraer contenido
    extracted = extract_enhanced_content(transcription)
    
    if extracted:
        # Agregar metadata
        extracted['source_file'] = str(json_file)
        extracted['processed_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
        
        # Guardar resultado
        output_file = OUTPUT_DIR / f"{json_file.stem}_enhanced.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(extracted, f, ensure_ascii=False, indent=2)
        
        print(f"   💾 Guardado: {output_file.name}")
        return extracted
    
    return None

def process_directory(input_dir: str, limit: int = None):
    """Procesa todos los archivos JSON en un directorio"""
    
    print(f"""
╔════════════════════════════════════════════════════════════════╗
║  EXTRACTOR DE CONTENIDO ENRIQUECIDO                            ║
║  Servidor Ollama: {OLLAMA_HOST}:{OLLAMA_PORT}
║  Modelo: {OLLAMA_MODEL}
╚════════════════════════════════════════════════════════════════╝
    """)
    
    input_path = Path(input_dir)
    json_files = sorted(list(input_path.glob("*.json")) + list(input_path.glob("*.json3")))
    json_files = [f for f in json_files if not f.name.startswith('_')]
    
    if limit:
        json_files = json_files[:limit]
    
    print(f"\n📊 Videos a procesar: {len(json_files)}")
    
    # Test de conexión
    try:
        print(f"\n🔌 Probando conexión con Ollama en {OLLAMA_HOST}...")
        test_response = client.chat.completions.create(
            model=OLLAMA_MODEL,
            messages=[{"role": "user", "content": "Test"}],
            max_tokens=10
        )
        print(f"   ✓ Conexión exitosa con modelo {OLLAMA_MODEL}")
    except Exception as e:
        print(f"   ✗ ERROR de conexión: {e}")
        print(f"\nVerifica que Ollama esté corriendo en {OLLAMA_HOST}:{OLLAMA_PORT}")
        return
    
    results = []
    successful = 0
    failed = 0
    start_time = time.time()
    
    for idx, json_file in enumerate(json_files, 1):
        print(f"\n[{idx}/{len(json_files)}]")
        
        result = process_video(json_file)
        
        if result:
            results.append(result)
            successful += 1
        else:
            failed += 1
        
        # Pausa entre requests
        if idx < len(json_files):
            time.sleep(1)
    
    # Resumen
    elapsed = (time.time() - start_time) / 60
    
    print(f"\n\n{'='*70}")
    print(f"{'  RESUMEN FINAL  ':^70}")
    print(f"{'='*70}")
    print(f"✓  Exitosos: {successful}")
    print(f"✗  Fallidos: {failed}")
    print(f"⏱️  Tiempo: {elapsed:.1f} minutos")
    print(f"💾 Guardados en: {OUTPUT_DIR.absolute()}")
    print(f"{'='*70}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Extractor de contenido enriquecido')
    parser.add_argument('--input', type=str, required=True,
                       help='Directorio con archivos JSON de transcripciones')
    parser.add_argument('--limit', type=int, default=None,
                       help='Límite de archivos a procesar (para pruebas)')
    
    args = parser.parse_args()
    
    process_directory(args.input, args.limit)
