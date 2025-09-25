import React from 'react';

interface TabsProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-[#2e7c7c]/50">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
                            transition-colors duration-200 focus:outline-none
                            ${
                                activeTab === tab
                                    ? 'border-amber-400 text-amber-300'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                            }
                        `}
                        aria-current={activeTab === tab ? 'page' : undefined}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};