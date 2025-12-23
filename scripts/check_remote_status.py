import paramiko

SERVER_IP = "192.168.100.21"
USERNAME = "willy"
PASSWORD = "Passw0rd"
REMOTE_TRANSCRIPT_DIR = "/home/willy/kabbalah_transcripciones"
REMOTE_AUDIO_DIR = "/home/willy/kabbalah_audios"

def check_status():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        print(f"Connecting to {SERVER_IP}...")
        client.connect(SERVER_IP, username=USERNAME, password=PASSWORD, timeout=10)
        
        sftp = client.open_sftp()
        
        # Check Audios
        print(f"\n🎧 Checking Audios in {REMOTE_AUDIO_DIR}...")
        try:
            audio_files = sftp.listdir(REMOTE_AUDIO_DIR)
            mp3_files = [f for f in audio_files if f.endswith('.mp3')]
            print(f"   ✅ Found {len(mp3_files)} MP3 files.")
        except FileNotFoundError:
            print(f"   ❌ Directory not found.")
            
        # Check Transcripts
        print(f"\n📝 Checking Transcripts in {REMOTE_TRANSCRIPT_DIR}...")
        try:
            files = sftp.listdir(REMOTE_TRANSCRIPT_DIR)
            srt_files = [f for f in files if f.endswith('.srt')]
            print(f"   ✅ Found {len(srt_files)} SRT files.")
        except FileNotFoundError:
            print(f"   ❌ Directory not found.")

        # Check Process
        print(f"\n⚙️ Checking Running Processes...")
        stdin, stdout, stderr = client.exec_command("ps aux | grep transcribe_server.py")
        output = stdout.read().decode()
        if "python3" in output and "transcribe_server.py" in output:
             print("   ✅ Whisper script is RUNNING.")
             print(output.strip())
        else:
             print("   ⚠️ Whisper script is NOT running.")
            
        sftp.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    check_status()
