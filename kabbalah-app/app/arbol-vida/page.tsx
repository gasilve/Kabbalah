'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, Lock, CheckCircle, Clock, Star } from "lucide-react";

// Tree of Life course data
const SEFIROT = [
    { name: 'Keter', nameEs: 'Corona', color: '#FFFFFF', desc: 'La voluntad divina', lessons: 5, unlocked: true },
    { name: 'Chokmah', nameEs: 'Sabiduría', color: '#A0A0A0', desc: 'Sabiduría primordial', lessons: 4, unlocked: true },
    { name: 'Binah', nameEs: 'Entendimiento', color: '#1E1E1E', desc: 'Comprensión profunda', lessons: 4, unlocked: true },
    { name: 'Chesed', nameEs: 'Bondad', color: '#60A5FA', desc: 'Amor incondicional', lessons: 6, unlocked: true },
    { name: 'Gevurah', nameEs: 'Fortaleza', color: '#EF4444', desc: 'Disciplina y poder', lessons: 5, unlocked: false },
    { name: 'Tiferet', nameEs: 'Belleza', color: '#FBBF24', desc: 'Equilibrio perfecto', lessons: 8, unlocked: false },
    { name: 'Netzach', nameEs: 'Victoria', color: '#10B981', desc: 'Eternidad y perseverancia', lessons: 4, unlocked: false },
    { name: 'Hod', nameEs: 'Esplendor', color: '#F97316', desc: 'Gloria y gratitud', lessons: 4, unlocked: false },
    { name: 'Yesod', nameEs: 'Fundamento', color: '#A855F7', desc: 'Conexión y transmisión', lessons: 5, unlocked: false },
    { name: 'Malkhut', nameEs: 'Reino', color: '#8B4513', desc: 'El mundo físico', lessons: 6, unlocked: false },
];

export default function ArbolVidaPage() {
    const completedLessons = 9;
    const totalLessons = SEFIROT.reduce((acc, s) => acc + s.lessons, 0);
    const progress = (completedLessons / totalLessons) * 100;

    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/90 backdrop-blur-xl border-b border-accent-gold/20 px-4 py-4">
                <div className="flex items-center gap-4 max-w-lg mx-auto">
                    <Link href="/explorar" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-serif font-bold text-white">Árbol de la Vida</h1>
                        <p className="text-[10px] text-gray-400">Las 10 Sefirot del Universo</p>
                    </div>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-2xl overflow-hidden mb-6"
                    style={{
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(251,191,36,0.2) 50%, rgba(59,130,246,0.3) 100%)',
                        border: '1px solid rgba(251,191,36,0.3)',
                    }}
                >
                    {/* Decorative Tree Symbol */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span className="text-[150px]">🌳</span>
                    </div>

                    <div className="relative p-6 text-center">
                        <motion.h2
                            className="text-3xl font-serif font-bold mb-2"
                            style={{
                                background: 'linear-gradient(135deg, #FBBF24 0%, #FDE68A 50%, #FBBF24 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 0 30px rgba(251,191,36,0.3)',
                            }}
                        >
                            עץ החיים
                        </motion.h2>
                        <p className="text-sm text-gray-300 mb-4">
                            Descubre el mapa del alma y la estructura del universo
                        </p>

                        {/* Progress */}
                        <div className="bg-black/30 rounded-xl p-4 mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-gray-400">Tu progreso</span>
                                <span className="text-xs text-accent-gold font-bold">{completedLessons}/{totalLessons} lecciones</span>
                            </div>
                            <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-accent-gold to-yellow-300 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Sefirot List */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent-gold" />
                    Las 10 Sefirot
                </h3>
                <div className="space-y-3">
                    {SEFIROT.map((sefirah, idx) => (
                        <motion.div
                            key={sefirah.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Link href={sefirah.unlocked ? `/arbol-vida/${sefirah.name.toLowerCase()}` : '#'}>
                                <div
                                    className={`p-4 rounded-xl flex items-center gap-4 transition-all ${sefirah.unlocked
                                            ? 'hover:bg-white/10 cursor-pointer'
                                            : 'opacity-50 cursor-not-allowed'
                                        }`}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: `1px solid ${sefirah.color}30`,
                                    }}
                                >
                                    {/* Sphere */}
                                    <div
                                        className="h-12 w-12 rounded-full flex items-center justify-center relative"
                                        style={{
                                            background: `radial-gradient(circle at 30% 30%, ${sefirah.color}, ${sefirah.color}80)`,
                                            boxShadow: `0 0 20px ${sefirah.color}40`,
                                        }}
                                    >
                                        {sefirah.unlocked ? (
                                            <span className="text-xs font-bold text-white drop-shadow-lg">
                                                {idx + 1}
                                            </span>
                                        ) : (
                                            <Lock className="h-4 w-4 text-white/70" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-white">{sefirah.nameEs}</h4>
                                            <span className="text-xs text-gray-500">({sefirah.name})</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">{sefirah.desc}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {sefirah.lessons} lecciones
                                            </span>
                                        </div>
                                    </div>

                                    {sefirah.unlocked ? (
                                        <Play className="h-5 w-5 text-accent-gold" />
                                    ) : (
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
