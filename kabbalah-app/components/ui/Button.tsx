import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'gold' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    className,
    variant = 'gold',
    size = 'md',
    ...props
}: ButtonProps) {
    const variants = {
        gold: "btn-gold",
        outline: "btn-outline",
        ghost: "hover:bg-white/5 text-secondary transition-colors"
    };

    const sizes = {
        sm: "py-1.5 px-4 text-xs",
        md: "py-3 px-6 text-sm",
        lg: "py-4 px-8 text-base",
    };

    return (
        <button
            className={cn(
                "font-bold rounded-full transition-all flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}

// Simple Utility for class merging if not already present
// (If you don't have this file, create it in lib/utils.ts)
