# -*- coding: utf-8 -*-
"""
Script de Extracción de Contenido con IA
Procesa transcripciones de videos y extrae contenido estructurado

Soporta:
- DeepSeek (GRATIS) - Recomendado
- OpenAI GPT-4 (Pago, ~$0.01 por video)

Este script analiza los videos del Zohar y extrae:
- Oraciones y meditaciones
- Nombres divinos (72 nombres, Metatron, etc.)
- Letras hebreas y gematria
- Conceptos kabbalísticos
- Categorización por intenciones
"""

import sys
import os

# Configuración de encoding UTF-8 para Windows (Simplificado)
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

import os
import json
import time
import os
import sys
print(f"DEBUG: Starting script PID {os.getpid()}")
from typing import Dict, List, Any, Optional
print("DEBUG: Importing openai...")
from openai import OpenAI
print("DEBUG: Importing pathlib...")
from pathlib import Path
print("DEBUG: Importing dotenv...")
from dotenv import load_dotenv
print("DEBUG: Imports complete.")

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de proveedores
PROVIDER = os.getenv('AI_PROVIDER', 'ollama')  # 'deepseek' o 'openai' o 'ollama'

# Inicializar clientes
if PROVIDER == 'deepseek':
    client = OpenAI(
        api_key=os.getenv('DEEPSEEK_API_KEY', 'sk-63a73a89f00d4151a76213c00dd6d69a'),
        base_url="https://api.deepseek.com"
    )
    MODEL = "deepseek-chat"
    print("[FREE] Usando DeepSeek (GRATIS)")
elif PROVIDER == 'ollama':
    client = OpenAI(
        api_key="ollama", # Ollama doesn't require a key, but client needs one
        base_url="http://192.168.100.21:11434/v1"
    )
    MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2:3b')
    print(f"[OLLAMA] Usando Ollama en {client.base_url} con modelo {MODEL}")
else:
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    MODEL = "gpt-4o-mini"  # Modelo económico disponible en free tier
    print("[PAID] Usando OpenAI GPT-4o-mini (Free Tier: $5 gratis)")

# Aumentar timeout global
client.timeout = 1200.0  # 20 minutos para videos largos

# Directorios base
# Directorios base (ajustado para correr desde scripts/)
OUTPUT_DIR = Path("contenido_procesado")
OUTPUT_DIR.mkdir(exist_ok=True)

# Configuración por playlist
PLAYLIST_CONFIG = {
    'secretos_zohar': {
        'dir': 'transcripciones/secretos_zohar',
        'prompt': """Eres un experto en Kabbalah y análisis del Zohar. Extrae:
1. MEDITACIONES GUIADAS con nombres divinos y visualizaciones
2. NOMBRES DIVINOS en hebreo y transliteración
3. LETRAS HEBREAS con gematria y significado místico
4. CONCEPTOS kabbalísticos con definiciones
5. VOCABULARIO DEL ZOHAR (símbolos: rosa, serpiente, agua, fuego, etc. con significado místico)
6. PREGUNTAS Y RESPUESTAS pedagógicas del maestro/estudiantes
7. ENSEÑANZAS/REVELACIONES importantes explicadas detalladamente
8. INTENCIONES (salud, prosperidad, protección, amor, sabiduría, conexión)
9. ORACIONES con propósito"""
    },
    'arbol_vida': {
        'dir': 'transcripciones/arbol_vida',
        'prompt': """Eres un experto en Kabbalah y el Árbol de la Vida (Sefirot). Extrae:
1. SEFIROT mencionadas (nombre, nivel, atributos, descripciones)
2. CONEXIONES entre Sefirot (caminos, relaciones)
3. MEDITACIONES relacionadas con las Sefirot
4. NOMBRES DIVINOS asociados a cada Sefirá
5. CONCEPTOS del Árbol de la Vida
6. INTENCIONES espirituales por Sefirá"""
    },
    'sefer_yetzirah': {
        'dir': 'transcripciones/sefer_yetzirah',
        'prompt': """Eres un experto en Sefer Yetzirah (Libro de la Formación). Extrae:
1. LETRAS HEBREAS con detalles de formación y combinaciones
2. GEMATRIA y valores numéricos explicados
3. SEFIROT en contexto de Sefer Yetzirah
4. COMBINACIONES de letras y sus significados
5. CONCEPTOS de creación y formación
6. MEDITACIONES con letras"""
    },
    'tefila': {
        'dir': 'transcripciones/tefila',
        'prompt': """Eres un experto en Tefilá (oración judía) y Kavanah (intención). Extrae:
1. ORACIONES completas con texto en hebreo
2. KAVANOT (intenciones) para cada oración
3. TIMING y orden de oraciones (Shacharit, Minchá, Arvit)
4. NOMBRES DIVINOS en las oraciones
5. MEDITACIONES antes/durante la oración
6. SIGNIFICADOS y explicaciones de las oraciones"""
    },
    'puertas_luz': {
        'dir': 'transcripciones/puertas_luz',
        'prompt': """Eres un experto en el libro Shaarei Orah (Las Puertas de la Luz) y las Sefirot. Extrae:
1. PUERTAS y NIVELES espirituales mencionados
2. RELACIÓN entre Sefirot y nombres divinos
3. FLUJO DE LUZ divina y cómo activarlo
4. NOMBRES DIVINOS específicos de cada puerta
5. COLORES y atributos asociados a las Sefirot
6. MEDITACIONES para abrir las puertas de la luz"""
    },
    'shir_hashirim': {
        'dir': 'transcripciones/shir_hashirim',
        'prompt': """Eres un experto en Shir HaShirim (Cantar de los Cantares) y su significado místico. Extrae:
1. VERSÍCULOS analizados y su traducción
2. ANALOGÍAS del amor entre el Alma e Israel con el Creador
3. SIMBOLOGÍA (besos, vino, jardín, etc.) y su decodificación
4. SECRETOS de la relación divina
5. MOMENTOS propicios para su lectura y meditación
6. ENSEÑANZAS sobre el amor divino y la profecía"""
    },
    'nombres_72': {
        'dir': 'transcripciones/nombres_72',
        'prompt': """Eres un experto en los 72 Nombres de Dios del Shem HaMeforash. Extrae:
1. TRENZAS DE 3 LETRAS (Nombres) mencionadas
2. USOS ESPECÍFICOS de cada nombre (e.g., curación, eliminar ego, etc.)
3. MEDITACIONES para escanear los nombres
4. COMBINACIONES de letras y vocales
5. DÍAS o momentos para usar cada nombre specific
6. HISTORIAS o ejemplos de milagros con los nombres"""
    },
    'letras_hebreas': {
        'dir': 'transcripciones/letras_hebreas',
        'prompt': """Eres un experto en las Letras Hebreas y su energía. Extrae:
1. FORMA de la letra y su significado visual
2. VALOR GEMÁTRICO y sus equivalencias
3. SIGNIFICADO del nombre de la letra
4. CUALIDADES energéticas de la letra
5. MEDITACIONES visuales con la letra
6. ENSEÑANZAS sobre la creación del mundo con las letras"""
    }
}

# Playlist seleccionada (se configura desde argv)
CURRENT_PLAYLIST = 'secretos_zohar'  # Default
TRANSCRIPTIONS_DIR = Path(PLAYLIST_CONFIG[CURRENT_PLAYLIST]['dir'])
SYSTEM_PROMPT = f"""Eres un experto en Kabbalah y análisis de contenido espiritual.
{PLAYLIST_CONFIG[CURRENT_PLAYLIST]['prompt']}

Devuelve SOLO un JSON válido sin explicaciones adicionales."""

EXTRACTION_PROMPT_TEMPLATE = """Analiza la siguiente clase de Kabbalah y extrae el contenido estructurado siguiendo estas REGLAS CRÍTICAS:

1. **PROHIBIDO INVENTAR**: Solo extrae información que aparezca explícitamente en la transcripción.
2. **DATOS GENÉRICOS**: NO incluyas "Metatrón", "Zohar = Esplendor", "Rosa = 13 pétalos" o "Tikún" a menos que se mencionen en ESTA clase específica.
3. **CALIDAD EXTREMA**: Captura los detalles técnicos, permutaciones de letras, nombres de Dios y explicaciones metafóricas (como la bombilla/fricción) que use el maestro.
4. **FORMATO**: Devuelve un JSON válido. Si una categoría no tiene datos, usa un array vacío [].

ESTRUCTURA REQUERIDA:
{{
  "metadata": {{
    "titulo": "{title}",
    "video_id": "{video_id}",
    "duracion_minutos": {duration},
    "tipo": "meditacion" | "ensenanza" | "mixto" | "qa"
  }},
  "meditaciones": [
    {{
      "titulo": "...",
      "instrucciones_detalladas": "Guía paso a paso",
      "nombres_divinos": [],
      "visualizaciones": []
    }}
  ],
  "ensenanzas_clave": [
    {{ "tema": "...", "explicacion_profunda": "..." }}
  ],
  "preguntas_y_respuestas": [
    {{ "pregunta": "...", "respuesta": "..." }}
  ],
  "vocabulario_especifico": [
    {{ "termino_hebreo": "...", "transliteracion": "...", "significado": "..." }}
  ],
  "conceptos_kabbalisticos": [
    {{ "concepto": "...", "contexto": "..." }}
  ],
  "citas_textuales": ["Frase literal impactante"]
}}

CLASE: {title}
DURACIÓN: {duration} min
TRANSCRIPCIÓN:
{transcript_text}
"""

def load_transcription(json_path: Path) -> Dict[str, Any]:
    """Carga una transcripción desde JSON"""
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Detector de formato json3 / raw chat
    if 'wireMagic' in data and 'events' in data:
        # Convertir formato json3 a formato estándar
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
        
        # Inferir metadata del nombre del archivo
        filename = json_path.stem
        # Intentar extraer título y ID del nombre (e.g. "001_Titulo - clase 1.es")
        # Esto es una aproximación
        return {
            'metadata': {
                'video_title': filename,
                'video_id': 'unknown',
                'duration_minutes': transcript[-1]['start'] / 60 if transcript else 0,
                'total_words': sum(len(s['text'].split()) for s in transcript)
            },
            'transcript': transcript
        }
            
    # Soporte para Whisper JSON (tiene 'segments' en lugar de 'transcript')
    if 'segments' in data and 'transcript' not in data:
        # Normalizar segmentos de Whisper a la estructura esperada
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

def extract_content_with_gpt4(transcription: Dict[str, Any]) -> Dict[str, Any]:
    """Usa GPT-4 para extraer contenido estructurado"""
    
    metadata = transcription['metadata']
    transcript_data = transcription['transcript']
    
    # Crear texto de transcripción
    transcript_text = create_transcript_text(transcript_data)
    
    # Limitar a ~15000 palabras para no exceder límite de tokens
    words = transcript_text.split()
    if len(words) > 15000:
        transcript_text = ' '.join(words[:15000]) + "\n\n[TRANSCRIPCIÓN TRUNCADA...]"
    
    # Crear prompt
    if len(words) < 300:
        # Prompt simplificado para videos muy cortos
        prompt = f"""Analiza este fragmento breve de una clase de Kabbalah y extrae el contenido estructurado.
clase: {metadata['video_title']}
transcripción: {transcript_text}

Devuelve un JSON con la estructura estándar, llenando solo lo que encuentres. 
Si es una instrucción de oración/meditación, ponla en 'meditaciones'.
No falles por falta de contenido, devuelve arrays vacíos si es necesario."""
    else:
        prompt = EXTRACTION_PROMPT_TEMPLATE.format(
            title=metadata['video_title'],
            video_id=metadata['video_id'],
            duration=metadata['duration_minutes'],
            words=metadata['total_words'],
            transcript_text=transcript_text
        )
    
    print(f"\n[AI] Procesando con GPT-4: {metadata['video_title'][:60]}...")
    print(f"   [STATS] {metadata['total_words']} palabras, {metadata['duration_minutes']:.1f} min")
    
    try:
        # Configurar parámetros según proveedor
        params = {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3
        }
        
        # OpenAI soporta response_format, DeepSeek no siempre
        if PROVIDER == 'openai':
            params["response_format"] = {"type": "json_object"}
        
        # Retry logic simple
        max_retries = 3
        result = None
        for attempt in range(max_retries):
            try:
                print(f"   [REQ] Enviando solicitud (Intento {attempt+1}/{max_retries})...", flush=True)
                response = client.chat.completions.create(**params)
                content = response.choices[0].message.content
                
                # Intentar parsear JSON (limpiar si es necesario)
                try:
                    result = json.loads(content)
                except json.JSONDecodeError:
                    # A veces DeepSeek/Ollama incluye markdown, limpiar
                    if "```json" in content:
                        clean_content = content.split("```json")[1].split("```")[0]
                    elif "```" in content:
                        clean_content = content.split("```")[1].split("```")[0]
                    else:
                        clean_content = content
                    result = json.loads(clean_content.strip())
                
                # Si llegamos aquí sin excepción, break
                break

            except Exception as e:
                print(f"   [WARN] Error en intento {attempt+1}: {e}", flush=True)
                if attempt == max_retries - 1:
                    print(f"   [ERROR] Agotados intentos para este video.", flush=True)
                    return None
                time.sleep(5) # Esperar antes de reintentar
        
        if not result:
            return None
        
        # Estadísticas
        stats = {
            'meditaciones': len(result.get('meditaciones', [])),
            'preguntas_respuestas': len(result.get('preguntas_respuestas', [])),
            'vocabulario_zohar': len(result.get('vocabulario_zohar', [])),
            'ensenanzas': len(result.get('ensenanzas', [])),
            'nombres_divinos': len(result.get('nombres_divinos', [])),
            'letras_hebreas': len(result.get('letras_hebreas', [])),
            'conceptos': len(result.get('conceptos', []))
        }
        
        print(f"   [OK] Extraido: {stats['meditaciones']} meditaciones, "
              f"{stats['preguntas_respuestas']} Q&A, "
              f"{stats['vocabulario_zohar']} vocabulario, "
              f"{stats['ensenanzas']} ensenanzas")
        print(f"             {stats['nombres_divinos']} nombres, "
              f"{stats['letras_hebreas']} letras, "
              f"{stats['conceptos']} conceptos")
        
        return result
        
    except Exception as e:
        print(f"   [ERROR]: {str(e)}")
        return None

def process_video(json_file: Path) -> Dict[str, Any]:
    """Procesa un video completo"""
    
    print(f"\n{'='*70}", flush=True)
    print(f"[VIDEO] {json_file.stem}", flush=True)
    print(f"{'='*70}", flush=True)
    
    # Verificar si ya existe
    output_file = OUTPUT_DIR / f"{json_file.stem}_extracted.json"
    if output_file.exists():
        print(f"   [SKIP] Ya procesado: {output_file.name}", flush=True)
        return {'status': 'skipped', 'file': str(output_file)}

    # Cargar transcripcion
    transcription = load_transcription(json_file)
    
    # Extraer contenido
    extracted = extract_content_with_gpt4(transcription)
    
    if extracted:
        # Agregar metadata original
        extracted['source_file'] = str(json_file)
        extracted['processed_at'] = time.strftime('%Y-%m-%d %H:%M:%S')
        
        # Guardar resultado
        output_file = OUTPUT_DIR / f"{json_file.stem}_extracted.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(extracted, f, ensure_ascii=False, indent=2)
        
        print(f"   [SAVED] Guardado en: {output_file}", flush=True)
        return extracted
    
    return None

def process_all_videos(limit: int = None):
    """Procesa todos los videos en el directorio"""
    
    print("="*70)
    print("EXTRACCION DE CONTENIDO CON IA")
    print(f"Procesando transcripciones de {CURRENT_PLAYLIST}")
    print("="*70)
    
    # Obtener archivos JSON y JSON3
    json_files = sorted(list(TRANSCRIPTIONS_DIR.glob("*.json")) + list(TRANSCRIPTIONS_DIR.glob("*.json3")))
    json_files = [f for f in json_files if not f.name.startswith('_')]
    
    if limit:
        json_files = json_files[:limit]

    # Prioritizar IDs críticos
    CRITICAL_IDS = ["iK6Uz6KjJVo", "ki9E5c0CTug", "aA7ba_FWnwY", "xMB7KkjGp-k", 
                    "T4waX0ZgkdY", "0IWsTxx9TSs", "AA9WCAwde28", "b4SHIFkmOcU",
                    "KJM7ociVLog", "wlEtY3fphjY"]
    
    critical_files = []
    other_files = []
    
    for f in json_files:
        is_critical = False
        for cid in CRITICAL_IDS:
            if cid in f.name:
                is_critical = True
                break
        if is_critical:
            critical_files.append(f)
        else:
            other_files.append(f)
            
    json_files = critical_files + other_files

    print(f"\n[INFO] Total de videos a procesar: {len(json_files)}", flush=True)
    if critical_files:
        print(f"   [INFO] Priorizando {len(critical_files)} videos críticos.", flush=True)
    
    # Validar API key según proveedor
    if PROVIDER == 'deepseek' and not os.getenv('DEEPSEEK_API_KEY'):
        print("\n[ERROR] No se encontró DEEPSEEK_API_KEY")
        print("Por favor configura la variable de entorno")
        return
    elif PROVIDER == 'openai' and not os.getenv('OPENAI_API_KEY'):
        print("\n[ERROR] No se encontró OPENAI_API_KEY")
        print("Por favor configura la variable de entorno")
        return
    elif PROVIDER == 'ollama':
        # Simple connectivity check
        try:
            print(f"   [DEBUG] Probando conexión a {client.base_url}...", flush=True)
            client.models.list()
            print("   [OK] Conexión con Ollama exitosa", flush=True)
        except Exception as e:
            print(f"\n[ERROR] No se pudo conectar con Ollama en {client.base_url}")
            print(f"Error: {e}")
            return
    
    #input("\n✋ Presiona ENTER para comenzar el procesamiento...")
    print("\n[INFO] Iniciando procesamiento automático...", flush=True)
    
    results = []
    successful = 0
    failed = 0
    start_time = time.time()
    
    for idx, json_file in enumerate(json_files, 1):
        print(f"\n[{idx}/{len(json_files)}]", flush=True)
        
        result = process_video(json_file)
        
        if result:
            if result.get('status') == 'skipped':
                print("   [SKIP] Saltado.", flush=True)
            else:
                results.append(result)
                successful += 1
        else:
            failed += 1
        
        # Pausa entre requests para no exceder rate limit
        if idx < len(json_files):
            print("   [WAIT] Pausa 2s...", flush=True)
            time.sleep(2)
    
    # Resumen final
    elapsed = (time.time() - start_time) / 60
    
    print(f"\n\n{'='*70}")
    print(f"{'  RESUMEN FINAL  ':^70}")
    print(f"{'='*70}")
    print(f"[OK] Procesados exitosamente: {successful}")
    print(f"[FAIL] Fallidos: {failed}")
    print(f"[TIME] Tiempo total: {elapsed:.1f} minutos")
    print(f"[INFO] Archivos guardados en: {OUTPUT_DIR}")
    print(f"{'='*70}\n")
    
    # Crear resumen agregado
    create_summary(results)

def create_summary(results: List[Dict[str, Any]]):
    """Crea un resumen consolidado de todo el contenido extraído"""
    
    summary = {
        'total_videos': len(results),
        'estadisticas': {
            'meditaciones_total': sum(len(r.get('meditaciones', [])) for r in results),
            'preguntas_respuestas_total': sum(len(r.get('preguntas_respuestas', [])) for r in results),
            'vocabulario_zohar_total': sum(len(r.get('vocabulario_zohar', [])) for r in results),
            'ensenanzas_total': sum(len(r.get('ensenanzas', [])) for r in results),
            'nombres_divinos_total': sum(len(r.get('nombres_divinos', [])) for r in results),
            'letras_hebreas_total': sum(len(r.get('letras_hebreas', [])) for r in results),
            'conceptos_total': sum(len(r.get('conceptos', [])) for r in results)
        },
        'nombres_divinos_unicos': [],
        'letras_hebreas_unicas': [],
        'vocabulario_simbolos_unicos': [],
        'intenciones_conteo': {},
        'videos': []
    }
    
    # Recopilar únicos
    nombres_set = set()
    letras_set = set()
    simbolos_set = set()
    
    for result in results:
        # Nombres divinos
        for nombre in result.get('nombres_divinos', []):
            nombres_set.add(nombre.get('transliteracion', ''))
        
        # Letras
        for letra in result.get('letras_hebreas', []):
            letras_set.add(letra.get('letra', ''))
        
        # Vocabulario/Símbolos del Zohar
        for vocab in result.get('vocabulario_zohar', []):
            simbolos_set.add(vocab.get('termino', ''))
        
        # Intenciones
        for intencion in result.get('intenciones_principales', []):
            # Handle both string and dict cases
            if isinstance(intencion, dict):
                intencion_key = intencion.get('nombre', str(intencion))
            else:
                intencion_key = str(intencion)
            summary['intenciones_conteo'][intencion_key] = summary['intenciones_conteo'].get(intencion_key, 0) + 1
        
        # Info del video
        summary['videos'].append({
            'titulo': result['metadata']['titulo'],
            'tipo': result['metadata'].get('tipo', 'desconocido'),
            'meditaciones': len(result.get('meditaciones', [])),
            'qa': len(result.get('preguntas_respuestas', [])),
            'vocabulario': len(result.get('vocabulario_zohar', [])),
            'ensenanzas': len(result.get('ensenanzas', []))
        })
    
    summary['nombres_divinos_unicos'] = sorted(list(nombres_set))
    summary['letras_hebreas_unicas'] = sorted(list(letras_set))
    summary['vocabulario_simbolos_unicos'] = sorted(list(simbolos_set))
    
    # Guardar resumen
    summary_file = OUTPUT_DIR / "_RESUMEN_GENERAL.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    print(f"\n[STATS] Resumen general guardado en: {summary_file}")
    print(f"\n[INFO] Contenido extraído:")
    print(f"   * {summary['estadisticas']['meditaciones_total']} meditaciones")
    print(f"   * {summary['estadisticas']['preguntas_respuestas_total']} preguntas y respuestas")
    print(f"   * {summary['estadisticas']['vocabulario_zohar_total']} términos del vocabulario del Zohar")
    print(f"   * {summary['estadisticas']['ensenanzas_total']} enseñanzas/revelaciones")
    print(f"   * {len(summary['nombres_divinos_unicos'])} nombres divinos únicos")
    print(f"   * {len(summary['letras_hebreas_unicas'])} letras hebreas")
    print(f"   * {len(summary.get('vocabulario_simbolos_unicos', []))} símbolos únicos del Zohar")
    print(f"   * {summary['estadisticas']['conceptos_total']} conceptos kabbalísticos")

if __name__ == "__main__":
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(description='Extraer contenido estructurado de videos con IA')
    parser.add_argument('--playlist', type=str, default='secretos_zohar',
                        choices=['secretos_zohar', 'arbol_vida', 'sefer_yetzirah', 'tefila', 'puertas_luz', 'shir_hashirim', 'nombres_72', 'letras_hebreas'],
                       help='Playlist a procesar')
    parser.add_argument('--limit', type=int, default=None,
                       help='Número máximo de videos a procesar (para pruebas)')
    
    args = parser.parse_args()
    
    # Configurar playlist
    CURRENT_PLAYLIST = args.playlist
    TRANSCRIPTIONS_DIR = Path(PLAYLIST_CONFIG[CURRENT_PLAYLIST]['dir'])
    SYSTEM_PROMPT = f"""Eres un experto en Kabbalah y análisis de contenido espiritual.
{PLAYLIST_CONFIG[CURRENT_PLAYLIST]['prompt']}

Devuelve SOLO un JSON válido sin explicaciones adicionales."""
    
    print(f"\n[PLAYLIST] Procesando: {CURRENT_PLAYLIST}")
    print(f"[DIR] Directorio: {TRANSCRIPTIONS_DIR}")
    
    if args.limit:
        print(f"🧪 MODO PRUEBA: procesando solo {args.limit} videos")
    
    process_all_videos(limit=args.limit)
