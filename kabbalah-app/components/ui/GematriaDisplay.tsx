'use client';

import { calculateGematria } from "@/lib/gematria";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GematriaDisplayProps {
    word: string; // The Hebrew word
    translation?: string;
    className?: string;
}

export function GematriaDisplay({ word, translation, className = "" }: GematriaDisplayProps) {
    const [value, setValue] = useState(0);
    const [method, setMethod] = useState<'standard' | 'ordinal'>('standard');

    useEffect(() => {
        setValue(calculateGematria(word, method));
    }, [word, method]);

    return (
        <div className={`p-6 rounded-2xl bg-black/40 border border-accent-gold/20 backdrop-blur-md ${className}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="text-xs text-accent-gold uppercase tracking-widest font-bold mb-1">Guematria</h4>
                    <div className="flex gap-2 text-[10px] text-gray-400">
                        <button
                            onClick={() => setMethod('standard')}
                            className={`px-2 py-0.5 rounded-full transition-colors ${method === 'standard' ? 'bg-accent-gold text-black' : 'hover:text-white'}`}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setMethod('ordinal')}
                            className={`px-2 py-0.5 rounded-full transition-colors ${method === 'ordinal' ? 'bg-accent-gold text-black' : 'hover:text-white'}`}
                        >
                            Ordinal
                        </button>
                    </div>
                </div>
                <div className="text-right">
                    <motion.div
                        key={value}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-4xl font-serif font-bold text-white"
                    >
                        {value}
                    </motion.div>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="text-center flex-1 border-r border-white/10 last:border-0">
                    <span className="block text-3xl font-serif mb-1 text-white/90">{word}</span>
                    {translation && <span className="text-xs text-gray-500">{translation}</span>}
                </div>

                {/* Placeholder for "Resonant Words" - In a real app, this would query the DB */}
                <div className="flex-1 pl-4">
                    <p className="text-[10px] text-gray-500 mb-2">Resuena con:</p>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-300">
                            <span>Shalom</span>
                            <span className="text-accent-gold/70">{value}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-300">
                            <span>Mashiach</span>
                            <span className="text-accent-gold/70">{value}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
