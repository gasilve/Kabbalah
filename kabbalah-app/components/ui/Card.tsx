import React from 'react';
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
    hover?: boolean;
}

export function Card({
    className,
    glass = true,
    hover = false,
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-3xl p-6 transition-all border",
                glass ? "bg-background-card backdrop-blur-xl border-white/5" : "bg-white/5 border-transparent",
                hover && "hover:bg-white/10 hover:border-primary/30 hover:shadow-gold/10",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn("font-serif text-xl font-bold leading-none tracking-tight text-primary", className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("", className)} {...props}>{children}</div>;
}
