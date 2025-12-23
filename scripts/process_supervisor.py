import subprocess
import time
import sys
import os
from datetime import datetime

# Configuración
RETRY_DELAY_SECONDS = 60  # Espera antes de reiniciar si falla
SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

# Lista de tareas a supervisar
# Cada tarea es (Nombre, Archivo Script, Argumentos)
TASKS = [
    {
        "name": "Audio Hebreo",
        "script": "download_hebrew_audio.py",
        "args": ["--all"],
        "critical": False # Si falla, seguimos con lo siguiente
    },
    {
        "name": "Descarga Subtítulos (Todas las Playlists)",
        "script": "download_all_subtitles.py",
        "args": [],
        "critical": True # Necesario para la IA
    },
    {
        "name": "Procesamiento IA (Secretos del Zohar)",
        "script": "extract_content_ai.py",
        "args": ["--playlist", "secretos_zohar"],
        "critical": False
    },
    # Agrega más playlists aquí si es necesario
    # {
    #    "name": "Procesamiento IA (Árbol de la Vida)",
    #    "script": "extract_content_ai.py",
    #    "args": ["--playlist", "arbol_vida"],
    #    "critical": False
    # }
]

def log(msg):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"[{timestamp}] [SUPERVISOR] {msg}")
    sys.stdout.flush()

def run_script(task):
    script_path = os.path.join(SCRIPTS_DIR, task['script'])
    cmd = [sys.executable, script_path] + task['args']
    
    log(f"Iniciando tarea: {task['name']}...")
    log(f"Comando: {' '.join(cmd)}")

    while True:
        try:
            # Ejecutar y esperar a que termine
            # Se usa subprocess.run para bloquear hasta que termine una iteración del script hijo
            start_time = time.time()
            result = subprocess.run(cmd, cwd=SCRIPTS_DIR, capture_output=False)
            duration = time.time() - start_time
            
            if result.returncode == 0:
                log(f"✅ Tarea '{task['name']}' completada exitosamente en {duration:.1f}s.")
                return True
            else:
                log(f"⚠️ Tarea '{task['name']}' terminó con error (Código {result.returncode}).")
                log(f"⏳ Reintentando en {RETRY_DELAY_SECONDS} segundos...")
                time.sleep(RETRY_DELAY_SECONDS)
                
        except KeyboardInterrupt:
            log("🛑 Supervisor detenido por el usuario.")
            sys.exit(0)
        except Exception as e:
            log(f"🔥 Error crítico ejecutando '{task['name']}': {e}")
            log(f"⏳ Reintentando en {RETRY_DELAY_SECONDS} segundos...")
            time.sleep(RETRY_DELAY_SECONDS)

def main():
    log("🚀 Iniciando Supervisor de Procesos Kabbalah")
    log(f"Directorio de scripts: {SCRIPTS_DIR}")
    
    # Bucle principal: Intenta completar toda la secuencia
    # Si una tarea "crítica" falla repetidamente, el bucle run_script se encarga de reintentar infinitamente
    # hasta que pase.
    
    for task in TASKS:
        run_script(task)
        
    log("🎉 Todas las tareas programadas han finalizado.")

if __name__ == "__main__":
    main()
