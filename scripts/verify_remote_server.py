"""
Verify Remote Server Files
Checks if transcriptions exists on the remote Ollama/Whisper server
"""

import os
import paramiko
from dotenv import load_dotenv
from pathlib import Path

# Load env
env_path = Path("c:/Users/paparinots/Documents/Kabbalah/.env")
load_dotenv(env_path)

HOST = os.getenv("SSH_HOST", "192.168.100.21")
USER = os.getenv("SSH_USER", "willy")
PASS = os.getenv("SSH_PASS", "Passw0rd")

def verify_server():
    print(f"\n Conectando a {USER}@{HOST}...")
    
    try:
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(HOST, username=USER, password=PASS, timeout=10)
        
        print(f" [OK] Conectado exitosamente")
        
        # Check directories
        dirs_to_check = [
            "~/kabbalah_transcripciones",
            "~/kabbalah_audios"
        ]
        
        for d in dirs_to_check:
            stdin, stdout, stderr = client.exec_command(f"ls -1 {d} | head -n 5")
            files = stdout.read().decode().strip().split('\n')
            error = stderr.read().decode().strip()
            
            print(f"\n Verificando {d}:")
            
            if error and "No such file" in error:
                print(f"  [MISSING] Carpeta no existe")
            elif not files or files == ['']:
                 print(f"  [EMPTY] Carpeta vacia")
            else:
                print(f"  [OK] Archivos encontrados ({len(files)}+):")
                for f in files:
                    print(f"    - {f}")
                    
        client.close()
        return True
        
    except Exception as e:
        print(f" [ERROR] Fallo conexion: {e}")
        return False

if __name__ == "__main__":
    verify_server()
