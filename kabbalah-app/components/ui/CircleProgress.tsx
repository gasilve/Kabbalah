import React from 'react';

interface CircleProgressProps {
    progress: number;
    level: number;
    label?: string;
}

export function CircleProgress({ progress, level, label = "Lvl" }: CircleProgressProps) {
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                    className="text-white/5"
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                />
                <circle
                    className="text-primary drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] transition-all duration-1000 ease-out"
                    cx="18"
                    cy="18"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${circumference}, ${circumference}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    strokeWidth="2.5"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                <span className="text-[0.6rem] text-secondary-muted font-bold uppercase tracking-wider leading-none">{label}</span>
                <span className="text-2xl font-display font-bold text-white leading-none">{level}</span>
            </div>
        </div>
    );
}
