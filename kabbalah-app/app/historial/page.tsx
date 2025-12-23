'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, CheckCircle, TrendingUp } from "lucide-react";

// Mock data - will come from database later
const STUDY_HISTORY = [
    {
        date: "Hoy",
        items: [
            { id: 1, title: "72 Nombres: Nombre #5 - מהש", duration: "15 min", type: "meditation", completed: true },
            { id: 2, title: "Árbol de la Vida: Tiferet", duration: "25 min", type: "lesson", completed: true },
        ]
    },
    {
        date: "Ayer",
        items: [
            { id: 3, title: "Zohar: Bereshit - Clase 3", duration: "45 min", type: "lesson", completed: true },
            { id: 4, title: "Meditación de Sanación", duration: "10 min", type: "meditation", completed: true },
        ]
    },
    {
        date: "Esta Semana",
        items: [
            { id: 5, title: "Alef-Bet: Letra Alef", duration: "20 min", type: "lesson", completed: true },
            { id: 6, title: "Tefilá: Modé Aní", duration: "8 min", type: "prayer", completed: true },
            { id: 7, title: "72 Nombres: Nombre #1 - והו", duration: "15 min", type: "meditation", completed: true },
        ]
    }
];

const STATS = [
    { label: "Tiempo Total", value: "4h 32m", icon: Clock },
    { label: "Lecciones", value: "12", icon: BookOpen },
    { label: "Racha", value: "7 días", icon: TrendingUp },
];

export default function HistorialPage() {
    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/perfil" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-white">Mi Historial de Estudio</h1>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-3 mb-8"
                >
                    {STATS.map((stat) => (
                        <div
                            key={stat.label}
                            className="p-4 rounded-xl text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(251,191,36,0.05) 100%)',
                                border: '1px solid rgba(251,191,36,0.2)',
                            }}
                        >
                            <stat.icon className="h-5 w-5 text-accent-gold mx-auto mb-2" />
                            <span className="block text-xl font-bold text-white">{stat.value}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>

                {/* History List */}
                <div className="space-y-6">
                    {STUDY_HISTORY.map((group, groupIdx) => (
                        <motion.div
                            key={group.date}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: groupIdx * 0.1 }}
                        >
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                {group.date}
                            </h3>
                            <div className="space-y-2">
                                {group.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-xl flex items-center gap-4"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-accent-gold/20">
                                            {item.type === 'meditation' && '🧘'}
                                            {item.type === 'lesson' && '📖'}
                                            {item.type === 'prayer' && '🙏'}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-white">{item.title}</h4>
                                            <p className="text-xs text-gray-400">{item.duration}</p>
                                        </div>
                                        {item.completed && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
