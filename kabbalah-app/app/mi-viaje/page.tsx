'use client';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Lock, X, Zap, Heart, Shield, Sparkles, BookOpen } from "lucide-react";
import { useSession } from 'next-auth/react';

// Sefirot coordinates and metadata for the Sacred Geometry layout
const TREE_DATA = {
    sefirot: [
        { id: 'keter', name: 'Keter', title: 'La Corona', x: 500, y: 100, color: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.8)', desc: 'La Voluntad Divina, el origen de todo.' },
        { id: 'chokmah', name: 'Chokmah', title: 'La Sabiduría', x: 650, y: 220, color: '#B0C4DE', glow: 'rgba(176, 196, 222, 0.6)', desc: 'La Chispa de la inspiración pura.' },
        { id: 'binah', name: 'Binah', title: 'El Entendimiento', x: 350, y: 220, color: '#4B0082', glow: 'rgba(75, 0, 130, 0.6)', desc: 'El útero cósmico que da forma.' },
        { id: 'chesed', name: 'Chesed', title: 'La Misericordia', x: 650, y: 450, color: '#4169E1', glow: 'rgba(65, 105, 225, 0.6)', desc: 'Amor incondicional y expansión.' },
        { id: 'gevurah', name: 'Gevurah', title: 'La Fuerza', x: 350, y: 450, color: '#DC2626', glow: 'rgba(220, 38, 38, 0.6)', desc: 'Disciplina, juicio y límites.' },
        { id: 'tiferet', name: 'Tiferet', title: 'La Belleza', x: 500, y: 580, color: '#FBBF24', glow: 'rgba(251, 191, 36, 0.7)', desc: 'El corazón, equilibrio y armonía.' },
        { id: 'netzach', name: 'Netzach', title: 'La Victoria', x: 650, y: 810, color: '#10B981', glow: 'rgba(16, 185, 129, 0.6)', desc: 'Perseverancia y triunfo eterno.' },
        { id: 'hod', name: 'Hod', title: 'La Gloria', x: 350, y: 810, color: '#F97316', glow: 'rgba(249, 115, 22, 0.6)', desc: 'Humildad y reconocimiento profético.' },
        { id: 'yesod', name: 'Yesod', title: 'El Fundamento', x: 500, y: 940, color: '#A855F7', glow: 'rgba(168, 85, 247, 0.6)', desc: 'Canal de conexión y sexualidad sagrada.' },
        { id: 'malchut', name: 'Malchut', title: 'El Reino', x: 500, y: 1100, color: '#8B4513', glow: 'rgba(139, 69, 19, 0.6)', desc: 'Manifestación física y la Shekhinah.' },
    ],
    paths: [
        ['keter', 'chokmah'], ['keter', 'binah'], ['chokmah', 'binah'],
        ['chokmah', 'chesed'], ['chokmah', 'tiferet'], ['binah', 'gevurah'],
        ['binah', 'tiferet'], ['chesed', 'gevurah'], ['chesed', 'tiferet'],
        ['chesed', 'netzach'], ['gevurah', 'tiferet'], ['gevurah', 'hod'],
        ['tiferet', 'netzach'], ['tiferet', 'hod'], ['tiferet', 'yesod'],
        ['netzach', 'hod'], ['netzach', 'yesod'], ['hod', 'yesod'], ['yesod', 'malchut']
    ]
};

export default function InteractiveTreeOfLife() {
    const { data: session } = useSession();
    const [progress, setProgress] = useState<string[]>([]);
    const [selectedSefira, setSelectedSefira] = useState<any>(null);
    const [animationTrigger, setAnimationTrigger] = useState(0);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!session) return;
            try {
                const res = await fetch('/api/user/dashboard');
                const data = await res.json();

                // Logic to map completed classes to Sefirot
                // This is a heuristic based on title keywords
                const unlocked: string[] = [];
                const completedTitles = data.progress?.completedCurriculumItems || []; // Assuming these are IDs, but need Titles? 

                // Since we only have IDs in progress, we might need to fetch titles or use a smarter check.
                // For MVP, if we only have IDs, we assume we might need to fetch class details or 
                // simply unlock based on COUNT for now?
                // Better: Let's unlock "Malchut" by default + others based on count.

                unlocked.push('malchut'); // Always open
                if (data.progress?.completedCurriculumItems?.length > 0) unlocked.push('yesod');
                if (data.progress?.completedCurriculumItems?.length > 2) unlocked.push('hod');
                if (data.progress?.completedCurriculumItems?.length > 4) unlocked.push('netzach');
                if (data.progress?.completedCurriculumItems?.length > 6) unlocked.push('tiferet');
                if (data.progress?.completedCurriculumItems?.length > 8) unlocked.push('gevurah');
                if (data.progress?.completedCurriculumItems?.length > 10) unlocked.push('chesed');

                setProgress(unlocked);
            } catch (e) {
                console.error("Error fetching progress", e);
            }
        };

        fetchProgress();

        // Automatically start 'Descent of Blessings' every few seconds for visual flare
        const interval = setInterval(() => {
            setAnimationTrigger(prev => prev + 1);
        }, 8000);
        return () => clearInterval(interval);
    }, [session]);

    const handleSefiraClick = (sefira: any) => {
        setSelectedSefira(sefira);
    };

    return (
        <div className="min-h-screen bg-[#02050b] pb-32 overflow-hidden relative font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)]" />
            </div>

            {/* Header */}
            <header className="relative z-10 pt-8 pb-4 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-2"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[10px] text-primary uppercase tracking-[0.3em] font-bold">Geometría Sagrada</span>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white tracking-widest text-glow">EL ÁRBOL DE LA VIDA</h1>
                    <p className="text-slate-500 text-[0.65rem] uppercase tracking-widest font-medium">El mapa de tu retorno a la fuente</p>
                </motion.div>
            </header>

            {/* Tree Container */}
            <div className="relative z-10 w-full h-[800px] flex justify-center items-start overflow-auto no-scrollbar pt-10">
                <div className="relative w-[1000px] h-[1200px] scale-[0.6] origin-top md:scale-75 lg:scale-100">
                    <svg viewBox="0 0 1000 1200" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        {/* Paths (Lines) */}
                        {TREE_DATA.paths.map(([from, to], idx) => {
                            const start = TREE_DATA.sefirot.find(s => s.id === from)!;
                            const end = TREE_DATA.sefirot.find(s => s.id === to)!;
                            const isPathActive = progress.includes(from) && progress.includes(to);

                            return (
                                <g key={idx}>
                                    <line
                                        x1={start.x} y1={start.y}
                                        x2={end.x} y2={end.y}
                                        stroke={isPathActive ? "rgba(251, 191, 36, 0.4)" : "rgba(255, 255, 255, 0.05)"}
                                        strokeWidth="4"
                                        strokeDasharray={isPathActive ? "0" : "8 8"}
                                    />
                                    {/* Descent of Blessings Pulse Animation */}
                                    <motion.circle
                                        key={`pulse-${animationTrigger}-${idx}`}
                                        r="3"
                                        fill="#fbbf24"
                                        initial={{ cx: start.x, cy: start.y, opacity: 0 }}
                                        animate={{
                                            cx: end.x,
                                            cy: end.y,
                                            opacity: [0, 1, 1, 0]
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: (start.y / 1000) * 3, // Stagger based on depth
                                            ease: "linear"
                                        }}
                                    />
                                </g>
                            );
                        })}

                        {/* Sefirot (Nodes) */}
                        {TREE_DATA.sefirot.map((sefira) => {
                            const isCompleted = progress.includes(sefira.id);
                            return (
                                <motion.g
                                    key={sefira.id}
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => handleSefiraClick(sefira)}
                                    className="cursor-pointer"
                                >
                                    {/* Outer Glow */}
                                    <motion.circle
                                        cx={sefira.x} cy={sefira.y} r="50"
                                        fill={sefira.glow}
                                        initial={{ opacity: 0.1 }}
                                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="pointer-events-none"
                                    />

                                    {/* Main Sphere */}
                                    <circle
                                        cx={sefira.x} cy={sefira.y} r="40"
                                        fill={`radial-gradient(circle at 30% 30%, ${sefira.color}, #000)`}
                                        className="fill-slate-900 stroke-2"
                                        style={{ stroke: sefira.color }}
                                    />
                                    <circle
                                        cx={sefira.x} cy={sefira.y} r="40"
                                        fill={sefira.color}
                                        fillOpacity="0.1"
                                        stroke={sefira.color}
                                        strokeWidth="2"
                                        className={isCompleted ? "opacity-100" : "opacity-30"}
                                    />

                                    {/* Labels */}
                                    <text
                                        x={sefira.x} y={sefira.y - 55}
                                        textAnchor="middle"
                                        className="text-[12px] font-bold fill-white uppercase tracking-widest opacity-80"
                                    >
                                        {sefira.name}
                                    </text>
                                    <text
                                        x={sefira.x} y={sefira.y + 6}
                                        textAnchor="middle"
                                        className="text-[14px] font-serif font-black fill-white pointer-events-none"
                                    >
                                        {sefira.name[0]}
                                    </text>
                                </motion.g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* Sefira Detail Overlay */}
            <AnimatePresence>
                {selectedSefira && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed inset-x-0 bottom-0 z-[100] p-6 pb-24"
                    >
                        <div className="max-w-md mx-auto relative glass-panel bg-slate-950/90 border-white/10 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl">
                            <button
                                onClick={() => setSelectedSefira(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex gap-5 items-start mb-6">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white/10 shrink-0"
                                    style={{ background: `radial-gradient(circle at 30% 30%, ${selectedSefira.color}, #000)`, borderColor: selectedSefira.color + '40' }}
                                >
                                    <Trophy className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <span className="text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em] mb-1 block">{selectedSefira.title}</span>
                                    <h3 className="text-2xl font-display font-bold text-white">{selectedSefira.name}</h3>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 font-light leading-relaxed mb-6 italic">
                                "{selectedSefira.desc}"
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <SefiraStat label="Planeta" value="Mercurio" icon={<Sparkles className="w-3 h-3 text-blue-400" />} />
                                <SefiraStat label="Nombre" value="Elohim" icon={<Heart className="w-3 h-3 text-pink-400" />} />
                                <SefiraStat label="Ángel" value="Gabriel" icon={<Shield className="w-3 h-3 text-cyan-400" />} />
                                <SefiraStat label="Metal" value="Plata" icon={<Zap className="w-3 h-3 text-amber-400" />} />
                            </div>

                            <button className="w-full py-3 rounded-2xl bg-primary text-black font-bold uppercase tracking-widest text-xs hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 shadow-glow-gold">
                                VER LECCIONES <BookOpen className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SefiraStat({ label, value, icon }: any) {
    return (
        <div className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center border border-white/5">
                {icon}
            </div>
            <div>
                <p className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-tighter">{label}</p>
                <p className="text-xs font-bold text-slate-200">{value}</p>
            </div>
        </div>
    );
}
