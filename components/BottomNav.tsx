import React from 'react';
import { Activity, PlusCircle, Table as TableIcon, Settings } from 'lucide-react';
import { translations } from '../utils/i18n';
import { Language } from '../types';

interface BottomNavProps {
    activeTab: 'overview' | 'log' | 'spreadsheet' | 'settings';
    onTabChange: (tab: 'overview' | 'log' | 'spreadsheet' | 'settings') => void;
    lang: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, lang }) => {
    const t = translations[lang].dashboard;

    const tabs = [
        { id: 'overview', label: t.overview, icon: Activity },
        { id: 'log', label: t.log, icon: PlusCircle },
        { id: 'spreadsheet', label: t.spreadsheet, icon: TableIcon },
        { id: 'settings', label: t.settings, icon: Settings }
    ] as const;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <nav className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-lg px-6 py-3 flex items-center gap-2 sm:gap-6">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center justify-center min-w-[60px] transition-all duration-200 ${isActive
                                    ? 'text-emerald-600 scale-110 font-medium'
                                    : 'text-gray-400 hover:text-gray-600 hover:scale-105'
                                }`}
                        >
                            <tab.icon
                                className={`h-6 w-6 mb-1 ${isActive ? 'fill-current opacity-20 stroke-2' : 'stroke-1.5'}`}
                            />
                            <span className="text-[10px] uppercase tracking-wide">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default BottomNav;
