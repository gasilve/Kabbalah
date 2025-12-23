import paramiko
import os
import sys
import time
import json
import shutil
from pathlib import Path
import subprocess

# Reuse config from remote_whisper_client
SERVER_IP = "192.168.100.21"
USERNAME = "willy"
PASSWORD = "Passw0rd"
REMOTE_BASE = "/home/willy"
REMOTE_AUDIO_DIR = f"{REMOTE_BASE}/kabbalah_audios"
REMOTE_TRANSCRIPT_DIR = f"{REMOTE_BASE}/kabbalah_transcripciones"

# Local config
LOCAL_BASE = Path("c:/Users/paparinots/Documents/Kabbalah")
RESCUE_BASE = LOCAL_BASE / "audios" / "rescue"
TRANSCRIPTS_BASE = LOCAL_BASE / "transcripciones"

# Mapping of file stems to their playlist folder (for correct placement)
# We build this as we scan files
file_playlist_map = {}

def create_ssh_client():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(SERVER_IP, username=USERNAME, password=PASSWORD, timeout=10)
        return client
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return None

def download_private_video():
    """Attempts to download the specific missing private video"""
    video_id = "6mRl5wsqPhs"
    playlist = "letras_hebreas"
    output_dir = RESCUE_BASE / playlist
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_template = output_dir / f"{video_id}.mp3"
    
    if output_template.exists():
        print(f"[OK] Video {video_id} already exists locally.")
        return

    print(f"[INFO] Attempting to download 'private' video {video_id}...")
    
    cmd = [
        "yt-dlp",
        "-x", "--audio-format", "mp3",
        "--output", str(output_dir / "%(id)s.%(ext)s"),
        f"https://www.youtube.com/watch?v={video_id}"
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"[OK] Successfully downloaded {video_id}")
    except subprocess.CalledProcessError:
        print(f"[ERR] Failed to download {video_id} (likely private/unavailable)")

def scan_rescue_files():
    """Scans audios/rescue and builds a list of files to process"""
    files_to_process = []
    
    print("\n[INFO] Scanning rescue directory...")
    for file_path in RESCUE_BASE.rglob("*.mp3"):
        playlist_name = file_path.parent.name
        file_playlist_map[file_path.stem] = playlist_name
        files_to_process.append(file_path)
        print(f"   Found: {file_path.name} ({playlist_name})")
        
    return files_to_process

def sync_up_audios(sftp, files):
    """Uploads specific files to server"""
    print(f"\n[INFO] Syncing {len(files)} Audios UP to {REMOTE_AUDIO_DIR}...")
    
    # Ensure remote dir exists
    try:
        sftp.stat(REMOTE_AUDIO_DIR)
    except FileNotFoundError:
        sftp.mkdir(REMOTE_AUDIO_DIR)
        
    uploaded = 0
    for mp3 in files:
        remote_path = f"{REMOTE_AUDIO_DIR}/{mp3.name}"
        try:
            sftp.stat(remote_path)
            # File exists, skip? Or overwrite? 
            # Let's overwrite if size differs, but for now just skip if exists to save time
            # actually server script needs it to not be processed, so existence is fine.
        except FileNotFoundError:
            print(f"   [UP] Uploading {mp3.name}...")
            sftp.put(str(mp3), remote_path)
            uploaded += 1
            
    print(f"   Done. {uploaded} new files uploaded.")

def run_remote_transcription(ssh):
    """Runs the transcription script on the server"""
    print(f"\n[INFO] Running Remote Whisper Transcription...")
    
    # Upload script first
    sftp = ssh.open_sftp()
    local_script = LOCAL_BASE / "scripts" / "transcribe_server.py"
    remote_script = f"{REMOTE_BASE}/transcribe_server.py"
    try:
        sftp.put(str(local_script), remote_script)
        print("   [OK] Script uploaded/updated")
    except Exception as e:
        print(f"   [ERR] Could not upload script: {e}")
    sftp.close()
    
    # Execute with unbuffered output
    cmd = f"python3 -u {remote_script}"
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    # Stream output
    for line in iter(stdout.readline, ""):
        try:
            print(line, end="")
        except UnicodeEncodeError:
            # Fallback for Windows console: replace non-encodable chars
            clean_line = line.encode(sys.stdout.encoding, errors='replace').decode(sys.stdout.encoding)
            print(clean_line, end="")
        
    exit_status = stdout.channel.recv_exit_status()
    if exit_status != 0:
        print("[ERR] Remote script failed.")
        print(stderr.read().decode())
        return False
        
    return True

def sync_down_and_distribute(sftp):
    """Downloads new transcripts and moves them to correct folders"""
    print(f"\n[INFO] Syncing Transcripts DOWN...")
    
    try:
        files = sftp.listdir(REMOTE_TRANSCRIPT_DIR)
    except FileNotFoundError:
        print("   Remote transcript directory not found.")
        return 0
        
    downloaded = 0
    
    for filename in files:
        if filename.endswith(".json") or filename.endswith(".srt"):
            file_stem = Path(filename).stem
            
            # Check if this file is one of our rescue files
            if file_stem in file_playlist_map:
                playlist = file_playlist_map[file_stem]
                target_dir = TRANSCRIPTS_BASE / playlist
                target_dir.mkdir(parents=True, exist_ok=True)
                
                local_path = target_dir / filename
                remote_path = f"{REMOTE_TRANSCRIPT_DIR}/{filename}"
                
                # Always download if we are rescuing (overwrite local placeholders if any)
                print(f"   [DOWN] Downloading {filename} -> {playlist}/")
                sftp.get(remote_path, str(local_path))
                downloaded += 1
                
    print(f"   Done. {downloaded} transcripts downloaded and sorted.")
    return downloaded

import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sync-only', action='store_true', help='Only download results, skip upload/transcribe')
    args = parser.parse_args()

    print("STARTING CRITICAL MISSING FILES RESCUE")
    
    # 2. Identify files (needed for mapping)
    rescue_files = scan_rescue_files()
    if not rescue_files:
        print("No files found in audios/rescue to process.")
        return

    # 3. Connect to server
    ssh = create_ssh_client()
    if not ssh:
        return
        
    try:
        sftp = ssh.open_sftp()
        
        if not args.sync_only:
            # 1. Video download
            download_private_video()
            
            # 4. Upload
            sync_up_audios(sftp, rescue_files)
            
            # 5. Transcribe
            success = run_remote_transcription(ssh)
            if not success:
                print("[WARN] Transcription reported failure (might be running in background). Checking for results anyway...")
        
        # 6. Download and Sort (Always run if successful or forced)
        sync_down_and_distribute(sftp)
            
    except Exception as e:
        print(f"[ERR] unexpected error: {e}")
    finally:
        if ssh: 
            ssh.close()
            print("[OK] Connection closed.")

if __name__ == "__main__":
    main()
