'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Sparkles,
    Play,
    RotateCcw,
    ChevronRight,
    Sun,
    TreeDeciduous,
    BookOpen,
    Filter
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import meditationsData from '@/data/meditations_all.json';

const categories = ["Todas", "Zohar", "72 Nombres", "Árbol de la Vida", "Tefilá", "Otros"];

export default function MeditationListPage() {
    const [activeCategory, setActiveCategory] = useState("Todas");
    const [searchQuery, setSearchQuery] = useState("");

    const meditations = meditationsData.meditaciones;

    const filteredMeditations = meditations.filter(med => {
        const matchesCategory = activeCategory === "Todas" || med.category === activeCategory;
        const matchesSearch = med.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            med.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Group by category for the "All" view
    const groupedMeditations = activeCategory === "Todas"
        ? categories.slice(1).map(cat => ({
            name: cat,
            items: filteredMeditations.filter(m => m.category === cat).slice(0, 5)
        })).filter(g => g.items.length > 0)
        : [{ name: activeCategory, items: filteredMeditations }];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-display font-bold text-white tracking-tight">Meditaciones Sagradas</h1>
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Search className="w-5 h-5 text-slate-300" />
                    </button>
                </div>
            </header>

            {/* Category Chips */}
            <div className="sticky top-[68px] z-40 bg-background/80 backdrop-blur-md py-4">
                <div className="flex gap-3 px-6 overflow-x-auto no-scrollbar snap-x">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`snap-start flex h-9 shrink-0 items-center justify-center px-5 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === cat
                                    ? "bg-primary text-black shadow-gold"
                                    : "bg-white/5 border border-white/10 text-slate-400"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 pb-32">
                {groupedMeditations.map((group, idx) => (
                    <div key={group.name} className="mt-6 mb-2">
                        <h3 className="text-white text-lg font-display font-bold px-2 mb-4 flex items-center gap-2">
                            <CategoryIcon category={group.name} />
                            {group.name}
                        </h3>

                        <div className="space-y-4">
                            {group.items.map((med) => (
                                <MeditationCard key={med.id} meditation={med} />
                            ))}
                        </div>
                    </div>
                ))}

                {filteredMeditations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p>No se encontraron meditaciones</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function CategoryIcon({ category }: { category: string }) {
    switch (category) {
        case '72 Nombres': return <Sparkles className="w-5 h-5 text-primary" />;
        case 'Zohar': return <BookOpen className="w-5 h-5 text-primary" />;
        case 'Tefilá': return <Filter className="w-5 h-5 text-primary" />;
        case 'Árbol de la Vida': return <TreeDeciduous className="w-5 h-5 text-primary" />;
        default: return <Sun className="w-5 h-5 text-primary" />;
    }
}

function MeditationCard({ meditation }: { meditation: any }) {
    return (
        <Card glass className="p-3 border-white/5 flex gap-4 items-center group active:scale-[0.98] transition-all duration-200 cursor-pointer">
            <div className="w-[70px] h-[70px] rounded-lg bg-slate-800/50 flex items-center justify-center shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-40" />
                <Play className="w-8 h-8 text-primary/80 group-hover:text-primary transition-colors" />
            </div>

            <div className="flex flex-1 flex-col justify-center min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <p className="text-white text-base font-bold leading-tight truncate pr-2">{meditation.titulo}</p>
                    {meditation.id === 'med-001' && (
                        <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20 shrink-0">HECHO</span>
                    )}
                </div>
                <p className="text-slate-400 text-xs font-medium leading-normal mb-1">{meditation.duracion} • {meditation.tipo}</p>
                <p className="text-slate-500 text-[0.7rem] font-normal leading-tight truncate line-clamp-1">{meditation.descripcion}</p>

                {/* Fake Progress for demo effect */}
                <div className="w-full bg-white/5 rounded-full h-1 mt-2 overflow-hidden">
                    <div
                        className={`h-1 rounded-full ${meditation.id === 'med-001' ? 'bg-green-500 w-full' : 'bg-primary/50 w-[15%]'}`}
                    />
                </div>
            </div>

            <button className="shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-primary hover:bg-primary hover:text-black transition-colors">
                {meditation.id === 'med-001' ? <RotateCcw className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
        </Card>
    );
}
