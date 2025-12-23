'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hebrewAlphabet, prayerConnections, calculateGematria } from '@/lib/hebrew-alphabet';
import { SpeakButton } from '@/components/ui/SpeakButton';
import { Card } from '@/components/ui/Card';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { BookOpen, Star, Volume2 } from 'lucide-react';

export default function AlefBetOracionesPage() {
    const [selectedLetter, setSelectedLetter] = useState(hebrewAlphabet[0]);
    const [showPrayers, setShowPrayers] = useState(false);

    return (
        <div className="min-h-screen relative pb-24">
            <AnimatedBackground />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        אלף־בית עברי
                    </h1>
                    <p className="text-xl text-accent-gold">
                        Alfabeto Hebreo Conectado con Oraciones
                    </p>
                    <p className="text-white/70 mt-2">
                        22 letras sagradas del Alef-Bet
                    </p>
                </motion.div>

                {/* Alphabet Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3 mb-8">
                    {hebrewAlphabet.map((letter, index) => (
                        <motion.button
                            key={letter.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setSelectedLetter(letter);
                                setShowPrayers(false);
                            }}
                            className={`
                aspect-square rounded-xl p-3 transition-all duration-300
                ${selectedLetter.name === letter.name
                                    ? 'bg-gradient-to-br from-accent-gold to-accent-gold/70 shadow-lg shadow-accent-gold/50'
                                    : 'bg-white/10 hover:bg-white/20'
                                }
              `}
                        >
                            <div className="text-3xl md:text-4xl font-bold text-white">
                                {letter.letter}
                            </div>
                            <div className="text-xs text-white/70 mt-1">
                                {letter.name}
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Selected Letter Detail */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedLetter.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="p-8">
                            {/* Letter Display */}
                            <div className="flex items-start gap-8 mb-8">
                                <div className="flex-shrink-0">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent-gold to-accent-gold/50 flex items-center justify-center">
                                        <span className="text-7xl text-white font-bold">
                                            {selectedLetter.letter}
                                        </span>
                                    </div>
                                    <div className="text-center mt-3">
                                        <SpeakButton
                                            text={selectedLetter.letter}
                                            type="letter"
                                            size="lg"
                                            className="mx-auto"
                                        />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {selectedLetter.name} - {selectedLetter.nameHebrew}
                                    </h2>
                                    <p className="text-accent-gold text-lg mb-4">
                                        {selectedLetter.phonetic}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <div className="text-white/60 text-sm">Gematria</div>
                                            <div className="text-2xl font-bold text-accent-gold">
                                                {selectedLetter.gematriaValue}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-white/60 text-sm">Significado Literal</div>
                                            <div className="text-lg text-white">
                                                {selectedLetter.meaningLiteral}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                                <Star className="w-4 h-4 text-accent-gold" />
                                                Significado Místico
                                            </h3>
                                            <p className="text-white/80">
                                                {selectedLetter.meaningMystical}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-white font-semibold mb-2">
                                                Simbolismo
                                            </h3>
                                            <p className="text-white/80">
                                                {selectedLetter.symbolism}
                                            </p>
                                        </div>

                                        {selectedLetter.seferYetzirahRef && (
                                            <div>
                                                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                                    <BookOpen className="w-4 h-4 text-accent-gold" />
                                                    Sefer Yetzirah
                                                </h3>
                                                <p className="text-white/80">
                                                    {selectedLetter.seferYetzirahRef}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Related Prayers */}
                            {selectedLetter.prayers && selectedLetter.prayers.length > 0 && (
                                <div className="border-t border-white/10 pt-6">
                                    <button
                                        onClick={() => setShowPrayers(!showPrayers)}
                                        className="w-full text-left"
                                    >
                                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
                                            Oraciones Relacionadas
                                            <motion.span
                                                animate={{ rotate: showPrayers ? 180 : 0 }}
                                                className="text-accent-gold"
                                            >
                                                ▼
                                            </motion.span>
                                        </h3>
                                    </button>

                                    <AnimatePresence>
                                        {showPrayers && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-4"
                                            >
                                                {selectedLetter.prayers.map(prayerName => {
                                                    const prayer = prayerConnections[prayerName as keyof typeof prayerConnections];
                                                    if (!prayer) return null;

                                                    return (
                                                        <div
                                                            key={prayerName}
                                                            className="bg-white/5 rounded-lg p-4"
                                                        >
                                                            <h4 className="text-lg font-semibold text-accent-gold mb-2">
                                                                {prayerName}
                                                            </h4>
                                                            <div className="text-2xl text-white mb-2 text-right font-hebrew">
                                                                {prayer.text}
                                                            </div>
                                                            <p className="text-white/70 text-sm italic">
                                                                {prayer.translation}
                                                            </p>
                                                            <div className="mt-3 text-xs text-white/50">
                                                                Kavanah: {prayer.kavanah}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {/* Gematria Calculator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl mx-auto mt-8"
                >
                    <Card className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">
                            Calculadora de Gematria
                        </h3>
                        <p className="text-white/60 text-sm mb-4">
                            La letra {selectedLetter.name} ({selectedLetter.letter}) tiene el valor {selectedLetter.gematriaValue}
                        </p>
                        <div className="text-accent-gold text-sm">
                            Próximamente: calculadora interactiva de gematria
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
