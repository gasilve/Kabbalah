'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Star, Lock, Trophy, Flame, BookOpen, Heart, Sparkles } from "lucide-react";

// Medal/Achievement data
const ACHIEVEMENTS = [
    {
        id: 'first_meditation',
        title: 'Primera Meditación',
        description: 'Completaste tu primera meditación',
        icon: '🧘',
        unlocked: true,
        date: '2024-12-01',
        category: 'beginner',
    },
    {
        id: 'week_streak',
        title: 'Racha Semanal',
        description: '7 días consecutivos estudiando',
        icon: '🔥',
        unlocked: true,
        date: '2024-12-04',
        category: 'streak',
    },
    {
        id: 'tree_explorer',
        title: 'Explorador del Árbol',
        description: 'Aprendiste sobre las 10 Sefirot',
        icon: '🌳',
        unlocked: true,
        date: '2024-12-02',
        category: 'learning',
    },
    {
        id: 'name_master_10',
        title: '10 Nombres',
        description: 'Meditaste con 10 de los 72 Nombres',
        icon: '✨',
        unlocked: false,
        progress: 5,
        total: 10,
        category: 'names',
    },
    {
        id: 'zohar_student',
        title: 'Estudiante del Zohar',
        description: 'Completaste 10 clases del Zohar',
        icon: '📖',
        unlocked: false,
        progress: 3,
        total: 10,
        category: 'learning',
    },
    {
        id: 'month_streak',
        title: 'Racha Mensual',
        description: '30 días consecutivos',
        icon: '👑',
        unlocked: false,
        progress: 7,
        total: 30,
        category: 'streak',
    },
];

const CATEGORIES = [
    { id: 'all', label: 'Todos', icon: Trophy },
    { id: 'streak', label: 'Rachas', icon: Flame },
    { id: 'learning', label: 'Aprendizaje', icon: BookOpen },
    { id: 'names', label: '72 Nombres', icon: Sparkles },
];

export default function LogrosPage() {
    const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/perfil" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-white">Logros y Medallas</h1>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Progress Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 p-6 rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.05) 100%)',
                        border: '1px solid rgba(251,191,36,0.3)',
                    }}
                >
                    <div className="text-5xl mb-3">🏆</div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                        {unlockedCount} / {ACHIEVEMENTS.length}
                    </h2>
                    <p className="text-sm text-gray-400">Logros Desbloqueados</p>

                    {/* Progress bar */}
                    <div className="mt-4 h-2 bg-black/30 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Achievements Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {ACHIEVEMENTS.map((achievement, idx) => (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            className={`p-4 rounded-xl text-center relative overflow-hidden ${achievement.unlocked ? '' : 'opacity-60'
                                }`}
                            style={{
                                background: achievement.unlocked
                                    ? 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                                    : 'rgba(255,255,255,0.03)',
                                border: achievement.unlocked
                                    ? '1px solid rgba(251,191,36,0.3)'
                                    : '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {/* Lock overlay for locked achievements */}
                            {!achievement.unlocked && (
                                <div className="absolute top-2 right-2">
                                    <Lock className="h-4 w-4 text-gray-500" />
                                </div>
                            )}

                            <div className="text-4xl mb-2">
                                {achievement.icon}
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">
                                {achievement.title}
                            </h3>
                            <p className="text-[10px] text-gray-400 mb-2">
                                {achievement.description}
                            </p>

                            {/* Progress bar for locked achievements */}
                            {!achievement.unlocked && achievement.progress !== undefined && (
                                <div className="mt-2">
                                    <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gray-500 rounded-full"
                                            style={{ width: `${(achievement.progress / achievement.total!) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-500">
                                        {achievement.progress}/{achievement.total}
                                    </span>
                                </div>
                            )}

                            {achievement.unlocked && achievement.date && (
                                <span className="text-[10px] text-accent-gold">
                                    {new Date(achievement.date).toLocaleDateString('es')}
                                </span>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
