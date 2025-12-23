"""
State Manager for Kabbalah Content Processing
Manages the global processing state across all playlists
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional


STATE_FILE = Path("c:/Users/paparinots/Documents/Kabbalah/processing_state.json")

def init_state() -> Dict:
    """Initialize empty state structure"""
    return {
        "secretos_zohar": {
            "phase": "whisper_transcription",
            "stats": {
                "total_videos": 167,
                "youtube_subs": 32,
                "mp3_downloaded": 71,
                "whisper_transcribed": 0,
                "ai_processed": 26,
                "verified": False
            },
            "pending": {
                "whisper": [],
                "ai": []
            },
            "completed": {
                "whisper": [],
                "ai": [],
                "cleanup": False
            },
            "last_updated": datetime.now().isoformat()
        },
        "arbol_vida": {
            "phase": "not_started",
            "stats": {
                "total_videos": 64,
                "youtube_subs": 22,
                "mp3_downloaded": 0,
                "whisper_transcribed": 0,
                "ai_processed": 0,
                "verified": False
            },
            "pending": {
                "whisper": [],
                "ai": []
            },
            "completed": {
                "whisper": [],
                "ai": [],
                "cleanup": False
            },
            "last_updated": None
        }
    }

def load_state() -> Dict:
    """Load state from file, create if doesn't exist"""
    if STATE_FILE.exists():
        try:
            with open(STATE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️ Error loading state: {e}")
            print("Creating new state file...")
    
    state = init_state()
    save_state(state)
    return state

def save_state(state: Dict):
    """Save state to file"""
    with open(STATE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, indent=2, ensure_ascii=False)

def update_phase(playlist: str, new_phase: str):
    """Update the current phase for a playlist"""
    state = load_state()
    state[playlist]["phase"] = new_phase
    state[playlist]["last_updated"] = datetime.now().isoformat()
    save_state(state)
    print(f"✅ {playlist}: fase actualizada a '{new_phase}'")

def increment_stat(playlist: str, stat_name: str, value: int = 1):
    """Increment a stat counter"""
    state = load_state()
    state[playlist]["stats"][stat_name] += value
    state[playlist]["last_updated"] = datetime.now().isoformat()
    save_state(state)

def mark_completed(playlist: str, item_id: str, category: str):
    """Mark an item as completed (whisper or ai)"""
    state = load_state()
    
    if item_id not in state[playlist]["completed"][category]:
        state[playlist]["completed"][category].append(item_id)
    
    # Remove from pending if exists
    if item_id in state[playlist]["pending"][category]:
        state[playlist]["pending"][category].remove(item_id)
    
    state[playlist]["last_updated"] = datetime.now().isoformat()
    save_state(state)

def add_pending(playlist: str, item_id: str, category: str):
    """Add an item to pending list"""
    state = load_state()
    
    if item_id not in state[playlist]["pending"][category]:
        state[playlist]["pending"][category].append(item_id)
    
    state[playlist]["last_updated"] = datetime.now().isoformat()
    save_state(state)

def mark_verified(playlist: str, verified: bool = True):
    """Mark playlist as verified"""
    state = load_state()
    state[playlist]["stats"]["verified"] = verified
    state[playlist]["last_updated"] = datetime.now().isoformat()
    save_state(state)

def mark_cleanup_done(playlist: str):
    """Mark cleanup as completed"""
    state = load_state()
    state[playlist]["completed"]["cleanup"] = True
    state[playlist]["last_updated"] = datetime.now().isoformat()
    save_state(state)

def get_playlist_state(playlist: str) -> Dict:
    """Get state for a specific playlist"""
    state = load_state()
    return state.get(playlist, {})

def get_current_phase(playlist: str) -> str:
    """Get current phase for a playlist"""
    state = load_state()
    return state.get(playlist, {}).get("phase", "unknown")

if __name__ == "__main__":
    # Test/initialize state
    print("Inicializando estado...")
    state = load_state()
    print(f"✅ Estado cargado desde: {STATE_FILE}")
    print(f"\nPlaylists configuradas:")
    for playlist, data in state.items():
        print(f"  - {playlist}: {data['phase']}")
