'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, BookOpen, Eye, Filter, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

const PARASHAT = ['Todas', 'Bereshit', 'Noaj', 'Lej Leja', 'Vayera', 'Jayei Sarah', 'Toldot', 'Vayetze', 'Vayishlaj', 'Vayeshev', 'Miketz', 'Vayigash', 'Vayeji', 'Shemot', 'Vaera', 'Bo', 'Beshalaj', 'Yitro', 'Mishpatim', 'General'];
const LEVELS = ['Todos', 'principiante', 'intermedio', 'avanzado'];

export default function RevelacionesPage() {
    const [selectedParasha, setSelectedParasha] = useState('Todas');
    const [selectedLevel, setSelectedLevel] = useState('Todos');
    const [revelationsList, setRevelationsList] = useState<any[]>([]);
    const [selectedRevelation, setSelectedRevelation] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/content?type=revelaciones');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setRevelationsList(data);
                }
            } catch (error) {
                console.error("Error fetching Revelations:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtrar revelaciones
    const filteredRevelations = useMemo(() => {
        return revelationsList.filter(rev => {
            const matchesParasha = selectedParasha === 'Todas' || rev.parasha === selectedParasha;
            const matchesLevel = selectedLevel === 'Todos' || rev.level === selectedLevel;
            return matchesParasha && matchesLevel;
        });
    }, [selectedParasha, selectedLevel, revelationsList]);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'principiante': return 'text-green-400';
            case 'intermedio': return 'text-yellow-400';
            case 'avanzado': return 'text-purple-400';
            default: return 'text-white';
        }
    };

    return (
        <div className="min-h-screen relative pb-24">
            <AnimatedBackground />

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Sparkles className="w-8 h-8 text-accent-gold" />
                        <h1 className="text-4xl font-bold text-white">
                            Revelaciones y Secretos
                        </h1>
                        <Sparkles className="w-8 h-8 text-accent-gold" />
                    </div>
                    <p className="text-xl text-accent-gold">
                        גילויים וסודות התורה
                    </p>
                    <p className="text-white/70 mt-2">
                        Secretos místicos revelados del Zohar y la Torah
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="max-w-4xl mx-auto mb-8 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Parasha Filter */}
                        <div>
                            <label className="text-white/70 text-sm mb-2 block">Parashá</label>
                            <select
                                value={selectedParasha}
                                onChange={(e) => setSelectedParasha(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                            >
                                {PARASHAT.map(parasha => (
                                    <option key={parasha} value={parasha} className="bg-background-deep">
                                        {parasha}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Level Filter */}
                        <div>
                            <label className="text-white/70 text-sm mb-2 block">Nivel de Profundidad</label>
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                            >
                                {LEVELS.map(level => (
                                    <option key={level} value={level} className="bg-background-deep">
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="text-white/60 text-sm">
                        {filteredRevelations.length} {filteredRevelations.length === 1 ? 'revelación' : 'revelaciones'}
                    </div>
                </div>

                {/* Revelations Grid */}
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredRevelations.map((revelation, index) => (
                            <motion.div
                                key={revelation.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <Card
                                    className="p-6 h-full hover:shadow-xl hover:shadow-accent-gold/30 transition-all duration-300 cursor-pointer relative overflow-hidden group"
                                    onClick={() => setSelectedRevelation(revelation)}
                                >
                                    {/* Decorative corner */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent-gold/20 to-transparent rounded-bl-3xl" />

                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-gold/30 to-accent-gold/10 flex items-center justify-center">
                                                <Eye className="w-6 h-6 text-accent-gold" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
                                                    {revelation.parasha}
                                                </span>
                                                <span className={`text-xs font-semibold ${getLevelColor(revelation.level)}`}>
                                                    {revelation.level}
                                                </span>
                                            </div>

                                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-gold transition-colors">
                                                {revelation.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-white/70 text-sm mb-4 line-clamp-3">
                                        {revelation.revelation}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {revelation.themes.slice(0, 3).map(theme => (
                                            <span
                                                key={theme}
                                                className="text-xs px-2 py-1 rounded-full bg-accent-gold/10 text-accent-gold"
                                            >
                                                {theme}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="text-xs text-white/50 flex items-center gap-2">
                                        <BookOpen className="w-3 h-3" />
                                        {revelation.biblical_ref}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRevelation && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedRevelation(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-background-deep to-background-deep/95 border border-accent-gold/30 rounded-2xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent" />

                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/50 flex items-center justify-center flex-shrink-0">
                                    <Star className="w-8 h-8 text-white" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm px-3 py-1 rounded-full bg-accent-gold/20 text-accent-gold">
                                            {selectedRevelation.parasha}
                                        </span>
                                        <span className={`text-sm font-semibold ${getLevelColor(selectedRevelation.level)}`}>
                                            Nivel: {selectedRevelation.level}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">
                                        {selectedRevelation.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6 mb-6">
                                <p className="text-white/90 text-lg leading-relaxed">
                                    {selectedRevelation.revelation}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="text-sm text-white/50 mb-2">Referencia Bíblica</div>
                                    <div className="text-white flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-accent-gold" />
                                        {selectedRevelation.biblical_ref}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-white/50 mb-2">Temas</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRevelation.themes.map(theme => (
                                            <span
                                                key={theme}
                                                className="px-3 py-1 rounded-full bg-accent-gold/10 text-accent-gold text-sm"
                                            >
                                                {theme}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-sm text-white/50 mb-2">Fuente</div>
                                    <div className="text-white">{selectedRevelation.video_title}</div>
                                    <div className="text-white/60 text-sm mt-1">
                                        {selectedRevelation.source} • {Math.floor(selectedRevelation.timestamp / 60)}:{String(Math.floor(selectedRevelation.timestamp % 60)).padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
