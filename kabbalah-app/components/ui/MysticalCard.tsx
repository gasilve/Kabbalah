import React from 'react';

interface MysticalCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    onClick?: () => void;
}

export function MysticalCard({ children, className = '', hoverEffect = true, onClick }: MysticalCardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        relative overflow-hidden rounded-xl
        bg-background-surface/30 backdrop-blur-md
        border border-accent-gold/20
        transition-all duration-300 ease-out
        ${hoverEffect ? 'hover:border-accent-gold/60 hover:shadow-[0_0_15px_rgba(255,215,0,0.15)] hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 p-6">
                {children}
            </div>
        </div>
    );
}
