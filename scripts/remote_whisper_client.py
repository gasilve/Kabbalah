import paramiko
import os
import sys
import time
import argparse
from pathlib import Path

# Configuration
SERVER_IP = "192.168.100.21"
USERNAME = "willy"
PASSWORD = "Passw0rd"
REMOTE_BASE = "/home/willy"
REMOTE_AUDIO_DIR = f"{REMOTE_BASE}/kabbalah_audios"
REMOTE_TRANSCRIPT_DIR = f"{REMOTE_BASE}/kabbalah_transcripciones"
LOCAL_BASE = Path("c:/Users/paparinots/Documents/Kabbalah")
LOCAL_AUDIO_DIR = LOCAL_BASE / "audios" / "secretos_zohar"
LOCAL_TRANSCRIPT_DIR = LOCAL_BASE / "transcripciones" / "secretos_zohar"

def create_ssh_client():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(SERVER_IP, username=USERNAME, password=PASSWORD, timeout=10)
        return client
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return None

def sync_up_audios(sftp):
    """Uploads missing MP3s to server"""
    print(f"\n📤 Syncing Audios UP to {REMOTE_AUDIO_DIR}...")
    
    # Ensure remote dir exists
    try:
        sftp.stat(REMOTE_AUDIO_DIR)
    except FileNotFoundError:
        sftp.mkdir(REMOTE_AUDIO_DIR)
        
    local_files = list(LOCAL_AUDIO_DIR.glob("*.mp3"))
    if not local_files:
        print("   No local MP3 files found.")
        return 0
        
    uploaded = 0
    for mp3 in local_files:
        remote_path = f"{REMOTE_AUDIO_DIR}/{mp3.name}"
        try:
            sftp.stat(remote_path)
            # File exists, skip (assume same)
        except FileNotFoundError:
            print(f"   ⬆️ Uploading {mp3.name}...")
            sftp.put(str(mp3), remote_path)
            uploaded += 1
            
    print(f"   Done. {uploaded} new files uploaded.")
    return uploaded

def run_remote_transcription(ssh):
    """Runs the transcription script on the server"""
    print(f"\n🎙️ Running Remote Whisper Transcription...")
    
    # First, ensure the script is there
    sftp = ssh.open_sftp()
    local_script = LOCAL_BASE / "scripts" / "transcribe_server.py"
    remote_script = f"{REMOTE_BASE}/transcribe_server.py"
    sftp.put(str(local_script), remote_script)
    sftp.close()
    
    # Execute
    stdin, stdout, stderr = ssh.exec_command(f"python3 -u {remote_script}")
    
    # Stream output
    for line in iter(stdout.readline, ""):
        print(line, end="")
        
    exit_status = stdout.channel.recv_exit_status()
    if exit_status != 0:
        print("❌ Remote script failed.")
        print(stderr.read().decode())
        return False
        
    return True

def sync_down_transcripts(sftp, quiet=False):
    """Downloads new transcripts from server"""
    if not quiet:
        print(f"\n📥 Syncing Transcripts DOWN from {REMOTE_TRANSCRIPT_DIR}...")
    
    try:
        files = sftp.listdir(REMOTE_TRANSCRIPT_DIR)
    except FileNotFoundError:
        if not quiet: print("   Remote transcript directory not found.")
        return 0
        
    downloaded = 0
    LOCAL_TRANSCRIPT_DIR.mkdir(parents=True, exist_ok=True)
    
    for filename in files:
        if filename.endswith(".json") or filename.endswith(".srt"):
            local_path = LOCAL_TRANSCRIPT_DIR / filename
            remote_path = f"{REMOTE_TRANSCRIPT_DIR}/{filename}"
            
            if not local_path.exists():
                if not quiet: print(f"   ⬇️ Downloading {filename}...")
                sftp.get(remote_path, str(local_path))
                downloaded += 1
                
                # Also verify .json3 compatibility if needed? 
                # Our pipeline uses .json mainly for AI now.
                
    if not quiet:
        print(f"   Done. {downloaded} new transcripts downloaded.")
    return downloaded

def sync_remote_transcripts():
    """Wrapper function for external import"""
    ssh = create_ssh_client()
    if not ssh: return 0
    try:
        sftp = ssh.open_sftp()
        return sync_down_transcripts(sftp, quiet=True)
    finally:
        ssh.close()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['full', 'sync', 'transcribe'], default='full',
                        help='Operation mode: full (sync UP, transcribe, sync DOWN), sync (only downloading results), transcribe (only running remote script)')
    args = parser.parse_args()

    print("="*60)
    print("REMOTE WHISPER CLIENT")
    print("="*60)
    
    ssh = create_ssh_client()
    if not ssh:
        return
        
    try:
        sftp = ssh.open_sftp()
        
        if args.mode in ['full', 'transcribe']:
            # 1. Upload Audios (only if full or explicit)
            if args.mode == 'full':
                sync_up_audios(sftp)
            
            # 2. Run Remote Processing
            success = run_remote_transcription(ssh)
            
            if not success:
               print("⚠️ Transcription reporting failure or interrupted.")

        if args.mode in ['full', 'sync']:
            # 3. Download Results
            sync_down_transcripts(sftp)
            
    finally:
        sftp.close()
        ssh.close()
        print("\n✅ Session closed.")

if __name__ == "__main__":
    main()
