"""
WATCHDOG - Monitor de Procesos en Background
==============================================
Verifica cada 5 minutos que el master processor esté corriendo.
Si detecta que se detuvo, envía una notificación y opcionalmente reinicia.
"""

import time
import subprocess
import sys
import os
from datetime import datetime
from pathlib import Path

# Configuración
CHECK_INTERVAL_SECONDS = 300  # 5 minutos
LOG_FILE = Path('logs/watchdog.log')
PROCESS_NAME = 'master_playlist_processor.py'
AUTO_RESTART = True  # Si True, reinicia automáticamente; si False, solo notifica

def log(msg):
    """Log con timestamp"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log_msg = f"[{timestamp}] {msg}"
    
    print(log_msg)
    sys.stdout.flush()
    
    # Asegurar que el directorio de logs existe
    LOG_FILE.parent.mkdir(exist_ok=True)
    
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(log_msg + '\n')

def is_process_running():
    """Verifica si el master processor está corriendo"""
    try:
        # Buscar procesos de Python ejecutando el script
        result = subprocess.run(
            ['powershell', '-Command', 
             f'Get-Process python -ErrorAction SilentlyContinue | Where-Object {{$_.Path -like "*python*"}}'],
            capture_output=True,
            text=True
        )
        
        # Verificar si hay algún proceso python activo
        # (esto es una aproximación - idealmente verificaríamos el comando específico)
        if result.stdout and 'python' in result.stdout.lower():
            return True
        return False
    except Exception as e:
        log(f"Error verificando proceso: {e}")
        return False

def count_processed_files():
    """Cuenta archivos procesados"""
    output_dir = Path('contenido_procesado')
    if not output_dir.exists():
        return 0
    return len(list(output_dir.glob('*_extracted.json')))

def restart_process():
    """Reinicia el master processor"""
    log("Intentando reiniciar el proceso...")
    
    try:
        # Ejecutar en background
        cmd = [sys.executable, 'master_playlist_processor.py']
        
        # En Windows, usar CREATE_NO_WINDOW para ejecutar en background
        if sys.platform == 'win32':
            # Usar subprocess with detached process
            subprocess.Popen(
                cmd,
                creationflags=subprocess.CREATE_NEW_CONSOLE | subprocess.DETACHED_PROCESS,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        else:
            subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        log("Proceso reiniciado exitosamente")
        return True
    except Exception as e:
        log(f"Error reiniciando proceso: {e}")
        return False

def main():
    log("="*70)
    log("WATCHDOG - Iniciando monitoreo")
    log(f"Verificando cada {CHECK_INTERVAL_SECONDS} segundos")
    log(f"Auto-restart: {'ACTIVADO' if AUTO_RESTART else 'DESACTIVADO'}")
    log("="*70)
    
    last_file_count = count_processed_files()
    consecutive_failures = 0
    
    while True:
        try:
            # Verificar si el proceso está corriendo
            is_running = is_process_running()
            current_file_count = count_processed_files()
            
            if not is_running:
                consecutive_failures += 1
                log(f"ALERTA: Proceso NO está corriendo (fallo #{consecutive_failures})")
                log(f"Archivos procesados: {current_file_count}")
                
                if AUTO_RESTART:
                    if consecutive_failures >= 2:
                        # Reiniciar solo después de 2 verificaciones fallidas
                        log("Reiniciando proceso automáticamente...")
                        if restart_process():
                            consecutive_failures = 0
                            # Esperar 30 segundos para que el proceso inicie
                            time.sleep(30)
                    else:
                        log("Esperando próxima verificación antes de reiniciar...")
                else:
                    log("ACCION REQUERIDA: Reinicie manualmente el proceso")
                    log("Comando: python master_playlist_processor.py")
            else:
                # Proceso está corriendo
                if consecutive_failures > 0:
                    log(f"Proceso recuperado después de {consecutive_failures} fallos")
                    consecutive_failures = 0
                
                # Verificar progreso
                if current_file_count > last_file_count:
                    log(f"Progreso: {current_file_count} archivos procesados (+{current_file_count - last_file_count})")
                    last_file_count = current_file_count
                elif current_file_count == last_file_count and current_file_count > 0:
                    log(f"Sin cambios: {current_file_count} archivos (proceso puede estar en pausa)")
            
            # Esperar hasta la próxima verificación
            time.sleep(CHECK_INTERVAL_SECONDS)
            
        except KeyboardInterrupt:
            log("Watchdog detenido por el usuario")
            break
        except Exception as e:
            log(f"Error en watchdog: {e}")
            time.sleep(CHECK_INTERVAL_SECONDS)

if __name__ == "__main__":
    main()
