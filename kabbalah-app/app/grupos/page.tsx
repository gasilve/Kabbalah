'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, MessageCircle, Calendar, Lock, Star } from "lucide-react";

// Mock study groups data
const STUDY_GROUPS = [
    {
        id: 'zohar-beginners',
        name: 'Zohar para Principiantes',
        members: 24,
        topic: 'Bereshit - Capítulo 3',
        schedule: 'Lunes y Jueves 20:00',
        level: 'Principiante',
        isOpen: true,
        image: '📖',
    },
    {
        id: '72-names-practice',
        name: 'Práctica de 72 Nombres',
        members: 18,
        topic: 'Meditación con Nombre #12',
        schedule: 'Miércoles 21:00',
        level: 'Intermedio',
        isOpen: true,
        image: '✨',
    },
    {
        id: 'kabbalah-advanced',
        name: 'Kabbalah Avanzada',
        members: 12,
        topic: 'Sefer Yetzirah - Capítulo 2',
        schedule: 'Sábados 19:00',
        level: 'Avanzado',
        isOpen: false,
        image: '🌳',
    },
    {
        id: 'hebrew-letters',
        name: 'Secretos del Alef-Bet',
        members: 31,
        topic: 'Letra Shin - Fuego Divino',
        schedule: 'Martes 20:30',
        level: 'Todos los niveles',
        isOpen: true,
        image: '🔤',
    },
];

export default function GruposEstudioPage() {
    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/80 backdrop-blur-xl border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/conexiones" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <h1 className="text-xl font-serif font-bold text-white">Grupos de Estudio</h1>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl mb-6"
                    style={{
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 100%)',
                        border: '1px solid rgba(168,85,247,0.3)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-purple-400" />
                        <div>
                            <p className="text-sm text-white font-medium">Estudia en comunidad</p>
                            <p className="text-xs text-gray-400">Únete a grupos de estudio guiados por facilitadores experimentados</p>
                        </div>
                    </div>
                </motion.div>

                {/* Groups List */}
                <div className="space-y-4">
                    {STUDY_GROUPS.map((group, idx) => (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 rounded-xl"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="h-14 w-14 rounded-xl flex items-center justify-center text-2xl bg-accent-gold/20">
                                    {group.image}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-bold text-white">{group.name}</h3>
                                        {!group.isOpen && <Lock className="h-3 w-3 text-gray-500" />}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">📚 {group.topic}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">🕐 {group.schedule}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                            {group.level}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            👥 {group.members} miembros
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors ${group.isOpen
                                        ? 'bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30'
                                        : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                    }`}
                                disabled={!group.isOpen}
                            >
                                {group.isOpen ? 'Unirse al Grupo' : 'Grupo Completo'}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Create Group CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 rounded-xl text-center"
                    style={{
                        background: 'rgba(251,191,36,0.1)',
                        border: '1px dashed rgba(251,191,36,0.3)',
                    }}
                >
                    <Star className="h-6 w-6 text-accent-gold mx-auto mb-2" />
                    <p className="text-sm text-white font-medium">¿Quieres crear tu propio grupo?</p>
                    <p className="text-xs text-gray-400 mt-1">Próximamente podrás facilitar grupos de estudio</p>
                </motion.div>
            </div>
        </div>
    );
}
