
import React, { useEffect, useState } from 'react';
import { SystemModule, ViewState } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { 
    Box, User, ShoppingBag, Search, Tags, MessageSquare, 
    Cloud, Cpu, Workflow, ShieldCheck, Grid, Plus, Trash2, ArrowUp, ArrowDown, Check
} from 'lucide-react';

export const AppLibrary: React.FC = () => {
    const { t } = useLanguage();
    const [allModules, setAllModules] = useState<SystemModule[]>([]);
    const [installedIds, setInstalledIds] = useState<ViewState[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [modules, nav] = await Promise.all([
            Backend.getSystemModules(),
            Backend.getUserNavigation()
        ]);
        setAllModules(modules);
        setInstalledIds(nav);
        setLoading(false);
    };

    const handleInstall = async (id: ViewState) => {
        const newOrder = [...installedIds, id];
        await Backend.updateUserNavigation(newOrder);
        setInstalledIds(newOrder);
    };

    const handleUninstall = async (id: ViewState) => {
        const newOrder = installedIds.filter(itemId => itemId !== id);
        await Backend.updateUserNavigation(newOrder);
        setInstalledIds(newOrder);
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        const newOrder = [...installedIds];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newOrder.length) return;
        
        // Swap
        [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
        
        await Backend.updateUserNavigation(newOrder);
        setInstalledIds(newOrder);
    };

    // Helper to resolve icon
    const getIcon = (name: string) => {
        switch(name) {
            case 'Box': return Box;
            case 'User': return User;
            case 'ShoppingBag': return ShoppingBag;
            case 'Search': return Search;
            case 'Tags': return Tags;
            case 'MessageSquare': return MessageSquare;
            case 'Cloud': return Cloud;
            case 'Cpu': return Cpu;
            case 'Workflow': return Workflow;
            case 'ShieldCheck': return ShieldCheck;
            default: return Grid;
        }
    };

    if (loading) return <div className="p-8 text-slate-500">{t('loading')}</div>;

    // Filter Logic
    const installedModules = installedIds
        .map(id => allModules.find(m => m.id === id))
        .filter(Boolean) as SystemModule[];
    
    const availableModules = allModules.filter(m => !installedIds.includes(m.id));

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto bg-slate-950">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Grid className="w-8 h-8 text-brand-500" />
                    {t('app_library')}
                </h2>
                <p className="text-slate-400 mt-2">{t('app_library_desc')}</p>
            </div>

            {/* Installed Apps Section */}
            <div className="mb-12">
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    {t('installed_apps')}
                </h3>
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    {installedModules.map((module, index) => {
                        const Icon = getIcon(module.iconName);
                        return (
                            <div key={module.id} className="p-4 border-b border-slate-800 last:border-0 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-800 rounded-lg">
                                        <Icon className="w-5 h-5 text-slate-300" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-200">{t(module.i18nKey)}</div>
                                        <div className="text-xs text-slate-500">{t(module.descKey)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleMove(index, 'up')} 
                                        disabled={index === 0}
                                        className="p-2 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                                        title={t('move_up')}
                                    >
                                        <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleMove(index, 'down')} 
                                        disabled={index === installedModules.length - 1}
                                        className="p-2 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30"
                                        title={t('move_down')}
                                    >
                                        <ArrowDown className="w-4 h-4" />
                                    </button>
                                    {!module.isFixed && (
                                        <button 
                                            onClick={() => handleUninstall(module.id)} 
                                            className="ml-2 p-2 hover:bg-red-900/30 text-slate-500 hover:text-red-400 rounded transition-colors"
                                            title={t('remove_from_sidebar')}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Available Apps Section */}
            <div>
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-500" />
                    {t('available_apps')}
                </h3>
                {availableModules.length === 0 ? (
                    <div className="text-slate-500 italic p-4 border border-slate-800 rounded-lg text-center">
                        All available modules are currently installed.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableModules.map(module => {
                            const Icon = getIcon(module.iconName);
                            return (
                                <div key={module.id} className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex flex-col hover:border-brand-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-slate-800 rounded-lg">
                                            <Icon className="w-6 h-6 text-brand-400" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider border border-slate-700 px-2 py-0.5 rounded-full">
                                            {t(`app_category_${module.category}` as any)}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-white mb-1">{t(module.i18nKey)}</h4>
                                    <p className="text-sm text-slate-400 mb-4 flex-1">{t(module.descKey)}</p>
                                    <button 
                                        onClick={() => handleInstall(module.id)}
                                        className="w-full py-2 bg-slate-800 hover:bg-brand-600 hover:text-white text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {t('add_to_sidebar')}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};