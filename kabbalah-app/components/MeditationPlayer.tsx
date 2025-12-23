'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, SkipForward, ChevronDown } from "lucide-react";

interface MeditationPlayerProps {
    title: string;
    duration: number; // in minutes
    audioUrl?: string;
    onClose: () => void;
    intention?: string;
}

export function MeditationPlayer({
    title,
    duration,
    audioUrl,
    onClose,
    intention
}: MeditationPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const totalSeconds = duration * 60;
    const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
            // Play completion sound
        }

        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    const togglePlay = () => setIsPlaying(!isPlaying);
    const reset = () => {
        setTimeLeft(duration * 60);
        setIsPlaying(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-background-deep/95 backdrop-blur-xl"
                    onClick={() => setShowControls(!showControls)}
                />

                {/* Animated background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: 200 + i * 100,
                                height: 200 + i * 100,
                                background: `radial-gradient(circle, ${['rgba(251,191,36,0.1)', 'rgba(168,85,247,0.1)', 'rgba(59,130,246,0.1)'][i % 3]
                                    } 0%, transparent 70%)`,
                                left: `${20 + i * 15}%`,
                                top: `${10 + i * 10}%`,
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 4 + i,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-sm px-6">
                    {/* Close button */}
                    <motion.button
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={onClose}
                        className="absolute -top-12 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X className="h-6 w-6 text-white" />
                    </motion.button>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        {intention && (
                            <span className="text-xs text-accent-gold uppercase tracking-wider">
                                {intention}
                            </span>
                        )}
                        <h2 className="text-2xl font-serif font-bold text-white mt-2">{title}</h2>
                    </motion.div>

                    {/* Timer Circle */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative w-64 h-64 mx-auto mb-8"
                    >
                        {/* Outer glow */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)',
                                filter: 'blur(20px)',
                            }}
                        />

                        {/* Progress ring */}
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="4"
                            />
                            <motion.circle
                                cx="128"
                                cy="128"
                                r="120"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                transition={{ duration: 0.5 }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FBBF24" />
                                    <stop offset="50%" stopColor="#A855F7" />
                                    <stop offset="100%" stopColor="#60A5FA" />
                                </linearGradient>
                            </defs>
                        </svg>

                        {/* Time display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span
                                className="text-5xl font-mono font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #FBBF24 0%, #FDE68A 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-xs text-gray-400 mt-2">
                                {isPlaying ? 'Meditando...' : 'Preparado'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-6"
                    >
                        {/* Reset */}
                        <button
                            onClick={reset}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <RotateCcw className="h-5 w-5 text-gray-300" />
                        </button>

                        {/* Play/Pause */}
                        <button
                            onClick={togglePlay}
                            className="p-5 rounded-full transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)',
                                boxShadow: '0 0 30px rgba(251,191,36,0.4)',
                            }}
                        >
                            {isPlaying ? (
                                <Pause className="h-8 w-8 text-background-deep" />
                            ) : (
                                <Play className="h-8 w-8 text-background-deep ml-1" />
                            )}
                        </button>

                        {/* Mute */}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            {isMuted ? (
                                <VolumeX className="h-5 w-5 text-gray-300" />
                            ) : (
                                <Volume2 className="h-5 w-5 text-gray-300" />
                            )}
                        </button>
                    </motion.div>

                    {/* Duration selector */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex justify-center gap-3 mt-8"
                    >
                        {[5, 10, 15, 20].map(mins => (
                            <button
                                key={mins}
                                onClick={() => {
                                    setTimeLeft(mins * 60);
                                    setIsPlaying(false);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${Math.ceil(timeLeft / 60) === mins
                                        ? 'bg-accent-gold/20 text-accent-gold'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {mins} min
                            </button>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
