'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Play,
    BookOpen,
    Sparkles,
    Zap,
    Compass,
    Info,
    ArrowRight,
    Lock,
    Eye,
    Star
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type Tab = 'didactica' | 'pardes' | 'simbologia' | 'tecnica' | 'correspondencias';

export default function ClaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [activeTab, setActiveTab] = useState<Tab>('didactica');
    const [clase, setClase] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClase = async () => {
            try {
                const res = await fetch(`/api/clases/${id}`);
                const data = await res.json();
                setClase(data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading class:', error);
                setLoading(false);
            }
        };
        fetchClase();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (!clase) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-2xl font-display font-bold text-white mb-4">Clase no encontrada</h1>
            <Button onClick={() => router.back()}>Regresar</Button>
        </div>
    );

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'didactica', label: 'Didáctica', icon: BookOpen },
        { id: 'pardes', label: 'Pardes', icon: Info },
        { id: 'simbologia', label: 'Simbología', icon: Eye },
        { id: 'tecnica', label: 'Técnica', icon: Zap },
        { id: 'correspondencias', label: 'Ligas', icon: Compass },
    ];

    return (
        <div className="min-h-screen bg-slate-950 pb-32">
            {/* Header / Video Placeholder */}
            <div className="relative aspect-video w-full bg-black overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                    </div>
                </div>
                <button
                    onClick={() => router.back()}
                    className="absolute top-6 left-6 z-30 w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-md"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Title & Stats */}
            <div className="px-6 -mt-10 relative z-20 mb-8">
                <span className="inline-block text-[0.6rem] font-bold text-primary uppercase tracking-[0.2em] mb-2 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    {clase.playlist}
                </span>
                <h1 className="text-2xl font-display font-bold text-white mb-3 tracking-tight">{clase.title}</h1>
                <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-2">
                    {clase.summary}
                </p>
            </div>

            {/* Tab Navigation */}
            <nav className="px-6 flex gap-2 overflow-x-auto no-scrollbar mb-6 sticky top-0 bg-slate-950/80 backdrop-blur-xl z-30 py-4 border-b border-white/5">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isActive
                                ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                                : 'bg-white/5 border-white/5 text-slate-400 opacity-60'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="text-[0.65rem] font-bold uppercase tracking-widest">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Tab Content */}
            <div className="px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'didactica' && (
                            <section className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        Historias y Alegorías
                                    </h3>
                                    {clase.didactica?.historias?.length > 0 ? (
                                        clase.didactica.historias.map((historia: string, i: number) => (
                                            <Card key={i} glass className="p-4 border-white/5 text-slate-400 text-sm leading-relaxed italic">
                                                "{historia}"
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-500 italic">No hay historias específicas registradas para esta clase.</p>
                                    )}
                                </div>

                                {clase.summary && (
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">Resumen Estructural</h3>
                                        <p className="text-sm text-slate-400 leading-relaxed font-light">{clase.summary}</p>
                                    </div>
                                )}
                            </section>
                        )}

                        {activeTab === 'pardes' && (
                            <div className="space-y-4">
                                <PardesCard
                                    level="Peshat"
                                    desc="Literal"
                                    content={clase.pardes?.peshat || "El significado literal del texto."}
                                    color="text-emerald-400"
                                />
                                <PardesCard
                                    level="Remez"
                                    desc="Pista / Gematria"
                                    content={clase.pardes?.remez || "Conceptos sugeridos o valores numéricos."}
                                    color="text-blue-400"
                                />
                                <PardesCard
                                    level="Drash"
                                    desc="Alegoría"
                                    content={clase.pardes?.drash || "Interpretación ética o didáctica."}
                                    color="text-purple-400"
                                />
                                <PardesCard
                                    level="Sod"
                                    desc="Secreto"
                                    content={clase.pardes?.sod || "Nivel místico y teúrgico profunda."}
                                    color="text-rose-400"
                                    locked={!clase.pardes?.sod}
                                />
                            </div>
                        )}

                        {activeTab === 'simbologia' && (
                            <div className="grid grid-cols-1 gap-4">
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Simbolismo Cuántico</h3>
                                <Card glass className="p-5 border-white/5">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                                            <Star className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Conceptos de Color</h4>
                                            <p className="text-[0.7rem] text-slate-400 leading-relaxed">Frecuencias vibratorias asociadas a esta enseñanza.</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'tecnica' && (
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Práctica Meditativa</h3>
                                {clase.meditations?.length > 0 ? (
                                    clase.meditations.map((m: any, i: number) => (
                                        <Card key={i} className="p-0 overflow-hidden bg-slate-900/50 border-primary/20">
                                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">{m.title}</h4>
                                                <Zap className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="p-4 space-y-4">
                                                <div className="space-y-2">
                                                    {m.steps?.map((step: string, j: number) => (
                                                        <div key={j} className="flex gap-3 text-[0.7rem]">
                                                            <span className="text-primary font-bold">{j + 1}.</span>
                                                            <span className="text-slate-400">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button size="sm" className="w-full text-[0.65rem] font-bold">EMPEZAR MEDITACIÓN</Button>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30">
                                        <Lock className="w-12 h-12 mx-auto mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Técnica no disponible</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'correspondencias' && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2">Ligas y Correspondencias</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <CorrespondenceCard label="Elemento" value="Aire" icon={<Zap className="w-4 h-4" />} />
                                    <CorrespondenceCard label="Planeta" value="Mercurio" icon={<Star className="w-4 h-4" />} />
                                    <CorrespondenceCard label="Sefirá" value="Hod" icon={<Compass className="w-4 h-4" />} />
                                    <CorrespondenceCard label="Klipá" value="Corazón Duro" icon={<Lock className="w-4 h-4" />} />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

function PardesCard({ level, desc, content, color, locked }: any) {
    return (
        <Card glass className={`p-4 border-white/5 ${locked ? 'opacity-40 grayscale' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className={`text-[0.6rem] font-black uppercase tracking-[0.2em] ${color}`}>{level}</span>
                    <span className="text-[0.55rem] text-slate-500 font-bold uppercase tracking-widest">{desc}</span>
                </div>
                {locked && <Lock className="w-3 h-3 text-slate-600" />}
            </div>
            <p className="text-[0.7rem] text-slate-300 leading-relaxed font-light">{content}</p>
        </Card>
    );
}

function CorrespondenceCard({ label, value, icon }: any) {
    return (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary opacity-60">
                {icon}
                <span className="text-[0.55rem] font-bold uppercase tracking-widest text-slate-500">{label}</span>
            </div>
            <span className="text-sm font-bold text-white tracking-wide">{value}</span>
        </div>
    );
}
