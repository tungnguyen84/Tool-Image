import React from 'react';

interface SectionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, subtitle, children }) => {
    return (
        <div className="space-y-3">
            <div>
                <h2 className="text-lg font-bold text-slate-100">{title}</h2>
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
            </div>
            {children}
            <hr className="border-t border-[#2e7c7c]/50" />
        </div>
    );
};