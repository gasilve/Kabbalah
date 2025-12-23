"""
Script para descargar audio de pronunciación hebrea de fuentes públicas

Fuentes:
1. Forvo.com (pronunciaciones nativas)
2. Wikimedia Commons (recursos libres)
3. Google TTS como fallback

Uso:
    python download_hebrew_audio.py --letters      # Descargar letras del alfabeto
    python download_hebrew_audio.py --72names      # Descargar 72 nombres divinos
    python download_hebrew_audio.py --prayers      # Descargar oraciones comunes
    python download_hebrew_audio.py --all          # Descargar todo
"""

import os
import sys
import time
import json
import argparse
import requests
from pathlib import Path
from typing import List, Dict, Optional
from urllib.parse import quote
import hashlib

# Configuración
OUTPUT_BASE = Path("../kabbalah-app/public/audio/hebrew")
CACHE_FILE = Path("audio_download_cache.json")

# Crear estructura de directorios
LETTERS_DIR = OUTPUT_BASE / "letters"
NAMES_72_DIR = OUTPUT_BASE / "72names"
PRAYERS_DIR = OUTPUT_BASE / "prayers"
DIVINE_NAMES_DIR = OUTPUT_BASE / "divine_names"

for directory in [LETTERS_DIR, NAMES_72_DIR, PRAYERS_DIR, DIVINE_NAMES_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Datos del alfabeto hebreo
HEBREW_LETTERS = [
    {"letter": "א", "name": "alef", "pronunciation": "alef"},
    {"letter": "ב", "name": "bet", "pronunciation": "bet"},
    {"letter": "ג", "name": "gimel", "pronunciation": "gimel"},
    {"letter": "ד", "name": "dalet", "pronunciation": "dalet"},
    {"letter": "ה", "name": "he", "pronunciation": "heh"},
    {"letter": "ו", "name": "vav", "pronunciation": "vav"},
    {"letter": "ז", "name": "zayin", "pronunciation": "zayin"},
    {"letter": "ח", "name": "chet", "pronunciation": "khet"},
    {"letter": "ט", "name": "tet", "pronunciation": "tet"},
    {"letter": "י", "name": "yod", "pronunciation": "yod"},
    {"letter": "כ", "name": "kaf", "pronunciation": "kaf"},
    {"letter": "ל", "name": "lamed", "pronunciation": "lamed"},
    {"letter": "מ", "name": "mem", "pronunciation": "mem"},
    {"letter": "נ", "name": "nun", "pronunciation": "nun"},
    {"letter": "ס", "name": "samech", "pronunciation": "samekh"},
    {"letter": "ע", "name": "ayin", "pronunciation": "ayin"},
    {"letter": "פ", "name": "pe", "pronunciation": "peh"},
    {"letter": "צ", "name": "tsadi", "pronunciation": "tsadi"},
    {"letter": "ק", "name": "qof", "pronunciation": "qof"},
    {"letter": "ר", "name": "resh", "pronunciation": "resh"},
    {"letter": "ש", "name": "shin", "pronunciation": "shin"},
    {"letter": "ת", "name": "tav", "pronunciation": "tav"},
]

# 72 Nombres de Dios
NAMES_72 = [
    {"num": 1, "letters": "והו", "name": "vhv", "pronunciation": "vav-heh-vav"},
    {"num": 2, "letters": "ילי", "name": "yly", "pronunciation": "yod-lamed-yod"},
    {"num": 3, "letters": "סיט", "name": "syt", "pronunciation": "samekh-yod-tet"},
    {"num": 4, "letters": "עלם", "name": "elm", "pronunciation": "ayin-lamed-mem"},
    {"num": 5, "letters": "מהש", "name": "mhs", "pronunciation": "mem-heh-shin"},
    # ... Se agregarán los 72 completos
]

# Nombres divinos comunes
DIVINE_NAMES = [
    {"hebrew": "יהוה", "name": "yhvh", "pronunciation": "adonai"},  # No pronunciar el nombre
    {"hebrew": "אלהים", "name": "elohim", "pronunciation": "elohim"},
    {"hebrew": "אדני", "name": "adonai", "pronunciation": "adonai"},
    {"hebrew": "שדי", "name": "shaddai", "pronunciation": "shaddai"},
    {"hebrew": "אהיה", "name": "ehyeh", "pronunciation": "ehyeh"},
]

# Oraciones comunes
COMMON_PRAYERS = [
    {"name": "shema", "text": "שמע ישראל", "pronunciation": "shema yisrael"},
    {"name": "baruch", "text": "ברוך", "pronunciation": "barukh"},
    {"name": "amen", "text": "אמן", "pronunciation": "amen"},
    {"name": "shalom", "text": "שלום", "pronunciation": "shalom"},
]


def load_cache() -> Dict:
    """Cargar caché de descargas previas"""
    if CACHE_FILE.exists():
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_cache(cache: Dict):
    """Guardar caché de descargas"""
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def download_from_wikimedia(search_term: str, output_path: Path) -> bool:
    """
    Intentar descargar de Wikimedia Commons
    Busca archivos de audio relacionados con el término
    """
    # Wikimedia Commons API
    api_url = "https://commons.wikimedia.org/w/api.php"
    
    params = {
        "action": "query",
        "format": "json",
        "list": "search",
        "srsearch": f"hebrew pronunciation {search_term}",
        "srnamespace": "6",  # File namespace
        "srlimit": "5"
    }
    
    try:
        response = requests.get(api_url, params=params, timeout=10)
        data = response.json()
        
        if "query" in data and "search" in data["query"]:
            results = data["query"]["search"]
            
            for result in results:
                title = result["title"]
                if any(ext in title.lower() for ext in ['.ogg', '.mp3', '.wav']):
                    # Obtener URL del archivo
                    file_params = {
                        "action": "query",
                        "format": "json",
                        "titles": title,
                        "prop": "imageinfo",
                        "iiprop": "url"
                    }
                    
                    file_response = requests.get(api_url, params=file_params, timeout=10)
                    file_data = file_response.json()
                    
                    pages = file_data.get("query", {}).get("pages", {})
                    for page_id, page_data in pages.items():
                        if "imageinfo" in page_data:
                            url = page_data["imageinfo"][0]["url"]
                            
                            # Descargar archivo
                            audio_response = requests.get(url, timeout=30)
                            if audio_response.status_code == 200:
                                # Convertir a MP3 si es necesario (simplificado)
                                with open(output_path, 'wb') as f:
                                    f.write(audio_response.content)
                                print(f"  ✓ Descargado de Wikimedia: {title}")
                                return True
        
        return False
        
    except Exception as e:
        print(f"  ⚠️  Error en Wikimedia: {e}")
        return False


def download_with_gtts(text: str, output_path: Path, lang='iw') -> bool:
    """
    Generar audio con Google Text-to-Speech
    Requiere: pip install gtts
    Nota: Hebrew usa código 'iw' en gtts, no 'he'
    """
    try:
        from gtts import gTTS
        
        tts = gTTS(text=text, lang=lang, slow=False)
        tts.save(str(output_path))
        print(f"  ✓ Generado con Google TTS")
        return True
        
    except ImportError:
        print(f"  ⚠️  gtts no instalado. Instalar con: pip install gtts")
        return False
    except Exception as e:
        print(f"  ⚠️  Error en Google TTS: {e}")
        return False


def download_hebrew_letter(letter_data: Dict, cache: Dict) -> bool:
    """Descargar audio para una letra hebrea"""
    name = letter_data['name']
    output_path = LETTERS_DIR / f"{name}.mp3"
    
    # Verificar caché
    cache_key = f"letter_{name}"
    if cache_key in cache and output_path.exists():
        print(f"[{letter_data['letter']}] {name.capitalize()} - Ya existe en caché")
        return True
    
    print(f"\n[{letter_data['letter']}] Descargando: {name.capitalize()}")
    
    # Intentar Wikimedia primero
    if download_from_wikimedia(f"hebrew letter {name}", output_path):
        cache[cache_key] = {"source": "wikimedia", "path": str(output_path)}
        return True
    
    # Fallback a Google TTS
    hebrew_text = letter_data['letter']
    if download_with_gtts(hebrew_text, output_path):
        cache[cache_key] = {"source": "gtts", "path": str(output_path)}
        return True
    
    print(f"  ✗ No se pudo descargar {name}")
    return False


def download_72_name(name_data: Dict, cache: Dict) -> bool:
    """Descargar audio para uno de los 72 nombres"""
    num = name_data['num']
    name = name_data['name']
    output_path = NAMES_72_DIR / f"{num}-{name}.mp3"
    
    cache_key = f"72name_{num}"
    if cache_key in cache and output_path.exists():
        print(f"[{num}] {name_data['letters']} - Ya existe en caché")
        return True
    
    print(f"\n[{num}] Descargando: {name_data['letters']} ({name})")
    
    # Intentar con las letras hebreas
    hebrew_text = name_data['letters']
    if download_with_gtts(hebrew_text, output_path):
        cache[cache_key] = {"source": "gtts", "path": str(output_path)}
        return True
    
    print(f"  ✗ No se pudo descargar nombre {num}")
    return False


def download_all_letters():
    """Descargar todas las letras del alfabeto"""
    print("\n" + "="*70)
    print("DESCARGANDO ALFABETO HEBREO (22 letras)")
    print("="*70)
    
    cache = load_cache()
    successful = 0
    failed = 0
    
    for letter in HEBREW_LETTERS:
        if download_hebrew_letter(letter, cache):
            successful += 1
        else:
            failed += 1
        
        save_cache(cache)
        time.sleep(0.5)  # Pausa breve entre descargas
    
    print(f"\n{'='*70}")
    print(f"RESUMEN - Alfabeto Hebreo")
    print(f"{'='*70}")
    print(f"✓ Exitosos: {successful}/22")
    print(f"✗ Fallidos: {failed}/22")
    print(f"Archivos en: {LETTERS_DIR}")
    print(f"{'='*70}\n")


def download_all_72_names():
    """Descargar los 72 nombres de Dios"""
    print("\n" + "="*70)
    print("DESCARGANDO 72 NOMBRES DE DIOS")
    print("="*70)
    
    cache = load_cache()
    successful = 0
    failed = 0
    
    # Por ahora solo los primeros 5 que tenemos definidos
    for name in NAMES_72:
        if download_72_name(name, cache):
            successful += 1
        else:
            failed += 1
        
        save_cache(cache)
        time.sleep(0.5)
    
    print(f"\n{'='*70}")
    print(f"RESUMEN - 72 Nombres")
    print(f"{'='*70}")
    print(f"✓ Exitosos: {successful}/{len(NAMES_72)}")
    print(f"✗ Fallidos: {failed}/{len(NAMES_72)}")
    print(f"Archivos en: {NAMES_72_DIR}")
    print(f"{'='*70}\n")


def download_prayers():
    """Descargar oraciones comunes"""
    print("\n" + "="*70)
    print("DESCARGANDO ORACIONES COMUNES")
    print("="*70)
    
    cache = load_cache()
    
    for prayer in COMMON_PRAYERS:
        output_path = PRAYERS_DIR / f"{prayer['name']}.mp3"
        cache_key = f"prayer_{prayer['name']}"
        
        if cache_key in cache and output_path.exists():
            print(f"{prayer['name']} - Ya existe")
            continue
        
        print(f"\nDescargando: {prayer['text']} ({prayer['name']})")
        
        if download_with_gtts(prayer['text'], output_path):
            cache[cache_key] = {"source": "gtts", "path": str(output_path)}
            print(f"  ✓ Generado")
        
        save_cache(cache)
        time.sleep(0.5)
    
    print(f"\nArchivos en: {PRAYERS_DIR}\n")


def main():
    parser = argparse.ArgumentParser(description='Descargar audio hebreo de fuentes públicas')
    parser.add_argument('--letters', action='store_true', help='Descargar letras del alfabeto')
    parser.add_argument('--72names', action='store_true', dest='seventytwonames', help='Descargar 72 nombres divinos')
    parser.add_argument('--prayers', action='store_true', help='Descargar oraciones comunes')
    parser.add_argument('--all', action='store_true', help='Descargar todo')
    
    args = parser.parse_args()
    
    # Si no se especifica nada, mostrar ayuda
    if not (args.letters or args.seventytwonames or args.prayers or args.all):
        parser.print_help()
        return
    
    print("""
================================================================================
          DESCARGADOR DE AUDIO HEBREO
          Fuentes: Wikimedia Commons + Google TTS
================================================================================
    """)
    
    # Verificar que gtts esté instalado
    try:
        import gtts
    except ImportError:
        print("⚠️  ADVERTENCIA: gtts no está instalado.")
        print("   Instalar con: pip install gtts")
        print("   Sin gtts, solo se intentará Wikimedia Commons.\n")
    
    if args.all or args.letters:
        download_all_letters()
    
    if args.all or args.seventytwonames:
        download_all_72_names()
    
    if args.all or args.prayers:
        download_prayers()
    
    print("\n✅ Proceso completado!")
    print(f"📁 Archivos guardados en: {OUTPUT_BASE}")


if __name__ == "__main__":
    main()
