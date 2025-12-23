'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Cast,
    MessageSquare,
    Users,
    Heart,
    Sparkles,
    ChevronRight,
    ArrowLeft,
    HandHeart,
    BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function ConexionesPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/conexiones')
            .then(res => res.json())
            .then(val => {
                setData(val);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching community data:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen pb-32 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 mb-8">
                <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                </Link>
                <h1 className="text-xl font-display text-white tracking-widest text-center">Conexiones</h1>
                <div className="w-10" />
            </div>

            <main className="max-w-md mx-auto px-4 space-y-6">
                {/* Hero / Live Section */}
                <section>
                    <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/10 group h-64 flex flex-col justify-end p-6">
                        {/* Background with mystic overlay */}
                        <div className="absolute inset-0 z-0">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2111&auto=format&fit=crop')] bg-center bg-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                        </div>

                        <div className="relative z-10 space-y-3">
                            <div className="flex justify-between items-start">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest ${data?.nextEvent?.isLive ? 'bg-red-500/20 border-red-500/30 text-red-400' : 'bg-primary/20 border-primary/30 text-primary'}`}>
                                    <span className="relative flex h-2 w-2">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${data?.nextEvent?.isLive ? 'bg-red-400' : 'bg-primary'}`}></span>
                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${data?.nextEvent?.isLive ? 'bg-red-500' : 'bg-primary'}`}></span>
                                    </span>
                                    {data?.nextEvent?.isLive ? 'En Vivo' : 'Próximo Evento'}
                                </span>
                                <Cast className="w-5 h-5 text-white/30" />
                            </div>

                            <h3 className="text-white text-2xl font-display font-bold">
                                {data?.nextEvent?.title || 'Eventos y Clases'}
                            </h3>
                            <p className="text-slate-300 text-sm font-light leading-relaxed">
                                {data?.nextEvent ? `Sintoniza el ${new Date(data.nextEvent.date).toLocaleDateString()} para conectar con la comunidad global.` : 'Conecta con la energía de la semana en tiempo real.'}
                            </p>

                            <button className="w-full py-3.5 mt-2 bg-primary text-slate-950 font-bold font-display tracking-widest rounded-xl shadow-glow-gold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {data?.nextEvent?.isLive ? 'SINTONIZAR AHORA' : 'VER CALENDARIO'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Ask the Rabbi Section */}
                <section>
                    <div className="glass-panel border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all cursor-pointer group flex items-center gap-4">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 text-primary">
                                <Sparkles className="w-4 h-4" />
                                <h4 className="text-base font-display text-white group-hover:text-primary transition-colors">Pregunta al Rabino</h4>
                            </div>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                Envía tus dudas espirituales y recibe guía personalizada.
                            </p>
                        </div>
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-500">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1544648151-1823ed41167b?q=80&w=1974&auto=format&fit=crop')] bg-center bg-cover" />
                        </div>
                    </div>
                </section>

                {/* Community Section */}
                <section className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-white font-display text-lg">Comunidad</h3>
                        <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CommunityCard
                            icon={<Users />}
                            title="Grupos de Estudio"
                            subtitle="Encuentra tu Chevruta y profundiza juntos."
                            status="Próximamente"
                        />
                        <Link href="/foro" className="block h-full">
                            <CommunityCard
                                icon={<MessageSquare />}
                                title="Foro de Discusión"
                                subtitle="Comparte tus revelaciones y debate."
                                active
                            />
                        </Link>
                        <CommunityCard
                            icon={<HandHeart />}
                            title="Círculo de Oración"
                            subtitle="Envía luz a quienes lo necesitan."
                            status="Nuevo"
                            highlight
                        />
                        <CommunityCard
                            icon={<BookOpen />}
                            title="Biblioteca Mural"
                            subtitle="Aportes compartidos de la comunidad."
                            status="Próximamente"
                        />
                    </div>
                </section>

                {/* Inspirational Quote / Stats */}
                <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-white/10 bg-white/5 mt-4">
                    <Sparkles className="w-6 h-6 text-primary/40 mb-3" />
                    <p className="text-slate-400 text-sm italic font-light leading-relaxed mb-4">
                        "La conexión es la clave de la luz."
                    </p>
                    {data?.stats && (
                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-white font-bold text-lg">{data.stats.activeToday}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Buscadores de luz activos hoy</span>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function CommunityCard({ icon, title, subtitle, status, active = false, highlight = false }: { icon: React.ReactNode; title: string; subtitle: string; status?: string; active?: boolean; highlight?: boolean }) {
    return (
        <div className={`relative h-full flex flex-col gap-3 p-5 rounded-3xl border transition-all duration-300
            ${active ? 'glass-panel border-white/10 hover:border-primary/40' : 'bg-slate-900/40 border-white/5 opacity-80'}
            ${highlight ? 'border-primary/20 bg-primary/5' : ''}
        `}>
            {status && (
                <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest
                        ${status === 'Nuevo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-500'}
                    `}>
                        {status}
                    </span>
                </div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${active || highlight ? 'bg-primary text-slate-950' : 'bg-slate-800 text-slate-500'}
            `}>
                {React.cloneElement(icon as React.ReactElement<any>, { className: "w-6 h-6" })}
            </div>
            <div className="space-y-1">
                <h4 className={`text-sm font-bold tracking-wide ${active || highlight ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
                <p className="text-[10px] text-slate-500 leading-normal font-light">{subtitle}</p>
            </div>
        </div>
    );
}
