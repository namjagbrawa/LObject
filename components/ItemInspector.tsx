
import React, { useEffect, useState } from 'react';
import { Resource, ItemView, ItemAction } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { X, Play, Loader2, CheckCircle2, AlertCircle, FileText, Film, FileCode, History } from 'lucide-react';

interface ItemInspectorProps {
    item: Resource;
    onClose: () => void;
}

export const ItemInspector: React.FC<ItemInspectorProps> = ({ item, onClose }) => {
    const { t } = useLanguage();
    
    // State
    const [availableViews, setAvailableViews] = useState<ItemView[]>([]);
    const [currentViewId, setCurrentViewId] = useState<string>('v-preview');
    const [availableActions, setAvailableActions] = useState<ItemAction[]>([]);
    const [actionStates, setActionStates] = useState<Record<string, 'idle' | 'running' | 'success' | 'error'>>({});

    useEffect(() => {
        // Load Views
        Backend.getItemViews(item).then(views => {
            setAvailableViews(views);
            if (views.length > 0) setCurrentViewId(views[0].id);
        });

        // Load Actions
        Backend.getItemActions(item).then(setAvailableActions);
        
        // Reset action states
        setActionStates({});
    }, [item]);

    const handleRunAction = async (actionId: string) => {
        setActionStates(prev => ({ ...prev, [actionId]: 'running' }));
        try {
            await Backend.runItemAction(item.id, actionId);
            setActionStates(prev => ({ ...prev, [actionId]: 'success' }));
        } catch (e) {
            setActionStates(prev => ({ ...prev, [actionId]: 'error' }));
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'video': return <Film className="w-8 h-8 text-rose-400" />;
            case 'doc': return <FileText className="w-8 h-8 text-blue-400" />;
            case 'script': return <FileCode className="w-8 h-8 text-yellow-400" />;
            default: return <FileText className="w-8 h-8 text-slate-400" />;
        }
    };

    const activeViewType = availableViews.find(v => v.id === currentViewId)?.type || 'preview';

    return (
        <div className="
            w-96 border-l border-slate-800 bg-slate-900 flex flex-col shrink-0
            fixed inset-y-0 right-0 z-30 shadow-2xl
            lg:relative lg:z-0 lg:shadow-none
        ">
            {/* Inspector Header */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-slate-800 rounded-xl">
                            {getIcon(item.type_tag)}
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-white break-all">{item.name}</h3>
                            <span className="text-xs text-slate-400 uppercase">{item.type_tag}</span>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* View Selector */}
                {availableViews.length > 0 && (
                    <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg">
                        {availableViews.map(view => (
                            <button
                                key={view.id}
                                onClick={() => setCurrentViewId(view.id)}
                                className={`flex-1 text-xs py-1.5 rounded transition-colors ${currentViewId === view.id ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                            >
                                {t(view.type === 'preview' ? 'view_preview' : view.type === 'json' ? 'view_json' : view.type === 'metadata' ? 'view_metadata' : 'view_editor')}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Inspector Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Dynamic View Rendering */}
                {activeViewType === 'preview' && (
                    <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">{t('attributes')}</h4>
                            <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Size</span>
                                <span className="text-slate-200">{item.size}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Location</span>
                                <span className="text-slate-200">{item.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Encryption</span>
                                <span className="text-emerald-400">{item.encryption_level}</span>
                            </div>
                            </div>
                            
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-3 border-b border-slate-800 pb-2 flex items-center gap-2">
                            <History className="w-3 h-3" />
                            {t('version_history')}
                            </h4>
                            <div className="space-y-3">
                            {item.versions?.map(v => (
                                <div key={v.version} className="flex items-center justify-between text-sm p-2 bg-slate-800/50 rounded group">
                                    <div>
                                        <div className="text-slate-300">v{v.version}</div>
                                        <div className="text-xs text-slate-500">{v.date}</div>
                                    </div>
                                </div>
                            ))}
                            </div>
                    </div>
                )}

                {activeViewType === 'json' && (
                    <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto border border-slate-800 custom-scrollbar">
                        <pre>{JSON.stringify(item, null, 2)}</pre>
                    </div>
                )}

                {activeViewType === 'metadata' && (
                        <div className="space-y-2">
                            {Object.entries(item).map(([k, v]) => (
                                typeof v !== 'object' && (
                                    <div key={k} className="flex flex-col border-b border-slate-800 pb-1">
                                        <span className="text-[10px] text-slate-500 uppercase">{k}</span>
                                        <span className="text-sm text-slate-300 truncate">{String(v)}</span>
                                    </div>
                                )
                            ))}
                        </div>
                )}

                {activeViewType === 'editor' && (
                    <div className="h-full flex flex-col">
                            <div className="bg-slate-950 p-2 border border-slate-800 rounded-t-lg text-xs text-slate-500 font-mono">
                                Read-only Mode
                            </div>
                            <textarea 
                            className="flex-1 bg-slate-950 border border-slate-800 border-t-0 rounded-b-lg p-3 font-mono text-xs text-slate-300 focus:outline-none resize-none h-64"
                            value={`// Script: ${item.name}\n\nfn main() {\n    print("Hello from LObject!");\n    // ... execution logic ...\n}`}
                            readOnly
                            />
                    </div>
                )}
                
                {/* Actions Section */}
                {availableActions.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2 flex items-center gap-2">
                            <Play className="w-3 h-3" />
                            {t('inspector_actions')}
                        </h4>
                        <div className="space-y-3">
                            {availableActions.map(action => {
                                const state = actionStates[action.id] || 'idle';
                                return (
                                    <div key={action.id} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-200 text-sm">{action.name}</span>
                                            <span className="text-[10px] text-slate-500 uppercase">{action.type}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleRunAction(action.id)}
                                            disabled={state === 'running'}
                                            className={`
                                                p-2 rounded-full transition-all
                                                ${state === 'idle' ? 'bg-brand-600 hover:bg-brand-500 text-white' : ''}
                                                ${state === 'running' ? 'bg-slate-700 text-slate-400 cursor-wait' : ''}
                                                ${state === 'success' ? 'bg-emerald-600 text-white' : ''}
                                                ${state === 'error' ? 'bg-red-600 text-white' : ''}
                                            `}
                                            title={t('run_action')}
                                        >
                                            {state === 'idle' && <Play className="w-4 h-4" />}
                                            {state === 'running' && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {state === 'success' && <CheckCircle2 className="w-4 h-4" />}
                                            {state === 'error' && <AlertCircle className="w-4 h-4" />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
