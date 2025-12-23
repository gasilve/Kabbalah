'use client';

import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Search, Sparkles, Filter } from "lucide-react";
import { NAMES_72_COMPLETE, CATEGORIES } from "@/data/72-names";

export default function NombresPage() {
    const [filter, setFilter] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const filteredNames = NAMES_72_COMPLETE.filter(name => {
        if (filter && name.category !== filter) return false;
        if (search && !name.meaning.toLowerCase().includes(search.toLowerCase()) &&
            !name.intention.toLowerCase().includes(search.toLowerCase()) &&
            !name.letters.includes(search)) return false;
        return true;
    });

    return (
        <div className="min-h-screen pb-32">
            <AnimatedBackground />

            {/* Header */}
            <header className="sticky top-0 z-40 bg-background-deep/90 backdrop-blur-xl border-b border-accent-gold/20 px-4 py-4">
                <div className="flex items-center gap-4 max-w-lg mx-auto">
                    <Link href="/explorar" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-accent-gold" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-serif font-bold text-white">72 Nombres de Dios</h1>
                        <p className="text-[10px] text-gray-400">Tecnología espiritual ancestral</p>
                    </div>
                </div>
            </header>

            <div className="px-4 py-6 max-w-lg mx-auto">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-2xl overflow-hidden mb-6 text-center p-6"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(168,85,247,0.3) 100%)',
                        border: '1px solid rgba(59,130,246,0.3)',
                    }}
                >
                    <Sparkles className="absolute top-4 right-4 h-6 w-6 text-accent-gold/50" />

                    <motion.h2
                        className="text-4xl font-serif font-bold mb-3"
                        style={{
                            background: 'linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #FBBF24 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        שם המפורש
                    </motion.h2>
                    <p className="text-sm text-gray-300 mb-4">
                        72 secuencias de tres letras extraídas del Éxodo 14:19-21
                    </p>
                </motion.div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por intención..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50"
                    />
                </div>

                {/* Category Filters */}
                <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 mb-4">
                    <button
                        onClick={() => setFilter(null)}
                        className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${!filter ? 'bg-violet-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        Todos
                    </button>
                    {Object.entries(CATEGORIES).map(([key, cat]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${filter === key
                                    ? 'text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            style={filter === key ? { background: cat.color } : {}}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Names Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {filteredNames.map((name, idx) => (
                        <motion.div
                            key={name.num}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.02 }}
                        >
                            <Link href={`/72-nombres/${name.num}`}>
                                <div
                                    className="p-3 rounded-xl text-center cursor-pointer hover:scale-105 transition-transform"
                                    style={{
                                        background: `linear-gradient(135deg, ${CATEGORIES[name.category as keyof typeof CATEGORIES]?.color}15 0%, rgba(0,0,0,0.3) 100%)`,
                                        border: `1px solid ${CATEGORIES[name.category as keyof typeof CATEGORIES]?.color}30`,
                                    }}
                                >
                                    <span className="text-[10px] text-gray-500">#{name.num}</span>
                                    <div
                                        className="text-2xl font-bold my-1"
                                        style={{
                                            background: `linear-gradient(135deg, ${CATEGORIES[name.category as keyof typeof CATEGORIES]?.color} 0%, #FBBF24 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {name.letters}
                                    </div>
                                    <p className="text-[9px] text-gray-400 line-clamp-1">{name.meaning}</p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {filteredNames.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No se encontraron nombres</p>
                    </div>
                )}
            </div>
        </div>
    );
}
