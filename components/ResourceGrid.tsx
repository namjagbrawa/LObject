
import React, { useEffect, useState } from 'react';
import { Resource, SecurityLevel } from '../types';
import { Backend } from '../services/mockBackend';
import { FileText, Film, Lock, Share2, HardDrive, Cloud, Server, FileCode, Search, CheckCircle2, Circle, Filter } from 'lucide-react';
import { useLanguage } from '../i18n';
import { ItemInspector } from './ItemInspector';
import { ShareModal } from './ShareModal';
import { BulkActionBar } from './BulkActionBar';

export const ResourceGrid: React.FC = () => {
  const { t } = useLanguage();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Selection State (for Bulk Actions)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Inspection State (for Single Item View)
  const [inspectingItem, setInspectingItem] = useState<Resource | null>(null);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await Backend.getResources();
    setResources(data);
    setLoading(false);
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedIds(newSet);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Film className="w-8 h-8 text-rose-400" />;
      case 'doc': return <FileText className="w-8 h-8 text-blue-400" />;
      case 'script': return <FileCode className="w-8 h-8 text-yellow-400" />;
      default: return <FileText className="w-8 h-8 text-slate-400" />;
    }
  };

  const getLocationBadge = (resource: Resource) => {
    if (resource.location === 'Local') {
      return <span className="flex items-center space-x-1 text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700"><HardDrive className="w-3 h-3"/> <span>{t('local')}</span></span>;
    }
    if (resource.location === 'IrohBlob') {
        return <span className="flex items-center space-x-1 text-[10px] bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800"><Server className="w-3 h-3"/> <span>{t('p2p')}</span></span>;
    }
    if (resource.location === 'CloudRef') {
        return <span className="flex items-center space-x-1 text-[10px] bg-sky-900/50 text-sky-300 px-2 py-0.5 rounded-full border border-sky-800"><Cloud className="w-3 h-3"/> <span>{resource.cloudProvider}</span></span>;
    }
  };

  const filteredResources = resources.filter(r => 
    (searchTerm === '' || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedTags.length === 0 || selectedTags.every(t => r.tags.includes(t)))
  );

  const allTags = Array.from(new Set(resources.flatMap(r => r.tags)));

  if (loading) return <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">{t('loading')}</div>;

  return (
    <div className="flex h-full w-full overflow-hidden relative bg-slate-950">
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden relative z-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 flex-shrink-0 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{t('resources')}</h2>
                    <p className="text-slate-400 text-xs md:text-sm">{t('resources_desc')}</p>
                </div>
                <div className="flex space-x-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder={t('search_query')}
                            className="bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 w-full md:w-64 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-nowrap overflow-x-auto gap-2 mb-6 flex-shrink-0 pb-2 md:pb-0 custom-scrollbar items-center">
                <Filter className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                {allTags.map(tag => (
                    <button 
                        key={tag}
                        onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors whitespace-nowrap ${selectedTags.includes(tag) ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                        #{tag}
                    </button>
                ))}
            </div>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-32 pr-2 custom-scrollbar content-start">
                {filteredResources.map((resource) => {
                    const isSelected = selectedIds.has(resource.id);
                    const isInspected = inspectingItem?.id === resource.id;

                    return (
                        <div 
                            key={resource.id} 
                            onClick={() => setInspectingItem(resource)}
                            className={`
                                bg-slate-900 border rounded-xl p-5 transition-all group relative cursor-pointer select-none
                                ${isInspected ? 'border-brand-500 bg-slate-800 ring-1 ring-brand-500' : isSelected ? 'border-brand-500/50 bg-slate-800/80' : 'border-slate-800 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/10'}
                            `}
                        >
                            {/* Selection Checkbox */}
                            <div 
                                onClick={(e) => { e.stopPropagation(); toggleSelection(resource.id); }}
                                className={`
                                    absolute top-3 left-3 z-20 p-2 rounded-full cursor-pointer transition-all
                                    ${isSelected ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-slate-700/50'}
                                `}
                            >
                                {isSelected ? ( 
                                    <CheckCircle2 className="w-6 h-6 text-brand-500 fill-brand-900/20" /> 
                                ) : ( 
                                    <Circle className="w-6 h-6 text-slate-500 hover:text-slate-200" /> 
                                )}
                            </div>

                            <div className="absolute top-4 right-4" title={`Encryption: ${resource.encryption_level}`}>
                                <Lock className={`w-4 h-4 ${resource.encryption_level === SecurityLevel.High ? 'text-amber-400' : 'text-slate-600'}`} />
                            </div>
                            
                            <div className="mb-4 pl-10 pt-1">{getIcon(resource.type_tag)}</div>
                            <h3 className="text-slate-100 font-semibold truncate mb-1" title={resource.name}>{resource.name}</h3>
                            <div className="flex items-center justify-between mt-2 mb-4">
                                {getLocationBadge(resource)}
                                <span className="text-xs text-slate-500 font-mono">{resource.size}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {resource.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">#{tag}</span>
                                ))}
                            </div>
                            
                            {/* Quick Action Footer */}
                            <div className="flex items-center justify-end pt-3 border-t border-slate-800 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    className="text-slate-400 hover:text-brand-400 p-1.5 hover:bg-slate-800 rounded transition-colors" 
                                    title={t('share_via_iroh')} 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        const newSet = new Set(selectedIds);
                                        newSet.add(resource.id);
                                        setSelectedIds(newSet);
                                        setIsShareModalOpen(true); 
                                    }}
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
             {/* Bulk Action Bar */}
            <BulkActionBar 
                selectedCount={selectedIds.size} 
                onClear={() => setSelectedIds(new Set())}
                onShare={() => setIsShareModalOpen(true)}
            />
        </div>

        {/* Right Inspector Panel */}
        {inspectingItem && (
            <ItemInspector 
                item={inspectingItem}
                onClose={() => setInspectingItem(null)}
            />
        )}

        {/* Share Modal */}
        <ShareModal 
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            selectedCount={selectedIds.size}
            selectedIds={Array.from(selectedIds)}
            onSuccess={() => setSelectedIds(new Set())}
        />
    </div>
  );
};
