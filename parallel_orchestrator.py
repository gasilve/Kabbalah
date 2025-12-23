import multiprocessing
import subprocess
import sys
import time
import os
from datetime import datetime
from pathlib import Path

# Configuración
SCRIPTS_DIR = Path("scripts")
LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

def run_downloader():
    """Ejecuta el proceso de descarga continuo"""
    log_file = LOG_DIR / f"downloader_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    print(f"[DOWNLOADER] Iniciando proceso de descarga... (Log: {log_file})")
    
    cmd = [sys.executable, "-u", str(SCRIPTS_DIR / "download_all_playlists.py")]
    
    with open(log_file, "w", encoding='utf-8') as f:
        # Loop infinito (el script de descarga podría terminar si no hay nada, 
        # pero queremos que reintente periódicamente si falló algo)
        while True:
            try:
                proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8')
                
                # Stream output to log and console prefix
                for line in proc.stdout:
                    f.write(line)
                    f.flush()
                    # Opcional: imprimir en consola principal con prefijo
                    # print(f"[DL] {line.strip()}")
                
                proc.wait()
                
                if proc.returncode == 0:
                    f.write("\n[DOWNLOADER] Ciclo completado exitosamente. Esperando 60s...\n")
                    time.sleep(60)
                else:
                    f.write(f"\n[DOWNLOADER] Error (código {proc.returncode}). Reintentando en 30s...\n")
                    time.sleep(30)
                    
            except Exception as e:
                f.write(f"\n[DOWNLOADER] Excepción: {e}\n")
                time.sleep(30)

def run_processor_ollama():
    """Ejecuta el proceso de extracción IA continuo"""
    log_file = LOG_DIR / f"processor_ai_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    print(f"[PROCESSOR] Iniciando proceso IA con Ollama... (Log: {log_file})")
    
    # Procesar playlist por playlist
    playlists = ['sefer_yetzirah', 'arbol_vida', 'tefila', 'secretos_zohar']
    
    cmd_base = [sys.executable, "-u", str(SCRIPTS_DIR / "extract_content_ai.py")]
    
    with open(log_file, "w", encoding='utf-8') as f:
        while True:
            for playlist in playlists:
                f.write(f"\n[PROCESSOR] Procesando playlist: {playlist}\n")
                
                cmd = cmd_base + ["--playlist", playlist]
                
                try:
                    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8')
                    
                    for line in proc.stdout:
                        f.write(line)
                        f.flush()
                    
                    proc.wait()
                    
                except Exception as e:
                    f.write(f"\n[PROCESSOR] Error en {playlist}: {e}\n")
            
            f.write("\n[PROCESSOR] Ciclo de todas las playlists completado. Esperando 120s antes de reiniciar...\n")
            time.sleep(120)

def monitor_progress():
    """Monitorea el estado de las carpetas"""
    while True:
        os.system('cls' if os.name == 'nt' else 'clear')
        print("="*60)
        print(f"  MONITOR DE PROCESO PARALELO - {datetime.now().strftime('%H:%M:%S')}")
        print("="*60)
        
        # Contar archivos
        base_dir = Path("transcripciones")
        output_dir = Path("contenido_procesado")
        
        print(f"{'PLAYLIST':<20} | {'DESCARGADOS':<12} | {'PROCESADOS IA':<12}")
        print("-" * 50)
        
        total_dl = 0
        total_ai = 0
        
        if base_dir.exists():
            for d in base_dir.iterdir():
                if d.is_dir():
                    # Contar json y json3
                    dl_count = len(list(d.glob("*.json"))) + len(list(d.glob("*.json3")))
                    
                    # Contar procesados (esto es aproximado, idealmente leeríamos metadata)
                    # El script extract_content_ai guarda como {source_stem}_extracted.json
                    # Podemos buscar cuántos extracted coinciden con archivos de esta carpeta
                    ai_count = 0
                    if output_dir.exists():
                        # Un método simple es contar por prefijo si los nombres de archivo son únicos
                        # O simplemente contar totales globales por ahora para velocidad
                        pass 
                    
                    print(f"{d.name:<20} | {dl_count:<12} | {'?':<12}")
                    total_dl += dl_count
        
        print("-" * 50)
        
        # Contar total procesado real
        if output_dir.exists():
            total_ai = len(list(output_dir.glob("*_extracted.json")))
        
        print(f"TOTAL GLOBAL: Descargados: {total_dl} | Procesados IA: {total_ai}")
        print("\nPresiona Ctrl+C para detener todo.")
        
        time.sleep(10)

if __name__ == "__main__":
    # Crear procesos
    p1 = multiprocessing.Process(target=run_downloader)
    p2 = multiprocessing.Process(target=run_processor_ollama)
    
    try:
        p1.start()
        p2.start()
        
        # El proceso principal actúa como monitor
        monitor_progress()
        
    except KeyboardInterrupt:
        print("\n\nDeteniendo procesos...")
        p1.terminate()
        p2.terminate()
        p1.join()
        p2.join()
        print("Finalizado.")
