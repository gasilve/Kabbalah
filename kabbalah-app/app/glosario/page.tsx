'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hash, ChevronRight, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import glossaryData from '@/data/glossary.json';

export default function GlossaryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTerm, setSelectedTerm] = useState<any>(null);

    const filteredTerms = glossaryData.filter(item =>
        item.termino.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definicion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    // Group by first letter
    const groupedTerms = filteredTerms.reduce((acc: any, item) => {
        const firstLetter = item.termino[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(item);
        return acc;
    }, {});

    const sortedLetters = Object.keys(groupedTerms).sort();

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel px-6 py-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-display font-bold text-white tracking-tight">Diccionario de Kabbalah</h1>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar conceptos..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 px-6 pb-32">
                {/* Quick A-Z jump would be here, but for now just list */}

                {sortedLetters.map((letter) => (
                    <div key={letter} className="mt-8">
                        <h2 className="text-primary font-display font-black text-2xl mb-4 opacity-50">{letter}</h2>
                        <div className="space-y-2">
                            {groupedTerms[letter].map((term: any) => (
                                <div
                                    key={term.termino}
                                    onClick={() => setSelectedTerm(term)}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold">{term.termino}</span>
                                            <span className="text-primary font-serif text-sm">{term.hebreo}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-1">{term.definicion}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredTerms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p>No se encontraron términos</p>
                    </div>
                )}
            </main>

            {/* Detail Overlay */}
            <AnimatePresence>
                {selectedTerm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center"
                        onClick={() => setSelectedTerm(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full max-w-md bg-[#0B1026] rounded-t-3xl border-t border-white/10 p-8 pt-6 relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex flex-col">
                                    <h3 className="text-3xl font-display font-black text-primary drop-shadow-gold">{selectedTerm.termino}</h3>
                                    <p className="text-xl font-serif text-white/40 mt-1">{selectedTerm.hebreo}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTerm(null)}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            <div className="space-y-6 mt-8 overflow-y-auto max-h-[60vh] no-scrollbar">
                                <div>
                                    <h4 className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Definición</h4>
                                    <p className="text-white text-lg leading-relaxed font-light">{selectedTerm.definicion}</p>
                                </div>

                                {selectedTerm.explicacion && selectedTerm.explicacion !== selectedTerm.definicion && (
                                    <div>
                                        <h4 className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Explicación</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed">{selectedTerm.explicacion}</p>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Fuente</h4>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 text-[0.6rem] text-slate-400 border border-white/10 font-bold uppercase tracking-widest">
                                        {selectedTerm.fuente}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pb-4">
                                <button
                                    onClick={() => setSelectedTerm(null)}
                                    className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl shadow-glow-gold hover:scale-[0.98] transition-transform"
                                >
                                    Entendido
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
