'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CelestialSphereProps {
    label: string;
    subtitle?: string;
    icon?: string;
    href: string;
    color: string;
    glowColor: string;
    size?: 'small' | 'medium' | 'large';
    position?: { x: number; y: number };
    delay?: number;
}

export function CelestialSphere({
    label,
    subtitle,
    icon,
    href,
    color,
    glowColor,
    size = 'medium',
    position,
    delay = 0
}: CelestialSphereProps) {
    const sizeClasses = {
        small: 'h-20 w-20',
        medium: 'h-28 w-28',
        large: 'h-36 w-36'
    };

    const iconSizes = {
        small: 'text-3xl',
        medium: 'text-4xl',
        large: 'text-5xl'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.6, type: "spring", bounce: 0.4 }}
            style={position ? { position: 'absolute', left: `${position.x}%`, top: `${position.y}%`, transform: 'translate(-50%, -50%)' } : undefined}
        >
            <Link href={href} className="group block">
                <div className="relative flex flex-col items-center">
                    {/* Multiple Glow Rings */}
                    <div
                        className="absolute inset-0 rounded-full opacity-30 blur-xl group-hover:opacity-60 transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                            transform: 'scale(1.8)'
                        }}
                    />
                    <div
                        className="absolute inset-0 rounded-full opacity-20 blur-md"
                        style={{
                            background: `radial-gradient(circle, ${glowColor} 0%, transparent 60%)`,
                            transform: 'scale(1.4)'
                        }}
                    />

                    {/* Outer Ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className={`absolute ${sizeClasses[size]} rounded-full`}
                        style={{
                            border: `1px solid ${color}40`,
                            transform: 'scale(1.3)'
                        }}
                    />

                    {/* Main Sphere */}
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}
                        style={{
                            background: `
                                radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4) 0%, transparent 40%),
                                radial-gradient(circle at 70% 80%, rgba(0,0,0,0.4) 0%, transparent 50%),
                                linear-gradient(135deg, ${color}ee 0%, ${color}88 50%, ${color}44 100%)
                            `,
                            boxShadow: `
                                inset 0 0 30px rgba(255,255,255,0.2),
                                inset 0 -10px 20px rgba(0,0,0,0.3),
                                0 0 20px ${glowColor}40,
                                0 0 40px ${glowColor}20
                            `,
                            border: `2px solid ${color}60`
                        }}
                    >
                        {/* Glass Highlight */}
                        <div
                            className="absolute top-2 left-3 w-1/3 h-1/4 rounded-full opacity-60"
                            style={{
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)'
                            }}
                        />

                        {/* Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`${iconSizes[size]} filter drop-shadow-lg`}>{icon}</span>
                        </div>
                    </motion.div>

                    {/* Label */}
                    <div className="mt-3 text-center">
                        <span className="block text-sm font-bold text-white uppercase tracking-wider">
                            {label}
                        </span>
                        {subtitle && (
                            <span className="block text-[10px] text-gray-400 mt-1">
                                {subtitle}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Central Sun Component  
export function CentralSun() {
    return (
        <motion.div
            className="relative"
            animate={{
                boxShadow: [
                    '0 0 40px rgba(251,191,36,0.4)',
                    '0 0 80px rgba(251,191,36,0.6)',
                    '0 0 40px rgba(251,191,36,0.4)'
                ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Outer Corona */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 rounded-full opacity-30"
                style={{
                    background: 'conic-gradient(from 0deg, transparent, #FBBF24 10%, transparent 20%)',
                }}
            />

            {/* Main Sun */}
            <div
                className="relative h-36 w-36 rounded-full flex items-center justify-center"
                style={{
                    background: `
                        radial-gradient(circle at 30% 25%, #FEF3C7 0%, transparent 30%),
                        radial-gradient(circle at 70% 75%, #78350F 0%, transparent 40%),
                        radial-gradient(circle, #FBBF24 0%, #D97706 40%, #92400E 80%, #78350F 100%)
                    `,
                    boxShadow: `
                        inset 0 0 40px rgba(255,255,255,0.3),
                        0 0 60px rgba(251,191,36,0.5),
                        0 0 100px rgba(251,191,36,0.3)
                    `
                }}
            >
                {/* Sun Texture (spots) */}
                <div className="absolute inset-0 rounded-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiLz48L3N2Zz4=')]" />

                <div className="text-center z-10">
                    <span className="block text-5xl font-serif font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">ת</span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-100">Tiferet</span>
                </div>
            </div>
        </motion.div>
    );
}
