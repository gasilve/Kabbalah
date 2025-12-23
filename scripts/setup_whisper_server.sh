#!/bin/bash
# =============================================================
# SETUP WHISPER ON OLLAMA SERVER (192.168.100.21)
# Run this script on the server to set up Whisper transcription
# =============================================================

echo "=== Instalando Whisper en el servidor ==="

# 1. Instalar Whisper
pip install openai-whisper --user

# 2. Crear directorio de trabajo
mkdir -p ~/kabbalah_audios
mkdir -p ~/kabbalah_transcripciones

echo ""
echo "=== Whisper instalado ==="
echo ""
echo "Próximos pasos:"
echo "1. Copia los MP3s a este servidor:"
echo "   scp -r paparinots@TU_PC_IP:/c/Users/paparinots/Documents/Kabbalah/audios/secretos_zohar/*.mp3 ~/kabbalah_audios/"
echo ""
echo "2. Luego ejecuta el script de transcripción:"
echo "   python3 ~/transcribe_server.py"
