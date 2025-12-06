
import React from 'react';
import { Share2, X } from 'lucide-react';
import { useLanguage } from '../i18n';

interface BulkActionBarProps {
    selectedCount: number;
    onClear: () => void;
    onShare: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, onClear, onShare }) => {
    const { t } = useLanguage();

    return (
        <div className={`
            absolute bottom-8 left-1/2 -translate-x-1/2 
            bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-full px-6 py-3 shadow-2xl 
            flex items-center space-x-6 z-40 transition-all duration-300 transform
            ${selectedCount > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-95 pointer-events-none'}
        `}>
            <div className="flex items-center space-x-3 border-r border-slate-700 pr-6">
                <div className="bg-brand-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-brand-500/30">
                    {selectedCount}
                </div>
                <span className="text-slate-200 text-sm font-medium tracking-wide">{t('selected')}</span>
            </div>
            
            <button 
                onClick={onClear}
                className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center space-x-1"
            >
                <span>{t('clear')}</span>
            </button>
            
            <div className="h-4 w-px bg-slate-700"></div>
            
            <button 
                onClick={onShare}
                className="flex items-center space-x-2 text-brand-400 hover:text-brand-300 font-bold text-sm transition-colors group"
            >
                <Share2 className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>{t('share_to_device')}</span>
            </button>
        </div>
    );
};
