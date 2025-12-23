'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    BookOpen,
    Sparkles,
    TreeDeciduous,
    Star,
    Zap,
    Lock,
    ChevronRight,
    Play
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import playlists from '@/data/playlists.json';

export default function ExplorarPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-display font-bold text-white tracking-tight">Enseñanzas</h1>
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Search className="w-5 h-5 text-slate-300" />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pb-32">
                {/* Continue Reading / Featured */}
                <section className="px-6 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-display font-bold text-white">Seguir Aprendiendo</h2>
                    </div>
                    <Card glass className="p-0 overflow-hidden relative group border-primary/20 bg-gradient-to-br from-indigo-900/20 to-transparent">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?w=800&q=80')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                        <div className="relative z-10 p-5 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[0.6rem] font-bold bg-primary/20 text-primary border border-primary/20 uppercase tracking-wider">
                                    Secretos del Zohar
                                </span>
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-display font-bold text-white mb-1">La Naturaleza de la Luz</h3>
                                <p className="text-xs text-slate-400 line-clamp-2 mb-4">Entendiendo la luz infinita (Ein Sof) y el proceso de contracción (Tzimtzum).</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black shadow-gold group-hover:scale-110 transition-transform">
                                        <Play className="w-5 h-5 fill-current" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-[0.6rem] text-slate-500 mb-1 font-bold uppercase tracking-widest">
                                            <span>Progreso</span>
                                            <span>12 min restantes</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[35%] rounded-full shadow-gold" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Themes Grid */}
                <section className="py-2 mb-6">
                    <div className="px-6 mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-display font-bold text-white">Temas Principales</h2>
                    </div>
                    <div className="flex overflow-x-auto no-scrollbar px-6 gap-4 snap-x">
                        <ThemeCard title="El Zohar" icon={<BookOpen />} image="https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200&q=80" color="bg-purple-500" />
                        <ThemeCard title="Árbol Vida" icon={<TreeDeciduous />} image="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&q=80" color="bg-emerald-500" />
                        <ThemeCard title="Letras" icon={<Zap />} image="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=200&q=80" color="bg-blue-500" />
                        <ThemeCard title="Astrología" icon={<Star />} image="https://images.unsplash.com/photo-1506318183103-e13745e946fe?w=200&q=80" color="bg-amber-500" />
                    </div>
                </section>

                {/* Series List */}
                <section className="px-6 mt-4">
                    <h2 className="text-lg font-display font-bold text-white mb-4">Series y Cursos</h2>
                    <div className="space-y-4">
                        {playlists.map((playlist) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

function ThemeCard({ title, icon, image, color }: { title: string, icon: React.ReactNode, image: string, color: string }) {
    return (
        <div className="snap-start shrink-0 w-28 flex flex-col gap-2 group cursor-pointer">
            <div className="w-28 h-28 rounded-2xl overflow-hidden relative border border-white/10 shadow-lg">
                <div className={`absolute inset-0 ${color} opacity-20 group-hover:opacity-10 transition-opacity z-10`} />
                <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center z-20 text-white drop-shadow-lg">
                    {React.cloneElement(icon as React.ReactElement, { className: "w-8 h-8" })}
                </div>
            </div>
            <p className="text-xs font-bold text-center text-slate-400 group-hover:text-primary transition-colors tracking-wide uppercase">{title}</p>
        </div>
    );
}

function PlaylistCard({ playlist }: { playlist: any }) {
    return (
        <Card glass className="p-3 border-white/5 flex gap-4 items-center group hover:bg-white/5 transition-all cursor-pointer">
            <div className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                    <Play className="w-6 h-6 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                </div>
                <img src={playlist.image} alt={playlist.titulo} className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-display font-bold text-white truncate group-hover:text-primary transition-colors">{playlist.titulo}</h3>
                <p className="text-[0.65rem] text-slate-500 mt-1 line-clamp-1 leading-relaxed">{playlist.descripcion}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[0.6rem] bg-white/5 text-slate-400 px-2 py-0.5 rounded border border-white/5 font-bold uppercase tracking-wider">
                        {playlist.video_count} Clases
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-[0.6rem] text-primary font-bold uppercase tracking-widest">Empieza aquí</span>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
        </Card>
    );
}
