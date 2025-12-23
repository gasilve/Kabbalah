"""
Script para procesar múltiples playlists en paralelo con IA
Versión optimizada para correr en background
"""
import os
import sys
import json
import time
import subprocess
from pathlib import Path
from datetime import datetime

# Configuración de playlists
PLAYLISTS = {
    'sefer_yetzirah': {
        'dir': 'transcripciones/sefer_yetzirah',
        'priority': 1,
        'estimated_time_hours': 1
    },
    'tefila': {
        'dir': 'transcripciones/tefila',
        'priority': 2,
        'estimated_time_hours': 2
    },
    'arbol_vida': {
        'dir': 'transcripciones/arbol_vida',
        'priority': 3,
        'estimated_time_hours': 3
    },
    'puertas_luz': {
        'dir': 'transcripciones/puertas_luz',
        'priority': 4,
        'estimated_time_hours': 2
    },
    'shir_hashirim': {
        'dir': 'transcripciones/shir_hashirim',
        'priority': 5,
        'estimated_time_hours': 2
    },
    'nombres_72': {
        'dir': 'transcripciones/nombres_72',
        'priority': 6,
        'estimated_time_hours': 3
    },
    'letras_hebreas': {
        'dir': 'transcripciones/letras_hebreas',
        'priority': 7,
        'estimated_time_hours': 2
    }
}

def count_pending_videos(playlist_name):
    """Cuenta videos pendientes de procesar"""
    trans_dir = Path(PLAYLISTS[playlist_name]['dir'])
    output_dir = Path('contenido_procesado')
    
    if not trans_dir.exists():
        return 0
    
    # Contar JSONs en transcripciones
    total_transcripts = len(list(trans_dir.glob('*.json')))
    
    # Contar procesados
    processed = 0
    if output_dir.exists():
        for f in output_dir.glob('*_extracted.json'):
            # Verificar si corresponde a esta playlist
            processed += 1
    
    return total_transcripts

def process_playlist_background(playlist_name):
    """Procesa una playlist en background"""
    print(f"\n{'='*70}")
    print(f"🎬 Iniciando procesamiento: {playlist_name}")
    print(f"{'='*70}")
    
    pending = count_pending_videos(playlist_name)
    print(f"📊 Videos pendientes: {pending}")
    
    if pending == 0:
        print(f"✅ {playlist_name} ya está completamente procesado")
        return True
    
    # Ejecutar script de extracción
    cmd = f'python extract_content_ai.py --playlist {playlist_name}'
    
    print(f"🚀 Comando: {cmd}")
    print(f"⏱️  Tiempo estimado: {PLAYLISTS[playlist_name]['estimated_time_hours']} horas")
    
    # Ejecutar en background
    try:
        process = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        print(f"✓ Proceso iniciado (PID: {process.pid})")
        return process
        
    except Exception as e:
        print(f"✗ Error al iniciar: {e}")
        return None

def main():
    print("""
╔════════════════════════════════════════════════════════════════════╗
║     PROCESADOR PARALELO DE PLAYLISTS                               ║
║     Kabbalah App - Extracción con IA                               ║
╚════════════════════════════════════════════════════════════════════╝
    """)
    
    # Ordenar por prioridad
    sorted_playlists = sorted(
        PLAYLISTS.items(),
        key=lambda x: x[1]['priority']
    )
    
    print("\n📋 Playlists a procesar:")
    for name, config in sorted_playlists:
        pending = count_pending_videos(name)
        print(f"   {config['priority']}. {name}: {pending} videos pendientes")
    
    print("\n⚠️  NOTA: Los procesos se ejecutarán secuencialmente")
    print("   debido a limitaciones de API de Ollama")
    
    print("\n🚀 Iniciando procesamiento automático...")
    # input("\n✋ Presiona ENTER para comenzar...")
    
    # Procesar cada playlist
    for name, config in sorted_playlists:
        pending = count_pending_videos(name)
        if pending > 0:
            process = process_playlist_background(name)
            if process:
                # Esperar a que termine antes de continuar
                print(f"\n⏳ Esperando a que termine {name}...")
                process.wait()
                print(f"✅ {name} completado")
        
        time.sleep(2)
    
    print("\n\n🎉 ¡Todos los procesos completados!")

if __name__ == "__main__":
    main()
