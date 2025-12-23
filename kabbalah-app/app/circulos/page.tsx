'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Heart, Users, Clock, Calendar, Play, Bell } from "lucide-react";

// Mock prayer circles data
const UPCOMING_CIRCLES = [
    {
        id: 1,
        title: 'Meditación de Sanación Colectiva',
        date: 'Hoy',
        time: '21:00',
        duration: '30 min',
        participants: 18,
        host: 'Rabbi David',
        type: 'healing',
        isLive: true,
    },
    {
        id: 2,
        title: 'Ana Bekoach - Oración Grupal',
        date: 'Mañana',
        time: '20:00',
        duration: '20 min',
        participants: 12,
        host: 'Sara Cohen',
        type: 'prayer',
        isLive: false,
    },
    {
        id: 3,
        title: 'Conexión con los 72 Nombres',
        date: 'Viernes',
        time: '18:30',
        duration: '45 min',
        participants: 25,
        host: 'Rabbi Gozlan',
        type: 'meditation',
        isLive: false,
    },
    {
        id: 4,
        title: 'Recibimiento del Shabat',
        date: 'Viernes',
        time: '19:30',
        duration: '40 min',
        participants: 45,
        host: 'Comunidad Kabbalah',
        type: 'shabbat',
        isLive: false,
    },
];

const TYPE_COLORS = {
    healing: '#10B981',
    prayer: '#A855F7',
    meditation: '#3B82F6',
    shabbat: '#FBBF24',
};

const TYPE_ICONS = {
    healing: '💚',
    prayer: '🙏',
    meditation: '🧘',
    shabbat: '🕯️',
};

export default function CirculosOracionPage() {
    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/conexiones" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-white">Círculos de Oración</h1>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl mb-6 text-center"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(168,85,247,0.15) 100%)',
                        border: '1px solid rgba(239,68,68,0.2)',
                    }}
                >
                    <Heart className="h-8 w-8 text-red-400 mx-auto mb-2" />
                    <h2 className="text-lg font-serif font-bold text-white">Orar Juntos</h2>
                    <p className="text-xs text-gray-400 mt-1">
                        La oración en grupo tiene un poder especial. Únete a meditaciones y oraciones en vivo.
                    </p>
                </motion.div>

                {/* Upcoming Circles */}
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Próximos Círculos
                </h3>
                <div className="space-y-4">
                    {UPCOMING_CIRCLES.map((circle, idx) => (
                        <motion.div
                            key={circle.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl relative overflow-hidden"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: `1px solid ${TYPE_COLORS[circle.type as keyof typeof TYPE_COLORS]}30`,
                            }}
                        >
                            {/* Live indicator */}
                            {circle.isLive && (
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[10px] text-red-400 font-bold uppercase">En Vivo</span>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center text-xl"
                                    style={{ background: `${TYPE_COLORS[circle.type as keyof typeof TYPE_COLORS]}20` }}
                                >
                                    {TYPE_ICONS[circle.type as keyof typeof TYPE_ICONS]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-white">{circle.title}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5">Guía: {circle.host}</p>
                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {circle.date} {circle.time}
                                        </span>
                                        <span>•</span>
                                        <span>{circle.duration}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {circle.participants}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {circle.isLive ? (
                                    <button className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center gap-2">
                                        <Play className="h-4 w-4" />
                                        Unirse Ahora
                                    </button>
                                ) : (
                                    <>
                                        <button className="flex-1 py-2 rounded-lg bg-accent-gold/20 text-accent-gold text-sm font-medium">
                                            Reservar
                                        </button>
                                        <button className="px-4 py-2 rounded-lg bg-white/5 text-gray-400">
                                            <Bell className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
