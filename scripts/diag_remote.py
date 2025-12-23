import paramiko
import time

SERVER_IP = "192.168.100.21"
USERNAME = "willy"
PASSWORD = "Passw0rd"

def run_remote_diag():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    print(f"🔌 Connecting to {SERVER_IP}...")
    try:
        client.connect(SERVER_IP, username=USERNAME, password=PASSWORD, timeout=5)
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    commands = [
        ("Checking Ollama Process", "ps aux | grep ollama"),
        ("Checking GPU Usage", "nvidia-smi"),
        ("Checking Ollama API (Local)", "curl -s http://localhost:11434/api/tags")
    ]

    for title, cmd in commands:
        print(f"\n--- {title} ---")
        try:
            stdin, stdout, stderr = client.exec_command(cmd, timeout=10)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error:
                print(f"[STDERR] {error}")
                
        except Exception as e:
            print(f"⚠️ Command execution failed: {e}")

    client.close()

if __name__ == "__main__":
    run_remote_diag()
