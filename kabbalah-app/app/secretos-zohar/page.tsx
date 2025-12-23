'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, Sparkles, Heart, Shield, Zap, Brain } from 'lucide-react';
import Link from 'next/link';
import zoharData from '../../data/zohar_db.json';

interface DivineName {
    nombre_hebreo: string;
    transliteracion: string;
    tipo: string;
    descripcion: string;
}

interface ZoharItem {
    metadata: {
        titulo: string;
        video_id: string;
        duracion_minutos: number;
        tipo: string;
    };
    meditaciones: any[];
    nombres_divinos: DivineName[];
    conceptos: any[];
    intenciones_principales: string[];
}

const INTENTION_ICONS: Record<string, React.ReactNode> = {
    salud: <Heart className="w-4 h-4" />,
    proteccion: <Shield className="w-4 h-4" />,
    prosperidad: <Zap className="w-4 h-4" />,
    sabiduria: <Brain className="w-4 h-4" />,
    amor: <Heart className="w-4 h-4" />,
    conexion: <Sparkles className="w-4 h-4" />
};

export default function SecretosZoharPage() {
    const [items, setItems] = useState<ZoharItem[]>([]);
    const [filter, setFilter] = useState('todos');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setItems((zoharData as any).items || []);
    }, []);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.metadata.titulo.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'todos' || item.intenciones_principales.includes(filter);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen pb-32 relative text-slate-100 overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <img
                    src="/images/zohar_bg.jpg"
                    alt="Zohar Background"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90"></div>
            </div>

            <div className="relative z-10 px-6 pt-12">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto mb-12 text-center"
                >
                    <div className="inline-block mb-4 p-3 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-md">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-amber-300 to-amber-600">
                        Secretos del Zohar
                    </h1>
                    <p className="text-lg md:text-xl text-amber-100/60 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                        Explora la sabiduría oculta, las meditaciones cabalísticas y los nombres divinos.
                    </p>
                </motion.header>

                <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                    {/* Search */}
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar clase, concepto o nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl focus:outline-none focus:border-amber-500/50 text-sm placeholder:text-slate-600"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {['todos', 'salud', 'prosperidad', 'proteccion', 'sabiduria', 'amor'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${filter === f
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                        : 'bg-slate-800/40 text-slate-400 border border-transparent hover:bg-slate-800'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-500"
                        >
                            <div className="h-48 relative overflow-hidden flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500 border border-amber-500/20">
                                    <BookOpen className="w-8 h-8 text-amber-400" />
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <span className="text-xs font-mono text-amber-200 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                        {item.metadata.duracion_minutos.toFixed(0)} min
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-serif font-medium mb-3 text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-2">
                                    {item.metadata.titulo}
                                </h3>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.intenciones_principales.map(tag => (
                                        <span key={tag} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-white/5 text-amber-500/80 border border-amber-500/10">
                                            {INTENTION_ICONS[tag]}
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-4 mb-8">
                                    {item.nombres_divinos.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-900/10 border border-amber-500/10">
                                            <Sparkles className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />
                                            <div>
                                                <span className="text-xs text-amber-200/70 uppercase tracking-wider font-bold block mb-1">Nombres Divinos</span>
                                                <p className="text-sm text-slate-300">
                                                    {item.nombres_divinos.map(n => n.transliteracion).slice(0, 3).join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {item.meditaciones.length > 0 && (
                                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-900/10 border border-blue-500/10">
                                            <Brain className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
                                            <div>
                                                <span className="text-xs text-blue-200/70 uppercase tracking-wider font-bold block mb-1">Meditación</span>
                                                <p className="text-sm text-slate-300 line-clamp-2">
                                                    {item.meditaciones[0].descripcion || item.meditaciones[0].titulo}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href={`https://www.youtube.com/watch?v=${item.metadata.video_id}`}
                                    target="_blank"
                                    className="block w-full py-3.5 text-center rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                                >
                                    Ver Clase Completa
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
