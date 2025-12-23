import paramiko
import sys

SERVER_IP = "192.168.100.21"
USERNAME = "willy"
PASSWORD = "Passw0rd"
REMOTE_TRANSCRIPT_DIR = "/home/willy/kabbalah_transcripciones"

TARGETS = [
    "iK6Uz6KjJVo.srt",
    "ki9E5c0CTug.srt",
    "aA7ba_FWnwY.srt", 
    "xMB7KkjGp-k.srt",
    "T4waX0ZgkdY.srt",
    "0IWsTxx9TSs.srt",
    "AA9WCAwde28.srt",
    "b4SHIFkmOcU.srt",
    "KJM7ociVLog.srt",
    "wlEtY3fphjY.srt"
]

def check():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(SERVER_IP, username=USERNAME, password=PASSWORD, timeout=10)
        sftp = client.open_sftp()
        
        print("Checking remote files:")
        found = 0
        for filename in TARGETS:
            remote_path = f"{REMOTE_TRANSCRIPT_DIR}/{filename}"
            try:
                sftp.stat(remote_path)
                print(f"✅ FOUND: {filename}")
                found += 1
            except FileNotFoundError:
                print(f"❌ MISSING: {filename}")
                
        print(f"\nSummary: {found}/{len(TARGETS)} found.")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    check()
