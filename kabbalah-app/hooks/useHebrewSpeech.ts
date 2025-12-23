'use client';

import { useState, useCallback, useEffect } from 'react';

// Hebrew voice configuration
const HEBREW_VOICE_CONFIG = {
    lang: 'he-IL',  // Hebrew (Israel)
    rate: 0.8,      // Slower for clarity
    pitch: 1.0,
    volume: 1.0,
};

// Fallback to similar languages if Hebrew not available
const FALLBACK_LANGS = ['he', 'iw', 'ar-SA', 'ar'];

export function useHebrewSpeech() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

    // Initialize and find best Hebrew voice
    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            setIsSupported(false);
            return;
        }

        setIsSupported(true);

        const findHebrewVoice = () => {
            const voices = speechSynthesis.getVoices();

            // Try to find Hebrew voice
            let voice = voices.find(v => v.lang.startsWith('he'));

            // Fallback to other similar languages
            if (!voice) {
                for (const lang of FALLBACK_LANGS) {
                    voice = voices.find(v => v.lang.startsWith(lang));
                    if (voice) break;
                }
            }

            // Last resort: use any available voice
            if (!voice && voices.length > 0) {
                voice = voices[0];
            }

            setSelectedVoice(voice || null);
        };

        // Voices may load asynchronously
        findHebrewVoice();
        speechSynthesis.addEventListener('voiceschanged', findHebrewVoice);

        return () => {
            speechSynthesis.removeEventListener('voiceschanged', findHebrewVoice);
        };
    }, []);

    const speak = useCallback((text: string, options?: Partial<typeof HEBREW_VOICE_CONFIG>) => {
        if (!isSupported || !text) return;

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Apply voice if available
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Apply configuration
        utterance.lang = options?.lang || HEBREW_VOICE_CONFIG.lang;
        utterance.rate = options?.rate || HEBREW_VOICE_CONFIG.rate;
        utterance.pitch = options?.pitch || HEBREW_VOICE_CONFIG.pitch;
        utterance.volume = options?.volume || HEBREW_VOICE_CONFIG.volume;

        // Event handlers
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        speechSynthesis.speak(utterance);
    }, [isSupported, selectedVoice]);

    const speakLetter = useCallback((letter: string) => {
        // Add a pause after the letter for clarity
        speak(letter, { rate: 0.6 });
    }, [speak]);

    const speakWord = useCallback((word: string) => {
        speak(word, { rate: 0.7 });
    }, [speak]);

    const speakPhrase = useCallback((phrase: string) => {
        speak(phrase, { rate: 0.85 });
    }, [speak]);

    const stop = useCallback(() => {
        if (isSupported) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [isSupported]);

    return {
        isSupported,
        isSpeaking,
        hasHebrewVoice: !!selectedVoice,
        voiceName: selectedVoice?.name || 'No voice',
        speak,
        speakLetter,
        speakWord,
        speakPhrase,
        stop,
    };
}
