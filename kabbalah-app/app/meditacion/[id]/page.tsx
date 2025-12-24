'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    X,
    Heart,
    Share2,
    Clock,
    Volume2,
    ListMusic,
    ChevronDown,
    Sparkles,
    BookText
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

// We'll import the data directly for the MVP
import meditationsData from '@/data/meditations_all.json';

export default function MeditationPlayer() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const id = params.id as string;

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(600); // 10 mins default
    const [showTranscript, setShowTranscript] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    const meditation = meditationsData.meditaciones.find(m => m.id === id) || meditationsData.meditaciones[0];

    // Fetch initial status
    useEffect(() => {
        if (session) {
            fetch('/api/user/dashboard')
                .then(res => res.json())
                .then(data => {
                    const isFav = data.progress?.favorites?.includes(id);
                    setIsFavorited(!!isFav);
                })
                .catch(err => console.error('Error fetching favorite status:', err));
        }
    }, [session, id]);

    // Simulate progress
    useEffect(() => {
        let interval: any;
        if (isPlaying && progress < 100) {
            interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + 0.1;
                    setCurrentTime(Math.floor((next / 100) * duration));

                    // Auto-complete at 100%
                    if (next >= 100) {
                        handleComplete();
                    }

                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, progress, duration]);

    const handleComplete = async () => {
        if (!session) return;
        try {
            await fetch('/api/user/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'meditation', id })
            });
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 overflow-hidden flex flex-col">
            {/* Background Image / Blur */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-slate-950 to-slate-950" />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-2xl"
                />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between p-6">
                <button
                    onClick={() => router.back()}
                    className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                    <ChevronDown className="w-5 h-5 text-white" />
                </button>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1">REPRODUCIENDO</p>
                    <h2 className="text-xs text-slate-400 font-light truncate max-w-[150px]">{meditation.category}</h2>
                </div>
                <button className="p-3 rounded-full bg-white/5 border border-white/10">
                    <ListMusic className="w-5 h-5 text-white" />
                </button>
            </header>

            {/* Content Body */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
                {/* Artwork */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-72 h-72 mb-12"
                >
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center p-12">
                            <Sparkles className="w-full h-full text-primary/40 rotate-12" />
                        </div>
                    </div>
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3 mb-10 w-full"
                >
                    <h1 className="text-2xl font-display text-white tracking-widest">{meditation.titulo}</h1>
                    <p className="text-sm text-slate-400 font-light italic">{meditation.tipo} • {meditation.duracion}</p>
                </motion.div>

                {/* Progress Bar */}
                <div className="w-full space-y-2 mb-10">
                    <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden group cursor-pointer">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-primary shadow-glow-gold rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between w-full max-w-xs mb-12">
                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <SkipBack className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-primary/30 shadow-glow-gold hover:scale-110 active:scale-95 transition-transform"
                    >
                        {isPlaying ? (
                            <Pause className="w-8 h-8 text-slate-950 fill-slate-950" />
                        ) : (
                            <Play className="w-8 h-8 text-slate-950 fill-slate-950 translate-x-0.5" />
                        )}
                    </button>

                    <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <SkipForward className="w-6 h-6" />
                    </button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center justify-around w-full max-w-xs text-slate-500">
                    <button
                        onClick={async () => {
                            if (!session) return;
                            const newStatus = !isFavorited;
                            setIsFavorited(newStatus);
                            try {
                                await fetch('/api/user/progress', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ type: 'favorite', id })
                                });
                            } catch (error) {
                                console.error('Error toggling favorite:', error);
                                setIsFavorited(!newStatus); // Rollback
                            }
                        }}
                        className={`flex flex-col items-center gap-2 transition-colors ${isFavorited ? 'text-rose-500' : 'hover:text-white'}`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Favorito</span>
                    </button>

                    <button
                        onClick={() => setShowTranscript(true)}
                        className="flex flex-col items-center gap-2 hover:text-white transition-colors"
                    >
                        <BookText className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Transcripción</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 hover:text-white transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Compartir</span>
                    </button>
                </div>
            </main>

            {/* Transcript Modal/Overlay */}
            <AnimatePresence>
                {showTranscript && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[120] glass-panel bg-slate-950/90 backdrop-blur-2xl p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-lg font-display text-white">Guía de Meditación</h3>
                            <button
                                onClick={() => setShowTranscript(false)}
                                className="p-2 rounded-full bg-white/5"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Contexto</h4>
                                <p className="text-slate-300 text-sm font-light leading-relaxed">
                                    {meditation.descripcion}
                                </p>
                            </div>

                            <div className="space-y-6 pt-6 border-t border-white/5">
                                <p className="text-slate-400 text-lg font-light leading-relaxed">
                                    "Cierra tus ojos y posiciona tu espalda recta..."
                                </p>
                                <p className="text-white text-lg font-medium leading-relaxed">
                                    "Visualiza una luz blanca descendiendo desde Keter, bañando tu corona..."
                                </p>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">
                                    "Siente la vibración de la letra Aleph en tu corazón..."
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                            FIN DE TRANSCRIPCIÓN
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
