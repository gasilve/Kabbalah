'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Hash, Sparkles, RotateCcw } from 'lucide-react';

// Hebrew letter values for Gematria
const GEMATRIA_VALUES: Record<string, number> = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50,
    'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100,
    'ר': 200, 'ש': 300, 'ת': 400
};

// Famous Gematria equivalences
const FAMOUS_NUMBERS: Record<number, string[]> = {
    1: ['אחד (Echad - Uno)', 'א (Alef)'],
    13: ['אהבה (Ahavá - Amor)', 'אחד (Echad - Uno)'],
    18: ['חי (Chai - Vida)'],
    26: ['יהוה (YHVH - El Nombre)'],
    72: ['חסד (Chesed - Bondad)'],
    86: ['אלהים (Elohim - Dios)'],
    91: ['אמן (Amén)', 'יהוה + אדני'],
    112: ['יהוה אלהים'],
    137: ['קבלה (Kabbalah)'],
    314: ['שדי (Shaddai - Todopoderoso)'],
    541: ['ישראל (Israel)'],
    613: ['תריג מצוות (613 Mitzvot)'],
};

function calculateGematria(text: string): number {
    let total = 0;
    for (const char of text) {
        if (GEMATRIA_VALUES[char]) {
            total += GEMATRIA_VALUES[char];
        }
    }
    return total;
}

function reduceToSingleDigit(num: number): number {
    while (num > 9) {
        num = num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }
    return num;
}

export default function GematriaPage() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<number | null>(null);
    const [reducedResult, setReducedResult] = useState<number | null>(null);

    const handleCalculate = () => {
        const value = calculateGematria(input);
        setResult(value);
        setReducedResult(reduceToSingleDigit(value));
    };

    const handleClear = () => {
        setInput('');
        setResult(null);
        setReducedResult(null);
    };

    const equivalences = result ? FAMOUS_NUMBERS[result] || [] : [];

    return (
        <div className="min-h-screen pb-32 relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-violet-950/30 to-slate-950" />
            </div>

            <div className="relative z-10 px-6 pt-10">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <Calculator className="w-5 h-5 text-violet-400" />
                        <span className="text-xs text-violet-400 uppercase tracking-widest font-bold">Gematria</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">
                        Calculadora de Gematria
                    </h1>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                        Descubre el valor numérico oculto en las palabras hebreas
                    </p>
                </motion.header>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Escribe en Hebreo
                        </label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="שלום"
                            dir="rtl"
                            className="w-full px-4 py-4 text-3xl text-center bg-black/30 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500/50"
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleCalculate}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                            >
                                <Hash className="w-5 h-5" />
                                Calcular
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Results */}
                {result !== null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        {/* Main Result */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-500/30 text-center">
                            <p className="text-sm text-violet-300 mb-2">Valor Gematria</p>
                            <p className="text-6xl font-bold text-white mb-2">{result}</p>
                            <p className="text-sm text-gray-400">
                                Reducido: <span className="text-violet-400 font-bold">{reducedResult}</span>
                            </p>
                        </div>

                        {/* Letter Breakdown */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Desglose por letra</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {input.split('').map((char, idx) => (
                                    GEMATRIA_VALUES[char] && (
                                        <div key={idx} className="px-3 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
                                            <span className="block text-xl text-white">{char}</span>
                                            <span className="text-xs text-violet-400">{GEMATRIA_VALUES[char]}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        {/* Equivalences */}
                        {equivalences.length > 0 && (
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <p className="text-xs text-amber-300 uppercase tracking-wider">Equivalencias famosas</p>
                                </div>
                                <div className="space-y-2">
                                    {equivalences.map((eq, idx) => (
                                        <p key={idx} className="text-sm text-amber-100">{eq}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Hebrew Keyboard Helper */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                >
                    <p className="text-xs text-gray-500 text-center mb-3">Letras hebreas</p>
                    <div className="flex flex-wrap justify-center gap-1">
                        {Object.keys(GEMATRIA_VALUES).slice(0, 22).map((letter) => (
                            <button
                                key={letter}
                                onClick={() => setInput(prev => prev + letter)}
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-lg text-gray-300 hover:bg-violet-500/20 hover:border-violet-500/30 transition-colors"
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
