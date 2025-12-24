'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, Play, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

const CATEGORIES = ['Todos', 'Vida Diaria', 'Zohar', 'Festividades', 'Relaciones', 'Propósito', 'Conceptos'];

export default function PreguntasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [qaList, setQaList] = useState<any[]>([]);
    const [selectedQA, setSelectedQA] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/content?type=qa');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setQaList(data);
                }
            } catch (error) {
                console.error("Error fetching QA:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtrar Q&A
    const filteredQA = useMemo(() => {
        return qaList.filter(qa => {
            const matchesSearch = searchQuery === '' ||
                qa.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                qa.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (qa.keywords && qa.keywords.some((k: string) => k.toLowerCase().includes(searchQuery.toLowerCase())));

            const matchesCategory = selectedCategory === 'Todos' ||
                qa.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, selectedCategory, qaList]);

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
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Preguntas y Respuestas
                    </h1>
                    <p className="text-xl text-accent-gold">
                        שאלות ותשובות
                    </p>
                    <p className="text-white/70 mt-2">
                        Respuestas extraídas de las enseñanzas de Albert Gozlan
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <div className="max-w-4xl mx-auto mb-8 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                            type="text"
                            placeholder="Buscar preguntas, respuestas, palabras clave..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
                        />
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`
                  px-4 py-2 rounded-lg transition-all duration-200
                  ${selectedCategory === category
                                        ? 'bg-accent-gold text-background-deep font-semibold'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }
                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Results count */}
                    <div className="text-white/60 text-sm">
                        {filteredQA.length} {filteredQA.length === 1 ? 'resultado' : 'resultados'}
                    </div>
                </div>

                {/* Q&A Grid */}
                <div className="max-w-4xl mx-auto space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredQA.map((qa, index) => (
                            <motion.div
                                key={qa.question}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="p-6 hover:shadow-lg hover:shadow-accent-gold/20 transition-all duration-300 cursor-pointer"
                                    onClick={() => setSelectedQA(qa)}>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center">
                                                <BookOpen className="w-6 h-6 text-accent-gold" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="text-xs text-accent-gold mb-2">
                                                {qa.category}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">
                                                {qa.question}
                                            </h3>
                                            <p className="text-white/70 text-sm line-clamp-2 mb-3">
                                                {qa.answer}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-white/50">
                                                <span>{qa.video_title}</span>
                                                <span>•</span>
                                                <span>{Math.floor(qa.timestamp / 60)}:{String(Math.floor(qa.timestamp % 60)).padStart(2, '0')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredQA.length === 0 && (
                        <div className="text-center text-white/50 py-12">
                            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p>No se encontraron resultados para tu búsqueda</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedQA && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedQA(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background-deep border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-sm text-accent-gold">
                                    {selectedQA.category}
                                </div>
                                <button
                                    onClick={() => setSelectedQA(null)}
                                    className="text-white/50 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-4">
                                {selectedQA.question}
                            </h2>

                            <p className="text-white/80 text-lg mb-6 leading-relaxed">
                                {selectedQA.answer}
                            </p>

                            <div className="border-t border-white/10 pt-6 space-y-4">
                                <div>
                                    <div className="text-sm text-white/50 mb-2">Fuente</div>
                                    <div className="text-white">{selectedQA.video_title}</div>
                                </div>

                                <div>
                                    <div className="text-sm text-white/50 mb-2">Palabras clave</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedQA.keywords.map((keyword: string) => (
                                            <span
                                                key={keyword}
                                                className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full mt-4 py-3 rounded-xl bg-accent-gold text-background-deep font-semibold hover:bg-accent-gold/90 transition-colors flex items-center justify-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Ver en video ({Math.floor(selectedQA.timestamp / 60)}:{String(Math.floor(selectedQA.timestamp % 60)).padStart(2, '0')})
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
