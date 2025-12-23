'use client';

import { useHebrewSpeech } from "@/hooks/useHebrewSpeech";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface SpeakButtonProps {
    text: string;
    type?: 'letter' | 'word' | 'phrase';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function SpeakButton({ text, type = 'word', size = 'md', className = '' }: SpeakButtonProps) {
    const { isSpeaking, speakLetter, speakWord, speakPhrase, stop, isSupported } = useHebrewSpeech();

    if (!isSupported) return null;

    const handleClick = () => {
        if (isSpeaking) {
            stop();
        } else {
            switch (type) {
                case 'letter':
                    speakLetter(text);
                    break;
                case 'word':
                    speakWord(text);
                    break;
                case 'phrase':
                    speakPhrase(text);
                    break;
            }
        }
    };

    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
    };

    const iconSizes = {
        sm: 'h-3 w-3',
        md: 'h-4 w-4',
        lg: 'h-5 w-5',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center
        transition-colors duration-200
        ${isSpeaking
                    ? 'bg-accent-gold text-background-deep'
                    : 'bg-white/10 text-white hover:bg-accent-gold/20 hover:text-accent-gold'
                }
        ${className}
      `}
            title={isSpeaking ? 'Detener' : 'Escuchar'}
        >
            {isSpeaking ? (
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    <VolumeX className={iconSizes[size]} />
                </motion.div>
            ) : (
                <Volume2 className={iconSizes[size]} />
            )}
        </motion.button>
    );
}
