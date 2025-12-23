# Project Credentials & Server Configuration

## 🔒 Server Details (Ollama / Whisper)
**IP Address:** `192.168.100.21`
**User:** `willy`
**Password:** `Passw0rd`
**Port:** `22` (SSH), `11434` (Ollama)

## 🔑 Access Method
Ideally, SSH keys should be set up to avoid password prompts.
To set up keys (run from Windows):
```powershell
ssh-copy-id willy@192.168.100.21
```
(Enter password `Passw0rd` when prompted)

## 🤖 Services
- **Ollama**: `http://192.168.100.21:11434`
- **Whisper**: Python script `~/transcribe_server.py`

## 📂 Directories on Server
- **Audios:** `~/kabbalah_audios/`
- **Transcript:** `~/kabbalah_transcripciones/`
