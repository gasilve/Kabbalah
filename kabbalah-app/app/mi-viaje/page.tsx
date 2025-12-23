'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import { Trophy, Star, Lock, ChevronUp } from "lucide-react";
import Image from 'next/image';

const SEFIROT_JOURNEY = [
    {
        id: 'malchut',
        name: 'Malchut',
        title: 'El Reino',
        level: 1,
        status: 'completed',
        desc: 'Conexión con la realidad física.',
        color: '#8B4513', // Tierra
        glow: 'rgba(139, 69, 19, 0.5)'
    },
    {
        id: 'yesod',
        name: 'Yesod',
        title: 'El Fundamento',
        level: 2,
        status: 'completed',
        desc: 'Rompiendo el ego y conectando.',
        color: '#A855F7', // Púrpura
        glow: 'rgba(168, 85, 247, 0.5)'
    },
    {
        id: 'hod',
        name: 'Hod',
        title: 'La Gloria',
        level: 3,
        status: 'active',
        desc: 'Humildad y agradecimiento.',
        color: '#F97316', // Naranja
        glow: 'rgba(249, 115, 22, 0.5)',
        image: '/spheres/prosperity.png' // Using prosperity sphere for Hod
    },
    {
        id: 'netzach',
        name: 'Netzach',
        title: 'La Eternidad',
        level: 4,
        status: 'locked',
        desc: 'Perseverancia y victoria.',
        color: '#10B981', // Verde
        glow: 'rgba(16, 185, 129, 0.5)',
        image: '/spheres/health.png' // Using health sphere for Netzach
    },
    {
        id: 'tiferet',
        name: 'Tiferet',
        title: 'La Belleza',
        level: 5,
        status: 'locked',
        desc: 'Equilibrio y compasión.',
        color: '#FBBF24', // Oro
        glow: 'rgba(251, 191, 36, 0.5)',
        image: '/spheres/tiferet.png'
    },
    {
        id: 'gevurah',
        name: 'Gevurah',
        title: 'La Fuerza',
        level: 6,
        status: 'locked',
        desc: 'Disciplina y límites.',
        color: '#DC2626', // Rojo
        glow: 'rgba(220, 38, 38, 0.5)'
    },
    {
        id: 'chesed',
        name: 'Chesed',
        title: 'La Misericordia',
        level: 7,
        status: 'locked',
        desc: 'Amor incondicional.',
        color: '#3B82F6', // Azul (using blue for Chesed here)
        glow: 'rgba(59, 130, 246, 0.5)',
        image: '/spheres/love.png' // Using love sphere (pink) -> maybe just use color logic or specific image
    },
];

export default function MyJourney() {
    return (
        <div className="min-h-screen pb-32 overflow-x-hidden relative">
            <AnimatedBackground />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 pt-6 pb-6 px-6 text-center bg-gradient-to-b from-slate-950/90 to-transparent backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-accent-gold/10 border border-accent-gold/20">
                        <Trophy className="w-4 h-4 text-accent-gold" />
                        <span className="text-[10px] text-accent-gold uppercase tracking-widest font-bold">Progreso</span>
                    </div>
                    <div className="relative h-24 w-full max-w-[300px] mx-auto mb-2">
                        <Image
                            src="/images/my-journey-heading.png"
                            alt="My Journey"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="text-gray-400 text-xs tracking-wider uppercase">Ascendiendo por el Árbol de la Vida</p>
                </motion.div>
            </header>

            <div className="max-w-md mx-auto relative mt-32 px-6">
                {/* Connecting Line - Mystical Beam */}
                <div className="absolute left-[2.85rem] top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-accent-gold/30 to-transparent blur-[2px]" />
                <div className="absolute left-[2.9rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-accent-gold/60 to-transparent" />

                <div className="space-y-12">
                    {SEFIROT_JOURNEY.map((sefirah, index) => (
                        <motion.div
                            key={sefirah.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-center gap-6 group"
                        >
                            {/* Node Indicator */}
                            <div className="relative z-10">
                                {/* Glow Effect */}
                                <div
                                    className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${sefirah.status === 'active' ? 'opacity-100 scale-150' : 'opacity-40 scale-100'}`}
                                    style={{ background: sefirah.glow }}
                                />

                                {/* Sphere/Icon */}
                                <div className={`
                                    relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full 
                                    transition-all duration-500 overflow-hidden
                                    ${sefirah.status === 'active'
                                        ? 'ring-4 ring-accent-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.3)] scale-110'
                                        : sefirah.status === 'completed'
                                            ? 'ring-2 ring-accent-gold/30 grayscale-0'
                                            : 'ring-2 ring-white/10 grayscale opacity-70'}
                                `}
                                    style={{
                                        background: `radial-gradient(circle at 30% 30%, ${sefirah.color}, #000)`,
                                        borderColor: sefirah.color
                                    }}>
                                    {sefirah.image ? (
                                        <Image
                                            src={sefirah.image}
                                            alt={sefirah.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl font-bold text-white drop-shadow-md">
                                            {sefirah.name[0]}
                                        </span>
                                    )}

                                    {/* Overlay Icon for status */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        {sefirah.status === 'completed' && <Star className="h-6 w-6 text-white drop-shadow-lg" fill="currentColor" />}
                                        {sefirah.status === 'locked' && <Lock className="h-6 w-6 text-white/50" />}
                                    </div>
                                </div>
                            </div>

                            {/* Content Card - Glassmorphism */}
                            <div className={`
                                flex-1 p-5 rounded-2xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden group-hover:scale-[1.02]
                                ${sefirah.status === 'active'
                                    ? 'bg-white/10 border-accent-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.1)]'
                                    : sefirah.status === 'completed'
                                        ? 'bg-gradient-to-r from-accent-gold/10 to-transparent border-accent-gold/20'
                                        : 'bg-black/40 border-white/5 opacity-60'}
                            `}>
                                {/* Shimmer Effect for Active Card */}
                                {sefirah.status === 'active' && (
                                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                                )}

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-serif font-bold text-lg text-white group-hover:text-accent-gold transition-colors">
                                            {sefirah.name}
                                        </h3>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                                            Nivel {sefirah.level}
                                        </span>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-accent-gold mb-2">{sefirah.title}</p>
                                    <p className="text-sm text-gray-300 leading-relaxed">{sefirah.desc}</p>

                                    {sefirah.status === 'active' && (
                                        <div className="mt-4 bg-black/40 p-3 rounded-xl border border-white/5">
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-xs text-gray-400">Progreso Actual</span>
                                                <span className="text-xs font-bold text-accent-gold">65%</span>
                                            </div>
                                            <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '65%' }}
                                                    transition={{ duration: 1.5, delay: 0.5 }}
                                                    className="h-full bg-gradient-to-r from-accent-gold to-orange-500 shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                                />
                                            </div>
                                            <button className="w-full mt-3 py-2 rounded-lg bg-accent-gold text-black text-xs font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-accent-gold/20 flex items-center justify-center gap-1">
                                                Continuar <ChevronUp className="w-3 h-3 rotate-90" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
