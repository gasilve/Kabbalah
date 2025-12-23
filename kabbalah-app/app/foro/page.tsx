'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageCircle, Heart, Pin, Flame, ArrowLeft, Megaphone, X } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const categories = ["Todos", "Parashá", "Zohar", "Meditación", "Cursos"];

export default function ForoPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });

    const filteredPosts = selectedCategory === "Todos"
        ? posts
        : posts.filter(p => p.category === selectedCategory);


    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/forum');
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        try {
            const res = await fetch('/api/forum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost)
            });

            if (res.ok) {
                setIsPostModalOpen(false);
                setNewPost({ title: '', content: '', category: 'General' });
                fetchPosts();
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="min-h-screen pb-32">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-4 py-3">
                <div className="flex items-center justify-between mb-4">
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-300" />
                    </button>
                    <h1 className="text-lg font-display text-white tracking-widest">Foro de Discusión</h1>
                    <button
                        onClick={() => setIsPostModalOpen(true)}
                        className="bg-primary p-2 rounded-full shadow-glow-gold hover:scale-110 transition-transform"
                    >
                        <Plus className="w-5 h-5 text-slate-950" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar temas sagrados..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-1 focus:ring-primary/50 transition-all outline-none text-slate-200"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border
                                ${selectedCategory === cat
                                    ? 'bg-primary border-primary text-slate-950 shadow-glow-gold'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            <main className="px-4 py-6 space-y-4">
                {/* Pinned Post */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-primary/5 border border-primary/20 p-4"
                >
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                        <Megaphone className="w-16 h-16 text-primary" />
                    </div>
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="p-1.5 rounded-full bg-primary/20">
                            <Pin className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">Normas de la Comunidad</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-light">
                                Bienvenidos al espacio sagrado. Por favor, mantengan el respeto y la luz en cada interacción.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Feed */}
                <div className="space-y-4">
                    {filteredPosts.length === 0 && !loading && (
                        <div className="text-center py-20 opacity-40 italic">No hay mensajes aún en esta categoría.</div>
                    )}
                    {filteredPosts.map((thread, idx) => (
                        <motion.article
                            key={thread._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all cursor-pointer group active:scale-[0.98]"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-slate-800">
                                        {thread.author?.image ? (
                                            <Image
                                                src={thread.author.image}
                                                alt={thread.author.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-primary">
                                                {thread.author?.name?.substring(0, 2) || '??'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{thread.author?.name}</span>
                                        <span className="text-[10px] text-slate-500">{new Date(thread.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary uppercase tracking-wider">
                                    {thread.category}
                                </span>
                            </div>

                            <h3 className="text-base font-display text-white mb-2 group-hover:text-primary/90 transition-colors">
                                {thread.title}
                            </h3>
                            <p className="text-sm text-slate-400 font-light line-clamp-2 leading-relaxed mb-5">
                                {thread.content}
                            </p>

                            <div className="flex items-center gap-6 pt-4 border-t border-white/5 text-[10px] font-bold text-slate-500">
                                <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{thread.replies} respuestas</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                                    <Heart className="w-4 h-4" />
                                    <span>{thread.likes}</span>
                                </div>
                                {thread.isHot && (
                                    <div className="flex items-center gap-1 ml-auto text-primary/80 animate-pulse">
                                        <Flame className="w-3 h-3 fill-primary" />
                                        <span className="uppercase tracking-widest">Activo</span>
                                    </div>
                                )}
                            </div>
                        </motion.article>
                    ))}
                </div>
            </main>
            {/* New Post Modal */}
            {isPostModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setIsPostModalOpen(false)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="relative w-full max-w-lg glass-panel border border-white/10 p-6 rounded-3xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-display text-white">Nuevo Tema</h2>
                            <button onClick={() => setIsPostModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Título</label>
                                <input
                                    required
                                    value={newPost.title}
                                    onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors"
                                    placeholder="¿Sobre qué quieres hablar?"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Mensaje</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newPost.content}
                                    onChange={e => setNewPost({ ...newPost, content: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors"
                                    placeholder="Comparte tu sabiduría..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Categoría</label>
                                <select
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50 transition-colors appearance-none"
                                    value={newPost.category}
                                    onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                                >
                                    {categories.slice(1).map(cat => (
                                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                                    ))}
                                    <option value="General" className="bg-slate-900">General</option>
                                </select>
                            </div>
                            <button className="w-full py-4 bg-primary text-slate-950 font-bold font-display tracking-widest rounded-xl shadow-glow-gold hover:scale-[1.02] transition-transform">
                                PUBLICAR EN EL FORO
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
