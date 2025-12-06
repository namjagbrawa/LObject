
import React, { useState, useEffect } from 'react';
import { CustomPage, WidgetConfig, WidgetType, Resource } from '../types';
import { Backend } from '../services/mockBackend';
import { Edit2, Eye, Plus, Trash2, Save, Move, Type, List, BarChart, PlayCircle, Settings } from 'lucide-react';
import { useLanguage } from '../i18n';

interface Props {
  pageId: string;
  onDeletePage: () => void;
}

export const CustomPageRenderer: React.FC<Props> = ({ pageId, onDeletePage }) => {
  const { t } = useLanguage();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Widget Data Cache
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    loadPage();
    loadResources();
  }, [pageId]);

  const loadPage = async () => {
    setLoading(true);
    const pages = await Backend.getCustomPages();
    const found = pages.find(p => p.id === pageId);
    setPage(found || null);
    setLoading(false);
  };

  const loadResources = async () => {
      const res = await Backend.getResources();
      setResources(res);
  };

  const savePage = async () => {
    if (page) {
      await Backend.updateCustomPage(page);
      setEditMode(false);
    }
  };

  const handleDeletePage = async () => {
    if (confirm(t('confirm_delete'))) {
        await Backend.deleteCustomPage(pageId);
        onDeletePage();
    }
  };

  const addWidget = (type: WidgetType) => {
    if (!page) return;
    const newWidget: WidgetConfig = {
      id: `w-${Date.now()}`,
      type,
      title: 'New Widget',
      width: 'half'
    };
    setPage({ ...page, widgets: [...page.widgets, newWidget] });
  };

  const removeWidget = (id: string) => {
    if (!page) return;
    setPage({ ...page, widgets: page.widgets.filter(w => w.id !== id) });
  };

  const updateWidget = (id: string, updates: Partial<WidgetConfig>) => {
    if (!page) return;
    setPage({
        ...page,
        widgets: page.widgets.map(w => w.id === id ? { ...w, ...updates } : w)
    });
  };

  const renderWidgetContent = (widget: WidgetConfig) => {
    switch (widget.type) {
        case 'text':
            return (
                <div className="prose prose-invert prose-sm max-w-none">
                    {widget.content ? (
                        <div dangerouslySetInnerHTML={{ __html: widget.content.replace(/\n/g, '<br/>') }} /> // Simple line break support for now
                    ) : <p className="text-slate-500 italic">{t('markdown_placeholder')}</p>}
                </div>
            );
        case 'resource_list':
            const filtered = resources.filter(r => 
                !widget.filterTags || widget.filterTags.length === 0 || 
                widget.filterTags.some(tag => r.tags.includes(tag))
            );
            return (
                <div className="space-y-2">
                    {filtered.length === 0 && <p className="text-xs text-slate-500">{t('no_resources')}</p>}
                    {filtered.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-2 bg-slate-950/50 rounded border border-slate-800 text-sm">
                            <span className="truncate flex-1">{r.name}</span>
                            <span className="text-xs text-slate-500 ml-2">{r.size}</span>
                        </div>
                    ))}
                </div>
            );
        case 'stats':
            const count = resources.filter(r => 
                !widget.filterTags || widget.filterTags.length === 0 || 
                widget.filterTags.some(tag => r.tags.includes(tag))
            ).length;
            return (
                <div className="flex items-center justify-center h-24">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-brand-400">{count}</div>
                        <div className="text-xs text-slate-500 uppercase">{t('items_count')}</div>
                    </div>
                </div>
            );
        case 'action_button':
            return (
                <div className="flex items-center justify-center h-16">
                    <button 
                        onClick={() => alert(`Running Rhai script: ${widget.targetAction || 'Default'}`)}
                        className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-brand-900/40"
                    >
                        <PlayCircle className="w-5 h-5" />
                        <span>{t('run_action')}</span>
                    </button>
                </div>
            );
        default:
            return null;
    }
  };

  if (loading) return <div className="p-8 text-slate-500">{t('loading')}</div>;
  if (!page) return <div className="p-8 text-red-500">Page not found</div>;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-950">
        {/* Header */}
        <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900 shrink-0">
            {editMode ? (
                <input 
                    type="text" 
                    value={page.name} 
                    onChange={(e) => setPage({ ...page, name: e.target.value })}
                    className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-lg font-bold text-white focus:outline-none focus:border-brand-500"
                    placeholder={t('page_title_placeholder')}
                />
            ) : (
                <h2 className="text-xl font-bold text-white">{page.name}</h2>
            )}
            
            <div className="flex items-center space-x-3">
                {editMode ? (
                    <>
                        <button onClick={handleDeletePage} className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors" title={t('delete_page')}>
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button onClick={savePage} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-sm transition-colors">
                            <Save className="w-4 h-4" />
                            <span>{t('save')}</span>
                        </button>
                    </>
                ) : (
                    <button onClick={() => setEditMode(true)} className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded text-sm transition-colors">
                        <Edit2 className="w-4 h-4" />
                        <span>{t('page_edit_mode')}</span>
                    </button>
                )}
            </div>
        </div>

        {/* Toolbar (Edit Mode Only) */}
        {editMode && (
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex space-x-4 overflow-x-auto">
                <button onClick={() => addWidget('text')} className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 border border-slate-700">
                    <Type className="w-4 h-4 text-blue-400" />
                    <span>{t('widget_text')}</span>
                </button>
                <button onClick={() => addWidget('resource_list')} className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 border border-slate-700">
                    <List className="w-4 h-4 text-emerald-400" />
                    <span>{t('widget_list')}</span>
                </button>
                <button onClick={() => addWidget('stats')} className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 border border-slate-700">
                    <BarChart className="w-4 h-4 text-amber-400" />
                    <span>{t('widget_stats')}</span>
                </button>
                <button onClick={() => addWidget('action_button')} className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 border border-slate-700">
                    <PlayCircle className="w-4 h-4 text-rose-400" />
                    <span>{t('widget_action')}</span>
                </button>
            </div>
        )}

        {/* Grid Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                {page.widgets.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                        <div className="mb-4 p-4 bg-slate-900 rounded-full">
                            <Settings className="w-8 h-8 text-slate-700" />
                        </div>
                        <p>{t('no_widgets')}</p>
                    </div>
                )}
                
                {page.widgets.map(widget => {
                    const colSpan = widget.width === 'full' ? 'md:col-span-6' : widget.width === 'half' ? 'md:col-span-3' : 'md:col-span-2';
                    return (
                        <div key={widget.id} className={`${colSpan} bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-lg`}>
                            {/* Widget Header */}
                            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/30 rounded-t-xl">
                                {editMode ? (
                                    <input 
                                        type="text" 
                                        value={widget.title} 
                                        onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                                        className="bg-transparent text-sm font-semibold text-slate-200 focus:outline-none border-b border-transparent focus:border-brand-500"
                                    />
                                ) : (
                                    <h3 className="font-semibold text-slate-200 text-sm">{widget.title}</h3>
                                )}
                                
                                {editMode && (
                                    <div className="flex items-center space-x-2">
                                        <select 
                                            value={widget.width}
                                            onChange={(e) => updateWidget(widget.id, { width: e.target.value as any })}
                                            className="bg-slate-950 text-xs border border-slate-700 rounded px-1 py-0.5 text-slate-400 focus:outline-none"
                                        >
                                            <option value="third">{t('third')}</option>
                                            <option value="half">{t('half')}</option>
                                            <option value="full">{t('full')}</option>
                                        </select>
                                        <button onClick={() => removeWidget(widget.id)} className="text-slate-500 hover:text-red-400">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Widget Body */}
                            <div className="p-4 flex-1">
                                {renderWidgetContent(widget)}
                            </div>

                            {/* Widget Config Form (Edit Mode Only) */}
                            {editMode && (
                                <div className="p-3 border-t border-slate-800 bg-slate-950/30 space-y-2">
                                    {(widget.type === 'text') && (
                                        <textarea 
                                            value={widget.content || ''}
                                            onChange={(e) => updateWidget(widget.id, { content: e.target.value })}
                                            placeholder={t('widget_content')}
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500 h-20"
                                        />
                                    )}
                                    {(widget.type === 'resource_list' || widget.type === 'stats') && (
                                        <input 
                                            type="text"
                                            value={widget.filterTags?.join(', ') || ''}
                                            onChange={(e) => updateWidget(widget.id, { filterTags: e.target.value.split(',').map(s => s.trim()) })}
                                            placeholder={t('widget_tags')}
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                                        />
                                    )}
                                    {(widget.type === 'action_button') && (
                                        <input 
                                            type="text"
                                            value={widget.targetAction || ''}
                                            onChange={(e) => updateWidget(widget.id, { targetAction: e.target.value })}
                                            placeholder={t('widget_action_target')}
                                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};