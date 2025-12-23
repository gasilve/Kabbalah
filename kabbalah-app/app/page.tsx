'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CircleProgress } from '@/components/ui/CircleProgress';
import {
  Sparkles,
  Search,
  Bell,
  Play,
  ArrowRight,
  Compass,
  BookOpen,
  Users,
  User,
  Heart,
  Diamond,
  Shield,
  BookMarked,
  Languages,
  ArrowRightCircle
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="pt-14 pb-12 px-6">
      {/* Header */}
      <header className="pb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-display font-bold text-white tracking-widest text-glow flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            KABBALAH
          </h1>
          <p className="text-[0.65rem] font-light tracking-[0.2em] text-primary/80 uppercase ml-1">Path of Enlightenment</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/explorar" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/10 transition-colors group">
            <Search className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
          </Link>
          <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </header>

      {/* My Journey Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 mb-8"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-display font-bold text-slate-100">Mi Camino</h2>
          <Link href="/mi-viaje" className="text-xs text-primary hover:text-primary-dark transition-colors flex items-center">
            Mapa Completo <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        <Link href="/arbol-vida" className="block group relative">
          <Card glass className="p-5 shadow-glow-card relative overflow-hidden transition-all duration-300 group-hover:border-primary/30 group-hover:bg-card-glass/80">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
            <div className="relative z-10 flex items-center gap-5">
              <CircleProgress progress={60} level={3} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[0.65rem] font-bold text-primary uppercase tracking-widest">Nivel Actual</span>
                  <span className="text-[0.65rem] font-bold text-slate-400">60%</span>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-1 group-hover:text-glow transition-all">Sefirá de Hod</h3>
                <p className="text-xs text-slate-400 line-clamp-1">Cultivando la humildad y la entrega divina.</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Card>
        </Link>
      </motion.section>

      {/* Daily Practice */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-display font-bold text-slate-100">Práctica Diaria</h2>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
            <span className="text-[0.65rem] font-medium text-primary/80 uppercase tracking-widest">Activo</span>
          </div>
        </div>

        <Card className="p-0 overflow-hidden flex flex-col group border-white/10">
          <div className="relative h-48 w-full overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8bcbf6755dd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/40 to-transparent" />
            <div className="relative z-10 p-5 flex flex-col h-full justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[0.6rem] font-bold text-white uppercase tracking-wider shadow-lg">
                  <Sparkles className="w-3 h-3 text-accent-blue" />
                  Meditación del Día
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-1 drop-shadow-lg">Luz del Zohar</h3>
                <p className="text-xs text-slate-200/90 font-light mb-4 line-clamp-2 max-w-[90%] drop-shadow-md">Conecta con la energía espiritual de protección escaneando las letras antiguas.</p>
                <Button className="bg-gradient-to-r from-accent-blue to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl py-2 shadow-[0_0_15px_rgba(59,130,246,0.3)] w-fit h-auto px-5 text-xs">
                  <Play className="w-4 h-4 mr-2" /> Comenzar Sesión
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-md border-t border-white/5 p-4">
            <h4 className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Bell className="w-3 h-3" /> Próximas Conexiones
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2.5 flex items-center gap-3 transition-colors cursor-pointer group/item">
                <div className="w-8 h-8 rounded-lg bg-[#0B1026] border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-accent-purple/50 group-hover/item:text-accent-purple transition-colors">
                  <Sparkles className="w-4 h-4 text-slate-400 group-hover/item:text-accent-purple" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.65rem] text-accent-purple font-bold">8:00 PM</span>
                  <span className="text-[0.7rem] font-bold text-slate-300">Tefilá Arvit</span>
                </div>
              </div>
              <div className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-2.5 flex items-center gap-3 transition-colors cursor-pointer group/item">
                <div className="w-8 h-8 rounded-lg bg-[#0B1026] border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-accent-gold/50 group-hover/item:text-accent-gold transition-colors">
                  <BookOpen className="w-4 h-4 text-slate-400 group-hover/item:text-accent-gold" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[0.65rem] text-accent-gold font-bold">10:00 PM</span>
                  <span className="text-[0.7rem] font-bold text-slate-300">Estudio Nocturno</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Library Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-lg font-display font-bold text-slate-100 mb-4 px-1">Biblioteca</h2>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/meditacion" className="glass-panel bg-card-glass border border-card-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all group h-32 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Meditación</span>
          </Link>
          <Link href="/explorar" className="glass-panel bg-card-glass border border-card-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all group h-32 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <BookMarked className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Enseñanzas</span>
          </Link>
          <Link href="/glosario" className="glass-panel bg-card-glass border border-card-border rounded-2xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all group h-32 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Languages className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Glosario</span>
          </Link>
        </div>
      </motion.section>

      {/* Intenciones Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg font-display font-bold text-slate-100">Intenciones</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
          <div className="snap-start shrink-0 w-40 glass-panel bg-card-glass border border-card-border rounded-2xl p-4 relative overflow-hidden group hover:border-pink-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50" />
            <div className="flex flex-col h-full justify-between">
              <div>
                <Heart className="w-8 h-8 text-pink-400 mb-2 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]" />
                <h3 className="font-display font-bold text-white text-sm mb-1 uppercase tracking-wider">Amor Divino</h3>
                <p className="text-[0.6rem] text-slate-400 leading-tight">Abre tu vasija para recibir la luz del creador.</p>
              </div>
              <button className="mt-3 text-[0.6rem] font-bold text-pink-400 uppercase tracking-wider flex items-center group-hover:gap-1 transition-all">
                Activar <ArrowRightCircle className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
          <div className="snap-start shrink-0 w-40 glass-panel bg-card-glass border border-card-border rounded-2xl p-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            <div className="flex flex-col h-full justify-between">
              <div>
                <Diamond className="w-8 h-8 text-primary mb-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                <h3 className="font-display font-bold text-white text-sm mb-1 uppercase tracking-wider">Abundancia</h3>
                <p className="text-[0.6rem] text-slate-400 leading-tight">Alínea tu intención con el flujo infinito.</p>
              </div>
              <button className="mt-3 text-[0.6rem] font-bold text-primary uppercase tracking-wider flex items-center group-hover:gap-1 transition-all">
                Activar <ArrowRightCircle className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
          <div className="snap-start shrink-0 w-40 glass-panel bg-card-glass border border-card-border rounded-2xl p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            <div className="flex flex-col h-full justify-between">
              <div>
                <Shield className="w-8 h-8 text-cyan-400 mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <h3 className="font-display font-bold text-white text-sm mb-1 uppercase tracking-wider">Protección</h3>
                <p className="text-[0.6rem] text-slate-400 leading-tight">Escudo espiritual contra energías negativas.</p>
              </div>
              <button className="mt-3 text-[0.6rem] font-bold text-cyan-400 uppercase tracking-wider flex items-center group-hover:gap-1 transition-all">
                Activar <ArrowRightCircle className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

