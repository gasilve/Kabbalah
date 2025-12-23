import paramiko
import time
import sys

SERVER_IP = "192.168.100.21"
USERNAME = "willy"
PASSWORD = "Passw0rd"

def run_remote_orchestration():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        print(f"Connecting to {SERVER_IP}...")
        client.connect(SERVER_IP, username=USERNAME, password=PASSWORD, timeout=10)
        
        # 1. Check if already running
        stdin, stdout, stderr = client.exec_command("ps aux | grep download_on_server.py | grep -v grep")
        output = stdout.read().decode()
        
        if "python3" in output:
            print("✅ Download script is already running on the server.")
        else:
            print("🚀 Starting download script on server...")
            # We need to use nohup and redirect all outputs
            client.exec_command("nohup python3 /home/willy/download_on_server.py > /home/willy/download_zohar.log 2>&1 &")
            time.sleep(2)  # Give it a moment to start
            print("✅ Launched successfully.")

        # 2. Show tail of the log
        print("\n--- Latest Log Entries from Server ---")
        stdin, stdout, stderr = client.exec_command("tail -n 15 /home/willy/download_zohar.log")
        print(stdout.read().decode())
        
        print("\n[INFO] The process will continue running on the server background.")
        print("[INFO] You can monitor it later checking /home/willy/download_zohar.log")

    except Exception as e:
        print(f"❌ Error during remote orchestration: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    run_remote_orchestration()
