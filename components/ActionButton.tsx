import React from 'react';

interface ActionButtonProps {
    text: string;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ text, isActive = false, onClick, disabled = false }) => {
    const baseClasses = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1f5f5f]";
    const inactiveClasses = "bg-[#154949] text-slate-200 hover:bg-[#2e7c7c]";
    const activeClasses = "bg-amber-400 text-slate-900 font-semibold ring-2 ring-amber-300";
    const disabledClasses = "bg-slate-600/50 text-slate-400 cursor-not-allowed";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${disabled ? disabledClasses : (isActive ? activeClasses : inactiveClasses)}`}
        >
            {text}
        </button>
    );
};