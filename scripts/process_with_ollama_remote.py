"""
Script supervisor mejorado para procesar contenido con servidor Ollama remoto
Ejecuta las descargas y procesamiento de forma secuencial con reintentos automáticos
"""

import subprocess
import time
import sys
from pathlib import Path

# Configuración del servidor Ollama
OLLAMA_HOST = "192.168.100.21"
OLLAMA_PORT = "11434"
OLLAMA_MODEL = "llama3.2:3b"

# Directorio base
BASE_DIR = Path(__file__).parent.parent

PLAYLISTS = [
    {
        'name': 'Árbol de la Vida',
        'input_dir': BASE_DIR / 'transcripciones' / 'arbol_vida',
        'priority': 1
    },
    {
        'name': 'Tefilá',
        'input_dir': BASE_DIR / 'transcripciones' / 'tefila',
        'priority': 2
    },
    {
        'name': 'Sefer Yetzirah',
        'input_dir': BASE_DIR / 'transcripciones' / 'sefer_yetzirah',
        'priority': 3
    },
    {
        'name': 'Letras Hebreas',
        'input_dir': BASE_DIR / 'transcripciones' / 'letras_hebreas',
        'priority': 4
    },
    {
        'name': 'Puertas de Luz',
        'input_dir': BASE_DIR / 'transcripciones' / 'puertas_luz',
        'priority': 5
    },
    {
        'name': 'Shir HaShirim',
        'input_dir': BASE_DIR / 'transcripciones' / 'shir_hashirim',
        'priority': 6
    },
    {
        'name': 'Nombres 72',
        'input_dir': BASE_DIR / 'transcripciones' / 'nombres_72',
        'priority': 7
    },
    {
        'name': 'Secretos del Zohar',
        'input_dir': BASE_DIR / 'transcripciones' / 'secretos_zohar',
        'priority': 8
    }
]

def run_process(command, description, max_retries=3):
    """Ejecuta un proceso con reintentos automáticos"""
    
    print(f"\n{'='*70}")
    print(f"🔄 {description}")
    print(f"{'='*70}")
    
    for attempt in range(1, max_retries + 1):
        print(f"\nIntento {attempt}/{max_retries}")
        
        try:
            result = subprocess.run(
                command,
                shell=True,
                check=True,
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            
            print(f"✅ {description} completado exitosamente")
            if result.stdout:
                print(result.stdout[-500:])  # Últimas 500 chars
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Falló (intento {attempt}/{max_retries})")
            if e.stderr:
                print(f"Error: {e.stderr[-500:]}")
            
            if attempt < max_retries:
                wait_time = 60 * attempt  # Espera progresiva
                print(f"⏳ Esperando {wait_time}s antes de reintentar...")
                time.sleep(wait_time)
            else:
                print(f"💥 {description} falló después de {max_retries} intentos")
                return False
        
        except Exception as e:
            print(f"💥 Error inesperado: {e}")
            return False
    
    return False

def main():
    print("""
╔══════════════════════════════════════════════════════════════════╗
║  SUPERVISOR DE PROCESAMIENTO DE CONTENIDO                        ║
║  Servidor Ollama Remoto: 192.168.100.21:11434                   ║
╚══════════════════════════════════════════════════════════════════╝
    """)
    
    # Configurar variables de entorno para Ollama remoto
    import os
    os.environ['OLLAMA_HOST'] = OLLAMA_HOST
    os.environ['OLLAMA_PORT'] = OLLAMA_PORT
    os.environ['OLLAMA_MODEL'] = OLLAMA_MODEL
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    
    # Procesar cada playlist
    for playlist in sorted(PLAYLISTS, key=lambda x: x['priority']):
        print(f"\n\n📂 PROCESANDO: {playlist['name']}")
        print(f"📁 Directorio: {playlist['input_dir']}")
        
        if not playlist['input_dir'].exists():
            print(f"⚠️  Directorio no encontrado, saltando...")
            continue
        
        # Contar archivos JSON y JSON3
        json_files = list(playlist['input_dir'].glob("*.json")) + list(playlist['input_dir'].glob("*.json3"))
        json_files = [f for f in json_files if not f.name.startswith('_')]
        
        print(f"📊 {len(json_files)} archivos encontrados")
        
        if len(json_files) == 0:
            print("⚠️  No hay archivos para procesar")
            continue
        
        # Ejecutar extractor mejorado
        cmd = f'python scripts/enhanced_content_extractor.py --input "{playlist["input_dir"]}"'
        
        success = run_process(
            cmd,
            f"Extracción de contenido: {playlist['name']}"
        )
        
        if not success:
            print(f"\n⚠️  Falló el procesamiento de {playlist['name']}, continuando con la siguiente...")
        
        # Pausa entre playlists
        print("\n⏸️  Pausa de 30s antes de la siguiente playlist...")
        time.sleep(30)
    
    print(f"\n\n{'='*70}")
    print(f"{'  PROCESAMIENTO COMPLETADO  ':^70}")
    print(f"{'='*70}")
    print("\n💾 Revisa la carpeta 'contenido_procesado' para ver los resultados")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⏸️  Proceso interrumpido por el usuario")
        sys.exit(0)
