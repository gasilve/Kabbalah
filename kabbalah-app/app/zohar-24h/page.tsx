'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw, Users, BookOpen, Sparkles } from 'lucide-react';

const STUDY_SESSIONS = [
    { id: 'morning', name: 'Shajarit (Mañana)', time: '06:00', duration: 60, participants: 47 },
    { id: 'midday', name: 'Minjá (Mediodía)', time: '12:00', duration: 45, participants: 32 },
    { id: 'evening', name: "Ma'ariv (Noche)", time: '20:00', duration: 60, participants: 89 },
    { id: 'midnight', name: 'Tikún Jatzot', time: '00:00', duration: 90, participants: 23 },
];

export default function Zohar24HPage() {
    const [isStudying, setIsStudying] = useState(false);
    const [studyTime, setStudyTime] = useState(0);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isStudying) {
            interval = setInterval(() => {
                setStudyTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isStudying]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleStart = () => setIsStudying(true);
    const handlePause = () => setIsStudying(false);
    const handleReset = () => {
        setIsStudying(false);
        setStudyTime(0);
    };

    // Get current session based on time
    const getCurrentSession = () => {
        const now = new Date();
        const hour = now.getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'midday';
        if (hour >= 18 && hour < 24) return 'evening';
        return 'midnight';
    };

    return (
        <div className="min-h-screen pb-32 relative overflow-hidden">
            {/* Background with glow effect */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 px-6 pt-10">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                        <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">Zohar 24H</span>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">
                        Estudio Continuo
                    </h1>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">
                        Únete a la cadena mundial de estudio del Zohar HaKadosh
                    </p>
                </motion.header>

                {/* Timer Circle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center mb-8"
                >
                    <div className="relative">
                        {/* Outer glow ring */}
                        <div
                            className={`absolute inset-0 rounded-full ${isStudying ? 'animate-pulse' : ''}`}
                            style={{
                                background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
                                transform: 'scale(1.3)',
                                filter: 'blur(20px)',
                            }}
                        />

                        {/* Timer circle */}
                        <div
                            className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(0,0,0,0.5) 100%)',
                                border: '3px solid rgba(251,191,36,0.4)',
                                boxShadow: isStudying ? '0 0 40px rgba(251,191,36,0.3)' : 'none',
                            }}
                        >
                            <Clock className={`w-8 h-8 mb-2 ${isStudying ? 'text-amber-400' : 'text-gray-500'}`} />
                            <p className="text-4xl font-mono font-bold text-white">
                                {formatTime(studyTime)}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                {isStudying ? 'Estudiando...' : 'Listo para estudiar'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Control Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-4 mb-8"
                >
                    {!isStudying ? (
                        <button
                            onClick={handleStart}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold shadow-lg shadow-amber-900/30 hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Comenzar Estudio
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handlePause}
                                className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                                <Pause className="w-5 h-5" />
                                Pausar
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-colors"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </motion.div>

                {/* Live Sessions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Sesiones en Vivo
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {STUDY_SESSIONS.map((session) => {
                            const isCurrent = getCurrentSession() === session.id;
                            return (
                                <motion.button
                                    key={session.id}
                                    onClick={() => setSelectedSession(session.id)}
                                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${isCurrent
                                            ? 'bg-amber-500/20 border-amber-500/40'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                                        } border`}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center ${isCurrent ? 'bg-amber-500/30' : 'bg-white/10'
                                            }`}
                                    >
                                        <span className="text-lg">📖</span>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h3 className="font-bold text-white">{session.name}</h3>
                                        <p className="text-xs text-gray-400">{session.time} • {session.duration} min</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Users className="w-4 h-4" />
                                        <span className="text-sm">{session.participants}</span>
                                    </div>
                                    {isCurrent && (
                                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                                            EN VIVO
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Daily Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-amber-900/30 to-amber-950/50 border border-amber-500/20"
                >
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-2">Enseñanza del día</h4>
                            <p className="text-sm text-gray-300 italic leading-relaxed">
                                "El estudio del Zohar, aunque no entendamos nada, purifica el alma y atrae luz a todos los mundos."
                            </p>
                            <p className="text-xs text-gray-500 mt-2">— Rabbi Shimón Bar Yojai</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
