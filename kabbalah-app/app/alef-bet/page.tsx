'use client';

import Link from "next/link";
import { alfabetoHebreo } from "../data/content";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { motion } from "framer-motion";

export default function AlefBetPage() {
    return (
        <main className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="bg-background-surface/30 backdrop-blur-sm border-b border-accent-gold/20 py-4 px-4">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Link href="/" className="text-accent-gold hover:text-accent-silver">
                        ← Inicio
                    </Link>
                    <div className="text-sm text-gray-400">/ Alef-Bet</div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Título */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="text-5xl mb-3">🔤</div>
                    <h1 className="text-3xl font-bold mb-2 text-accent-gold">
                        Alef-Bet: Las 22 Letras Sagradas
                    </h1>
                    <p className="text-gray-400 text-sm max-w-xl mx-auto">
                        Cada letra es un universo. Toca el 🔊 para escuchar la pronunciación.
                    </p>
                </motion.div>

                {/* Grid de Letras con Audio */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                    {alfabetoHebreo.map((letra, idx) => (
                        <motion.div
                            key={letra.letra}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03 }}
                            className="relative group"
                        >
                            <div className="card-mystical p-4 hover:scale-105 hover:border-accent-gold/50 transition-all">
                                {/* Audio button */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <SpeakButton text={letra.nombre} type="letter" size="sm" />
                                </div>

                                <div className="text-4xl mb-1 text-accent-gold text-center">
                                    {letra.letra}
                                </div>
                                <div className="text-xs font-bold text-white text-center">
                                    {letra.nombre}
                                </div>
                                <div className="text-[10px] text-amber-400/70 text-center">
                                    {letra.valor}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Información Detallada con Audio */}
                <h2 className="text-xl font-bold text-accent-gold mb-4">Significados Profundos</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {alfabetoHebreo.map((letra, idx) => (
                        <motion.div
                            key={`detail-${letra.letra}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.02 }}
                            className="card-mystical p-4"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="text-3xl text-accent-gold">{letra.letra}</div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">
                                        {letra.nombre}
                                    </h3>
                                    <div className="text-xs text-amber-400/70">
                                        Gematria: {letra.valor}
                                    </div>
                                </div>
                                <SpeakButton text={letra.nombre} type="letter" size="md" />
                            </div>
                            <p className="text-sm text-gray-300">{letra.significado}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Info sobre Gematria */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 card-mystical p-6"
                >
                    <h2 className="text-xl font-bold mb-3 text-accent-gold">
                        ¿Qué es Gematria?
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                        La gematria es el sistema numerológico hebreo donde cada letra tiene un valor numérico.
                        Las palabras con el mismo valor total comparten conexiones místicas profundas.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                            <h3 className="font-bold mb-1 text-purple-300 text-sm">Letras Madres (אמש)</h3>
                            <p className="text-xs text-gray-400">
                                Alef, Mem, Shin - Representan aire, agua y fuego
                            </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                            <h3 className="font-bold mb-1 text-blue-300 text-sm">Letras Dobles</h3>
                            <p className="text-xs text-gray-400">
                                7 letras con pronunciación dual - Planetas y días
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
