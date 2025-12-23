'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';

const LANGUAGES = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱', rtl: true },
];

interface LanguageSelectorProps {
    currentLocale?: string;
    onChange?: (locale: string) => void;
}

export function LanguageSelector({ currentLocale = 'es', onChange }: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentLang = LANGUAGES.find(l => l.code === currentLocale) || LANGUAGES[0];

    const handleSelect = (code: string) => {
        setIsOpen(false);
        onChange?.(code);
        // In a real app, this would update the locale via next-intl
        // For now, we just close the dropdown
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
            >
                <span className="text-lg">{currentLang.flag}</span>
                <span className="text-white">{currentLang.name}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 right-0 w-40 rounded-xl overflow-hidden z-50"
                        style={{
                            background: 'rgba(15,15,35,0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors ${lang.rtl ? 'flex-row-reverse' : ''
                                    }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span className="text-sm text-white flex-1">{lang.name}</span>
                                {currentLocale === lang.code && (
                                    <Check className="h-4 w-4 text-accent-gold" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
