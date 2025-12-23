import paramiko

# Configuration
SERVER_IP = "192.168.100.21"
USERNAME = "willy"
PASSWORD = "Passw0rd"

def test_remote():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        print(f"Connecting to {SERVER_IP}...")
        client.connect(SERVER_IP, username=USERNAME, password=PASSWORD, timeout=10)
        print("Connected.")
        
        print("Testing 'ls -la'...")
        stdin, stdout, stderr = client.exec_command("ls -la /home/willy/kabbalah_audios")
        print("STDOUT:", stdout.read().decode())
        print("STDERR:", stderr.read().decode())
        
        print("Testing 'python3 --version'...")
        stdin, stdout, stderr = client.exec_command("python3 --version")
        print("STDOUT:", stdout.read().decode())
        print("STDERR:", stderr.read().decode())

        print("Testing 'pip show openai-whisper'...")
        stdin, stdout, stderr = client.exec_command("pip3 show openai-whisper")
        print("STDOUT:", stdout.read().decode())
        print("STDERR:", stderr.read().decode())
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    test_remote()
