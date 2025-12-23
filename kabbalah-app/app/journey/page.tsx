'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Lock, Play, PlayCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function JourneyPage() {
    const { data: session } = useSession();
    const [progressData, setProgressData] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (session) {
            fetch('/api/user/dashboard')
                .then(res => res.json())
                .then(data => setProgressData(data.progress?.completedCurriculumItems || []))
                .catch(err => console.error('Error fetching progress:', err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [session]);

    const isCompleted = (id: string) => progressData.includes(id);

    const toggleComplete = async (id: string) => {
        if (!session) return;

        const alreadyDone = isCompleted(id);
        // We only allow marking as complete for now (MVP simplicity)
        if (alreadyDone) return;

        const newProgress = [...progressData, id];
        setProgressData(newProgress); // Optimistic

        try {
            await fetch('/api/user/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'curriculum', id })
            });
        } catch (error) {
            console.error('Error updating progress:', error);
            setProgressData(progressData); // Revert
        }
    };

    const staticCurriculum = [
        {
            id: 'malkut',
            level: 1,
            title: 'Malkut: El Reino',
            description: 'Anclando tu energía espiritual en la realidad física.',
            image: '/spheres/malkut.png'
        },
        {
            id: 'yesod',
            level: 2,
            title: 'Yesod: El Fundamento',
            description: 'Conectando con el subconsciente y la energía lunar.',
            image: '/spheres/yesod.png'
        },
        {
            id: 'hod',
            level: 3,
            title: 'Hod: Esplendor',
            description: 'Dominando el intelecto y la comunicación.',
            image: '/spheres/hod.png'
        },
        {
            id: 'netzaj',
            level: 4,
            title: 'Netzaj: Victoria',
            description: 'La esfera de la resistencia y las emociones.',
            image: '/spheres/netzaj.png'
        }
    ];

    const curriculum = staticCurriculum.map((item, index) => {
        const done = isCompleted(item.id);
        const prevDone = index === 0 || isCompleted(staticCurriculum[index - 1].id);

        let status: 'completed' | 'current' | 'locked' = 'locked';
        if (done) status = 'completed';
        else if (prevDone) status = 'current';

        return { ...item, status };
    });
    return (
        <div className="min-h-screen pb-32 pt-6 px-4 max-w-lg mx-auto">
            {/* Header / Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl p-6 mb-8 glass-panel border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-2xl font-display text-white mb-1">Mi Camino</h2>
                        <p className="text-sm text-slate-400 font-light italic">Continúa tu ascenso</p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10 border border-primary/30 shadow-glow-gold">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                </div>

                <div className="mb-6 relative z-10">
                    <div className="flex justify-between text-xs mb-2 font-bold tracking-wider">
                        <span className="uppercase text-primary font-display">Esfera de Hod</span>
                        <span className="text-white">65%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '65%' }}
                            className="h-full bg-gradient-to-r from-primary to-yellow-200 relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>
                </div>

                <button className="w-full py-4 bg-primary text-slate-950 font-bold font-display tracking-widest rounded-xl shadow-glow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    REANUDAR ASCENSO
                </button>
            </motion.div>

            {/* Curriculum Section */}
            <div className="relative">
                <div className="flex items-center justify-between mb-8 pl-2">
                    <h3 className="text-lg font-display text-white border-l-2 border-primary/50 pl-3">
                        Plan de Estudios
                    </h3>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Nivel 3 de 10
                    </span>
                </div>

                {/* Vertical Line */}
                <div className="absolute left-[27px] top-[60px] bottom-10 w-[2px] bg-gradient-to-b from-primary via-primary/40 to-transparent z-0" />

                <div className="space-y-10 relative z-10">
                    {curriculum.map((level, idx) => (
                        <div key={level.id} className={`relative pl-12 group transition-opacity duration-500 ${level.status === 'locked' ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                            {/* Dot / Indicator */}
                            <div className={`absolute left-[19px] top-6 w-4 h-4 rounded-full border-2 border-slate-950 z-10 flex items-center justify-center transition-all duration-500
                                ${level.status === 'completed' ? 'bg-primary' :
                                    level.status === 'current' ? 'bg-slate-950 border-primary shadow-[0_0_15px_rgba(198,168,124,0.8)]' :
                                        'bg-slate-800 border-slate-600'}`}
                            >
                                {level.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-slate-950" />}
                                {level.status === 'current' && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
                                {level.status === 'locked' && <Lock className="w-2 h-2 text-slate-500" />}
                            </div>

                            {/* Content Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => level.status === 'current' && toggleComplete(level.id)}
                                className={`rounded-2xl p-5 border transition-all duration-300 cursor-pointer
                                    ${level.status === 'current' ? 'glass-panel border-primary bg-primary/5 shadow-glow-gold' : 'glass-panel border-white/5 hover:border-primary/20'}
                                `}
                            >
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <div className="flex-1">
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] block mb-1
                                            ${level.status === 'completed' ? 'text-primary' :
                                                level.status === 'current' ? 'text-yellow-400' : 'text-slate-500'}
                                        `}>
                                            NIVEL {level.level} • {level.status === 'completed' ? 'Completado' : level.status === 'current' ? 'Foco Actual' : 'Bloqueado'}
                                        </span>
                                        <h4 className={`text-xl font-display mb-1 ${level.status === 'locked' ? 'text-slate-400' : 'text-white'}`}>
                                            {level.title}
                                        </h4>
                                    </div>
                                    <div className="relative shrink-0">
                                        {level.status === 'current' && (
                                            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
                                        )}
                                        <div className={`relative w-14 h-14 rounded-full overflow-hidden border-2 
                                            ${level.status === 'current' ? 'border-primary' : 'border-white/10'}
                                        `}>
                                            <Image
                                                src={level.image}
                                                alt={level.title}
                                                fill
                                                className={`object-cover ${level.status === 'locked' ? 'opacity-30' : 'opacity-100'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <p className={`text-xs mb-4 leading-relaxed ${level.status === 'locked' ? 'text-slate-500' : 'text-slate-300'}`}>
                                    {level.description}
                                </p>

                                {/* Expansion for Current Level - Simple button for now */}
                                {level.status === 'current' && (
                                    <div className="pt-3 border-t border-primary/20">
                                        <button
                                            onClick={() => toggleComplete(level.id)}
                                            className="w-full py-4 bg-primary text-slate-950 font-bold font-display tracking-widest rounded-xl shadow-glow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                                        >
                                            <PlayCircle className="w-5 h-5" />
                                            MARCAR COMO COMPLETADO
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
