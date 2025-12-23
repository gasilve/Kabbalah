'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Play, Lock, Clock, BookOpen, ChevronRight } from "lucide-react";

// Zohar course chapters
const ZOHAR_CHAPTERS = [
    {
        id: 'bereshit',
        title: 'Bereshit (בראשית)',
        titleEs: 'Génesis',
        lessons: 12,
        completedLessons: 5,
        desc: 'Los secretos de la creación del universo',
        unlocked: true,
    },
    {
        id: 'noaj',
        title: 'Noaj (נח)',
        titleEs: 'Noé',
        lessons: 8,
        completedLessons: 0,
        desc: 'El arca y la protección espiritual',
        unlocked: true,
    },
    {
        id: 'lej-leja',
        title: 'Lej Lejá (לך לך)',
        titleEs: 'Vete por ti',
        lessons: 10,
        completedLessons: 0,
        desc: 'El viaje del alma hacia la luz',
        unlocked: false,
    },
    {
        id: 'vayera',
        title: 'Vayerá (וירא)',
        titleEs: 'Y apareció',
        lessons: 9,
        completedLessons: 0,
        desc: 'Revelaciones y visiones angelicales',
        unlocked: false,
    },
];

export default function ZoharPage() {
    const totalLessons = ZOHAR_CHAPTERS.reduce((acc, c) => acc + c.lessons, 0);
    const completedLessons = ZOHAR_CHAPTERS.reduce((acc, c) => acc + c.completedLessons, 0);

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
                        <h1 className="text-lg font-serif font-bold text-white">Secretos del Zohar</h1>
                        <p className="text-[10px] text-gray-400">El Libro del Esplendor</p>
                    </div>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-2xl overflow-hidden mb-6 p-6"
                    style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(168,85,247,0.2) 100%)',
                        border: '1px solid rgba(251,191,36,0.4)',
                    }}
                >
                    <div className="absolute top-4 right-4 text-6xl opacity-20">📖</div>

                    <motion.h2
                        className="text-4xl font-serif font-bold mb-2"
                        style={{
                            background: 'linear-gradient(135deg, #FBBF24 0%, #FDE68A 50%, #D97706 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 40px rgba(251,191,36,0.4)',
                        }}
                    >
                        ספר הזוהר
                    </motion.h2>
                    <p className="text-sm text-gray-300 mb-4">
                        Escrito por Rabbi Shimon bar Yojai, revelado en el siglo XIII
                    </p>

                    {/* Progress */}
                    <div className="bg-black/40 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <BookOpen className="h-3 w-3" /> Progreso
                            </span>
                            <span className="text-xs text-accent-gold font-bold">{completedLessons}/{totalLessons}</span>
                        </div>
                        <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(completedLessons / totalLessons) * 100}%` }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="h-full bg-gradient-to-r from-accent-gold to-yellow-300 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Chapters */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Porciones Semanales
                </h3>
                <div className="space-y-3">
                    {ZOHAR_CHAPTERS.map((chapter, idx) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Link href={chapter.unlocked ? `/zohar/${chapter.id}` : '#'}>
                                <div
                                    className={`p-4 rounded-xl transition-all ${chapter.unlocked ? 'hover:bg-white/10' : 'opacity-50 cursor-not-allowed'
                                        }`}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(251,191,36,0.2)',
                                    }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-14 w-14 rounded-xl flex items-center justify-center text-lg"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(168,85,247,0.2) 100%)',
                                            }}
                                        >
                                            {chapter.unlocked ? '📜' : <Lock className="h-5 w-5 text-gray-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-white">{chapter.title}</h4>
                                            <p className="text-xs text-gray-500">{chapter.titleEs}</p>
                                            <p className="text-xs text-gray-400 mt-1">{chapter.desc}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] text-gray-500">
                                                    {chapter.completedLessons}/{chapter.lessons} lecciones
                                                </span>
                                                {chapter.completedLessons > 0 && (
                                                    <div className="flex-1 h-1 bg-black/30 rounded-full max-w-[60px]">
                                                        <div
                                                            className="h-full bg-accent-gold rounded-full"
                                                            style={{ width: `${(chapter.completedLessons / chapter.lessons) * 100}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className={`h-5 w-5 ${chapter.unlocked ? 'text-accent-gold' : 'text-gray-600'}`} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
