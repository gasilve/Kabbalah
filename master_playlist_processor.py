"""
MASTER PLAYLIST PROCESSOR
=========================
Procesa TODAS las playlists en sequence:
1. Descarga subtítulos de YouTube
2. Procesa con IA (DeepSeek) para extraer contenido

Diseñado para correr en background durante varias horas.
Robusto contra fallos, con reintentos automáticos.
"""

import os
import sys
import json
import time
import subprocess
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

# ============================================================================
# CONFIGURACIÓN
# ============================================================================

# Playlists a procesar (en orden de prioridad)
PLAYLISTS = [
    {
        'name': 'sefer_yetzirah',
        'display': 'Sefer Yetzirah',
        'total_videos': 19,
        'downloaded_key': 'sefer_yetzirah',
        'transcript_dir': 'transcripciones/sefer_yetzirah',
        'file_pattern': '*Sefer Yetzirah*_extracted.json',
        'priority': 1,
        'est_download_mins': 15,
        'est_ai_mins': 50
    },
    {
        'name': 'tefila',
        'display': 'Tefilá',
        'total_videos': 48,
        'downloaded_key': 'tefila',
        'transcript_dir': 'transcripciones/tefila',
        'file_pattern': '*Tefila*_extracted.json',
        'priority': 2,
        'est_download_mins': 50,
        'est_ai_mins': 120
    },
    {
        'name': 'arbol_vida',
        'display': 'Árbol de la Vida',
        'total_videos': 87,
        'downloaded_key': 'arbol_vida',
        'transcript_dir': 'transcripciones/arbol_vida',
        'file_pattern': '*arbol_vida*_extracted.json',
        'priority': 3,
        'est_download_mins': 70,
        'est_ai_mins': 160
    },
    {
        'name': 'secretos_zohar',
        'display': 'Secretos del Zohar',
        'total_videos': 230,
        'downloaded_key': 'secretos_zohar',
        'transcript_dir': 'transcripciones/Secretos_del_Zohar',
        'file_pattern': '*_extracted.json',  # Fallback/General
        'priority': 4,
        'est_download_mins': 150,
        'est_ai_mins': 400
    }
]

# Archivos y directorios
PROGRESS_FILE = Path('download_progress.json')
OUTPUT_DIR = Path('contenido_procesado')
LOG_DIR = Path('logs')
LOG_DIR.mkdir(exist_ok=True)

# Configuración de logs
LOG_FILE = LOG_DIR / f'master_processor_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'
RETRY_DELAY = 60  # segundos antes de reintentar tras fallo

# ============================================================================
# FUNCIONES DE LOGGING
# ============================================================================

def log(msg: str, level: str = 'INFO'):
    """Log con timestamp a archivo y consola"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_msg = f"[{timestamp}] [{level}] {msg}"
    
    print(log_msg)
    sys.stdout.flush()
    
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_msg + '\n')

def log_section(title: str):
    """Log de sección con formato"""
    separator = '=' * 70
    log(separator)
    log(f'  {title.upper()}')
    log(separator)

# ============================================================================
# FUNCIONES DE ESTADO
# ============================================================================

def get_download_status(playlist: Dict) -> Tuple[int, int]:
    """Obtiene estado de descarga de una playlist"""
    if not PROGRESS_FILE.exists():
        return 0, playlist['total_videos']
    
    try:
        with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        key = playlist['downloaded_key']
        if key not in data:
            return 0, playlist['total_videos']
        
        downloaded = len(data[key].get('downloaded', []))
        pending = playlist['total_videos'] - downloaded
        return downloaded, pending
        
    except Exception as e:
        log(f"Error leyendo progreso de descarga: {e}", 'ERROR')
        return 0, playlist['total_videos']

def get_ai_processing_status(playlist: Dict) -> Tuple[int, int]:
    """Obtiene cuántos videos de esta playlist ya fueron procesados con IA"""
    if not OUTPUT_DIR.exists():
        return 0, playlist['total_videos']
    
    # Contar archivos procesados específicos de la playlist
    pattern = playlist.get('file_pattern', '*_extracted.json')
    
    # Special case for secretos_zohar which might overlap with others if using *
    if playlist['name'] == 'secretos_zohar':
        # Count all minus known others, or rely on specific naming if possible
        # Currently tracking via specific excludes might be safer
        all_files = set(OUTPUT_DIR.glob('*_extracted.json'))
        known_others = set()
        for p in PLAYLISTS:
            if p['name'] != 'secretos_zohar':
                known_others.update(OUTPUT_DIR.glob(p['file_pattern']))
        
        processed_files = list(all_files - known_others)
    else:
        processed_files = list(OUTPUT_DIR.glob(pattern))
    
    processed = len(processed_files)
    
    # Para esta playlist específica, necesitamos ver cuántos JSONs hay en transcripciones
    transcript_dir = Path(playlist['transcript_dir'])
    if transcript_dir.exists():
        # Buscar tanto .json como .json3
        json_files = list(transcript_dir.glob('*.json')) + list(transcript_dir.glob('*.json3'))
        total_transcripts = len(json_files)
    else:
        total_transcripts = 0
    
    pending = max(0, total_transcripts - processed)
    
    return min(processed, playlist['total_videos']), pending

# ============================================================================
# FUNCIONES DE PROCESAMIENTO
# ============================================================================

def download_playlist_subtitles(playlist: Dict) -> bool:
    """Descarga subtítulos de una playlist"""
    log_section(f"Descargando: {playlist['display']}")
    
    downloaded, pending = get_download_status(playlist)
    
    log(f"Estado: {downloaded}/{playlist['total_videos']} descargados, {pending} pendientes")
    
    if pending == 0:
        log(f"✓ {playlist['display']} ya está completamente descargado", 'SUCCESS')
        return True
    
    # Usar el script correcto que usa download_progress.json
    cmd = [
       sys.executable,
        'scripts/download_all_playlists.py'
    ]
    
    log(f"Ejecutando: {' '.join(cmd)}")
    log(f"Tiempo estimado: ~{playlist['est_download_mins']} minutos")
    
    try:
        start_time = time.time()
        
        # Ejecutar mostrando output en tiempo real
        result = subprocess.run(cmd)
        
        duration = (time.time() - start_time) / 60
        
        if result.returncode == 0:
            log(f"✓ Descarga completada en {duration:.1f} minutos", 'SUCCESS')
            return True
        else:
            log(f"✗ Descarga falló (código {result.returncode})", 'ERROR')
            return False
            
    except Exception as e:
        log(f"✗ Error ejecutando descarga: {e}", 'ERROR')
        return False

def process_playlist_with_ai(playlist: Dict) -> bool:
    """Procesa transcripciones de una playlist con IA"""
    log_section(f"Procesando con IA: {playlist['display']}")

    # ========================================================================
    # REMOTE WHISPER SYNC INTEGRATION
    # ========================================================================
    if playlist['name'] == 'secretos_zohar':
        log("🔄 Sincronizando transcripciones remotas (Whisper Server)...")
        try:
             # Ensure scripts module can be imported
             sys.path.append(str(Path.cwd()))
             from scripts.remote_whisper_client import sync_remote_transcripts
             count = sync_remote_transcripts()
             log(f"✓ Sincronización completada: {count} nuevos archivos descargados")
        except Exception as e:
             log(f"⚠️ Error sincronizando: {e}", 'ERROR')
    # ========================================================================
    
    processed, pending = get_ai_processing_status(playlist)
    
    log(f"Estado: {processed} procesados, ~{pending} pendientes")
    
    if pending == 0:
        log(f"✓ {playlist['display']} ya está completamente procesado", 'SUCCESS')
        return True
    
    # Comando para procesar con IA
    cmd = [
        sys.executable,
        'scripts/extract_content_ai.py',
        '--playlist', playlist['name']
    ]
    
    log(f"Ejecutando: {' '.join(cmd)}")
    log(f"Tiempo estimado: ~{playlist['est_ai_mins']} minutos")
    
    try:
        start_time = time.time()
        
        # Ejecutar mostrando output en tiempo real
        result = subprocess.run(cmd)
        
        duration = (time.time() - start_time) / 60
        
        if result.returncode == 0:
            log(f"✓ Procesamiento IA completado en {duration:.1f} minutos", 'SUCCESS')
            return True
        else:
            log(f"✗ Procesamiento IA falló (código {result.returncode})", 'ERROR')
            return False
            
    except Exception as e:
        log(f"✗ Error ejecutando procesamiento IA: {e}", 'ERROR')
        return False

# ============================================================================
# FUNCIÓN PRINCIPAL
# ============================================================================

def main():
    """Procesa todas las playlists secuencialmente"""
    
    log_section("MASTER PLAYLIST PROCESSOR - INICIANDO")
    log(f"Directorio de trabajo: {os.getcwd()}")
    log(f"Archivo de log: {LOG_FILE}")
    log(f"Total de playlists: {len(PLAYLISTS)}")
    
    # Calcular tiempo total estimado
    total_download_mins = sum(p['est_download_mins'] for p in PLAYLISTS)
    total_ai_mins = sum(p['est_ai_mins'] for p in PLAYLISTS)
    total_mins = total_download_mins + total_ai_mins
    
    log(f"Tiempo estimado total: ~{total_mins} minutos ({total_mins/60:.1f} horas)")
    
    estimated_completion = datetime.now() + timedelta(minutes=total_mins)
    log(f"Finalización estimada: {estimated_completion.strftime('%Y-%m-%d %H:%M:%S')}")
    
    log("")
    log("IMPORTANTE: Este proceso puede tomar varias horas.")
    log("Puede dejarlo corriendo en background de forma segura.")
    log("Para monitorear progreso, use: Get-Content -Path logs\\*.log -Tail 50 -Wait")
    log("")
    
    # Iniciar automáticamente (diseñado para correr en background)
    log("Iniciando proceso automáticamente en 3 segundos...")
    time.sleep(3)
    
    overall_start = time.time()
    
    # ========================================================================
    # FASE 1: DESCARGAS
    # ========================================================================
    
    log_section("FASE 1: DESCARGA DE SUBTÍTULOS")
    
    for playlist in PLAYLISTS:
        success = False
        retries = 0
        max_retries = 3
        
        while not success and retries < max_retries:
            if retries > 0:
                log(f"Reintento {retries}/{max_retries} para {playlist['display']}")
                time.sleep(RETRY_DELAY)
            
            success = download_playlist_subtitles(playlist)
            
            if not success:
                retries += 1
        
        if not success:
            log(f"✗ FALLO CRÍTICO: No se pudo descargar {playlist['display']} después de {max_retries} intentos", 'ERROR')
            log("Continuando con siguiente playlist...")
        
        # Pausa entre playlists
        log("Pausa de 30 segundos antes de siguiente playlist...")
        time.sleep(30)
    
    # ========================================================================
    # FASE 2: PROCESAMIENTO CON IA
    # ========================================================================
    
    log_section("FASE 2: PROCESAMIENTO CON IA")
    
    for playlist in PLAYLISTS:
        success = False
        retries = 0
        max_retries = 3
        
        while not success and retries < max_retries:
            if retries > 0:
                log(f"Reintento {retries}/{max_retries} para {playlist['display']}")
                time.sleep(RETRY_DELAY)
            
            success = process_playlist_with_ai(playlist)
            
            if not success:
                retries += 1
        
        if not success:
            log(f"✗ FALLO CRÍTICO: No se pudo procesar {playlist['display']} con IA después de {max_retries} intentos", 'ERROR')
            log("Continuando con siguiente playlist...")
        
        # Pausa entre playlists
        log("Pausa de 10 segundos antes de siguiente playlist...")
        time.sleep(10)
    
    # ========================================================================
    # RESUMEN FINAL
    # ========================================================================
    
    overall_duration = (time.time() - overall_start) / 60
    
    log_section("PROCESO COMPLETADO")
    log(f"Duración total: {overall_duration:.1f} minutos ({overall_duration/60:.1f} horas)")
    log(f"Archivo de log completo: {LOG_FILE}")
    
    # Estadísticas finales
    total_processed = len(list(OUTPUT_DIR.glob('*_extracted.json'))) if OUTPUT_DIR.exists() else 0
    log(f"Total de archivos procesados: {total_processed}")
    
    log("")
    log("✓ Master Playlist Processor finalizado exitosamente")
    log("Revise los logs para detalles completos")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("\n\n✗ Proceso interrumpido por el usuario", 'WARNING')
        log("El progreso se ha guardado. Puede reiniciar el script para continuar.")
        sys.exit(1)
    except Exception as e:
        log(f"\n\n✗ ERROR CRÍTICO: {e}", 'ERROR')
        import traceback
        log(traceback.format_exc(), 'ERROR')
        sys.exit(1)
