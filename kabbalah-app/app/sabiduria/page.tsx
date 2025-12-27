'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    X,
    BookOpen,
    Shield,
    Heart,
    Zap,
    Sparkles,
    ChevronRight,
    Star,
    Compass,
    Info
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type Tab = 'conceptos' | 'rituales' | 'nombres';

export default function SabiduriaPage() {
    const [activeTab, setActiveTab] = useState<Tab>('conceptos');
    const [searchQuery, setSearchQuery] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let endpoint = '/api/content?type=conceptos';
                if (activeTab === 'rituales') endpoint = '/api/content?type=rituales'; // To be implemented or used existing
                if (activeTab === 'nombres') endpoint = '/api/content?type=nombres_dios';

                const res = await fetch(endpoint);
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching sabiduria data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    const filteredItems = items.filter(item => {
        const content = (item.term || item.title || item.name || "").toLowerCase();
        return content.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-slate-950 pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel bg-slate-950/80 backdrop-blur-xl px-6 py-6 border-b border-white/5">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-white tracking-widest text-glow">SABIDURÍA</h1>
                        <p className="text-[0.65rem] font-bold text-primary uppercase tracking-[0.2em] mt-1">Manual de Realidad</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder={`Buscar en ${activeTab === 'conceptos' ? 'enciclopedia' : 'manual'}...`}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2">
                        <TabButton
                            active={activeTab === 'conceptos'}
                            onClick={() => setActiveTab('conceptos')}
                            icon={<BookOpen className="w-4 h-4" />}
                            label="Conceptos"
                        />
                        <TabButton
                            active={activeTab === 'rituales'}
                            onClick={() => setActiveTab('rituales')}
                            icon={<Shield className="w-4 h-4" />}
                            label="Rituales"
                        />
                        <TabButton
                            active={activeTab === 'nombres'}
                            onClick={() => setActiveTab('nombres')}
                            icon={<Sparkles className="w-4 h-4" />}
                            label="72 Nombres"
                        />
                    </div>
                </div>
            </header>

            <main className="px-6 py-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-30">
                        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                        <span className="text-[0.6rem] font-bold uppercase tracking-widest">Invocando sabiduría...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeTab === 'rituales' && filteredItems.length === 0 && (
                            /* Static Fallback for Rituals if DB is empty */
                            <section className="space-y-4">
                                <RitualCard
                                    title="Protección de los 4 Ángeles"
                                    purpose="Blindaje contra negatividad"
                                    icon={<Shield className="text-cyan-400" />}
                                    color="cyan"
                                    onClick={() => setSelectedItem({ title: 'Protección de los 4 Ángeles', purpose: 'Blindaje aúrico', steps: ['Cierra los ojos', 'Visualiza a Miguel a tu derecha', 'Visualiza a Gabriel a tu izquierda', 'Rafael frente a ti', 'Uriel detrás de ti'], kavanah: 'Llamar a la guardia celestial para limpiar el espacio personal.' })}
                                />
                                <RitualCard
                                    title="Encuentro de Almas (Zivug)"
                                    purpose="Atraer alma gemela o armonía"
                                    icon={<Heart className="text-rose-400" />}
                                    color="rose"
                                    onClick={() => setSelectedItem({ title: 'Encuentro de Almas', purpose: 'Conexión sagrada', steps: ['Limpieza de vasija', 'Meditación en letra Shin', 'Pedir por el bien común'], kavanah: 'Unir las polaridades Chesed y Gevurah.' })}
                                />
                                <RitualCard
                                    title="Limpieza del Hogar"
                                    purpose="Eliminar estancamiento"
                                    icon={<Zap className="text-amber-400" />}
                                    color="amber"
                                    onClick={() => setSelectedItem({ title: 'Limpieza del Hogar', purpose: 'Purificación energética', steps: ['Uso de incienso', 'Salmos específicos', 'Visualización de luz blanca'], kavanah: 'Convertir la casa en un templo para la Shekhinah.' })}
                                />
                            </section>
                        )}

                        {filteredItems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => setSelectedItem(item)}
                            >
                                <Card glass className="p-4 border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all cursor-pointer">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold tracking-wide">{item.term || item.title || item.name}</span>
                                            <span className="text-primary font-serif text-xs">{item.hebreo || item.transliteration}</span>
                                        </div>
                                        <p className="text-[0.7rem] text-slate-500 line-clamp-1">{item.meaning || item.purpose || item.description}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors" />
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end justify-center"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="w-full max-w-md bg-slate-950 rounded-t-[2.5rem] border-t border-white/10 p-8 pt-6 relative shadow-2xl overflow-y-auto max-h-[85vh] no-scrollbar"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8" />

                            <div className="flex flex-col mb-8 text-center">
                                <h2 className="text-3xl font-display font-bold text-white mb-2">{selectedItem.term || selectedItem.title || selectedItem.name}</h2>
                                <p className="text-xl font-serif text-primary/60">{selectedItem.hebreo || selectedItem.transliteration}</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <Label icon={<Info className="w-3 h-3" />} text="Significado / Propósito" />
                                    <p className="text-slate-300 text-sm leading-relaxed font-light">
                                        {selectedItem.meaning || selectedItem.explanation || selectedItem.purpose || selectedItem.desc || selectedItem.description}
                                    </p>
                                </div>

                                {selectedItem.steps && (
                                    <div>
                                        <Label icon={<Zap className="w-3 h-3" />} text="Pasos a Seguir" />
                                        <div className="space-y-3 mt-3">
                                            {selectedItem.steps.map((step: string, i: number) => (
                                                <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                                                    <span className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-[0.6rem] font-bold text-primary shrink-0">{i + 1}</span>
                                                    <p className="text-[0.7rem] text-slate-400 leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedItem.kavanah && (
                                    <Card glass className="p-4 border-amber-500/20 bg-amber-500/5">
                                        <Label icon={<Sparkles className="w-3 h-3 text-amber-400" />} text="Intención (Kavanah)" />
                                        <p className="text-[0.7rem] text-amber-200/70 italic mt-2 leading-relaxed">
                                            "{selectedItem.kavanah}"
                                        </p>
                                    </Card>
                                )}
                            </div>

                            <div className="mt-10 pb-8">
                                <Button onClick={() => setSelectedItem(null)} className="w-full py-4 uppercase tracking-widest text-xs font-bold">Hecho</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border transition-all ${active
                ? 'bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                : 'bg-white/5 border-white/5 text-slate-500'
                }`}
        >
            {icon}
            <span className="text-[0.6rem] font-bold uppercase tracking-tight">{label}</span>
        </button>
    );
}

function RitualCard({ title, purpose, icon, color, onClick }: any) {
    return (
        <Card
            glass
            onClick={onClick}
            className={`p-5 flex items-center gap-5 border-${color}-500/10 hover:border-${color}-500/30 transition-all cursor-pointer group`}
        >
            <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20 shrink-0 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(icon, { className: "w-7 h-7" })}
            </div>
            <div className="flex-1">
                <h4 className="text-sm font-bold text-white mb-0.5 tracking-tight group-hover:text-glow transition-all">{title}</h4>
                <p className="text-[0.65rem] text-slate-500 font-medium uppercase tracking-widest">{purpose}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-700 group-hover:text-${color}-400 transition-colors`} />
        </Card>
    );
}

function Label({ icon, text }: any) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded bg-slate-800 text-primary">{icon}</div>
            <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">{text}</span>
        </div>
    );
}
