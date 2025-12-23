"""
Script wrapper para ejecutar descargas sin problemas de encoding
Redirige output a archivos log
"""
import subprocess
import sys
from datetime import datetime

def run_script(script_name, args, log_name):
    """Ejecuta un script y guarda output en log"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = f"logs/{log_name}_{timestamp}.log"
    
    print(f"Ejecutando: {script_name} {' '.join(args)}")
    print(f"Log: {log_file}")
    
    # Crear directorio de logs si no existe
    import os
    os.makedirs("logs", exist_ok=True)
    
    # Ejecutar script con output redirigido
    with open(log_file, 'w', encoding='utf-8') as f:
        process = subprocess.Popen(
            [sys.executable, script_name] + args,
            stdout=f,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8'
        )
        
        print(f"Proceso iniciado con PID: {process.pid}")
        return process, log_file

if __name__ == "__main__":
    processes = []
    
    # 1. Descargar audio hebreo
    print("\n[1/3] Iniciando descarga de audio hebreo...")
    p1, log1 = run_script("scripts/download_hebrew_audio.py", ["--all"], "audio_download")
    processes.append(("Audio Download", p1, log1))
    
    # 2. Procesar Árbol de Vida con IA
    print("\n[2/3] Iniciando procesamiento de Árbol de Vida...")
    p2, log2 = run_script("extract_content_ai.py", ["--playlist", "arbol_vida"], "arbol_vida_processing")
    processes.append(("Árbol Vida Processing", p2, log2))
    
    # 3. Continuar descargas de YouTube
    print("\n[3/3] Iniciando descargas de YouTube...")
    p3, log3 = run_script("scripts/download_all_playlists.py", [], "youtube_download")
    processes.append(("YouTube Download", p3, log3))
    
    print("\n" + "="*70)
    print("PROCESOS EN BACKGROUND INICIADOS")
    print("="*70)
    for name, proc, log in processes:
        print(f"  - {name}: PID {proc.pid} -> {log}")
    print("="*70)
    print("\nPuedes monitorear los logs en tiempo real:")
    print(f"  tail -f {log1}")
    print(f"  tail -f {log2}")
    print(f"  tail -f {log3}")
    print("\nLos procesos continuarán ejecutándose en segundo plano.")
