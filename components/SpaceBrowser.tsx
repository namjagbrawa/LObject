
import React, { useEffect, useState } from 'react';
import { Space, Resource } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { Lock, Folder, FileText, ArrowLeft, Film, FileCode, Terminal, Key, CheckCircle2, Circle } from 'lucide-react';
import { ItemInspector } from './ItemInspector';
import { ShareModal } from './ShareModal';
import { BulkActionBar } from './BulkActionBar';

export const SpaceBrowser: React.FC = () => {
  const { t } = useLanguage();
  const [currentSpaceId, setCurrentSpaceId] = useState<string>('root');
  const [spaceTree, setSpaceTree] = useState<Space[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<Resource | null>(null);
  
  // Selection & Sharing
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Hidden Space Logic
  const [secretKey, setSecretKey] = useState('');
  const [unlockedSpaceIds, setUnlockedSpaceIds] = useState<Set<string>>(new Set());
  const [terminalMessage, setTerminalMessage] = useState<string>('');

  useEffect(() => {
    loadTree();
  }, []);

  useEffect(() => {
    loadContent(currentSpaceId);
    setSelectedItem(null);
    setSelectedIds(new Set()); // Clear selection on navigation
  }, [currentSpaceId]);

  const loadTree = async () => {
    const tree = await Backend.getSpaceTree();
    setSpaceTree(tree);
  };

  const loadContent = async (id: string) => {
    setLoading(true);
    const content = await Backend.getSpaceContent(id);
    setSpaces(content.spaces);
    setResources(content.resources);
    setLoading(false);
  };

  const currentSpace = spaceTree.find(s => s.id === currentSpaceId);

  const handleEnterSpace = async (space: Space) => {
      setCurrentSpaceId(space.id);
  };

  const handleBack = () => {
      if (currentSpace?.parentId) {
          setCurrentSpaceId(currentSpace.parentId);
      }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id); else newSet.add(id);
    setSelectedIds(newSet);
  };

  // Logic to handle the Secret Key Input
  const handleKeySubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!secretKey.trim()) return;

      const hiddenSpacesInView = spaces.filter(s => s.type === 'hidden');
      let found = false;
      const newUnlocked = new Set(unlockedSpaceIds);

      for (const space of hiddenSpacesInView) {
          const isMatch = await Backend.unlockHiddenSpace(space.id, secretKey);
          if (isMatch) {
              newUnlocked.add(space.id);
              found = true;
          }
      }

      if (found) {
          setUnlockedSpaceIds(newUnlocked);
          setTerminalMessage(t('vault_revealed'));
          setSecretKey('');
          setTimeout(() => setTerminalMessage(''), 3000);
      } else {
          setTerminalMessage(t('vault_scan_complete'));
          setTimeout(() => setTerminalMessage(''), 3000);
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

  const visibleSpaces = spaces.filter(s => s.type !== 'hidden' || unlockedSpaceIds.has(s.id));

  return (
    <div className="flex h-full overflow-hidden relative">
        {/* Main Browser Area */}
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-32 custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        {currentSpace?.name || t('root_space')}
                        {currentSpace?.type === 'hidden' && <Lock className="w-5 h-5 text-amber-500" />}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">{t('space_desc')}</p>
                </div>
                {currentSpace?.parentId && (
                    <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t('back')}</span>
                    </button>
                )}
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="text-slate-500 animate-pulse">{t('loading')}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {/* Spaces (Folders) */}
                    {visibleSpaces.map(space => (
                        <div 
                            key={space.id}
                            onClick={() => handleEnterSpace(space)}
                            className={`
                                p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-brand-500/50 cursor-pointer transition-all group flex flex-col items-center justify-center aspect-square
                                ${space.type === 'hidden' ? 'border-amber-900/30 bg-amber-950/10' : ''}
                            `}
                        >
                            {space.type === 'hidden' ? (
                                <Lock className="w-12 h-12 text-amber-500 mb-3" />
                            ) : (
                                <Folder className="w-12 h-12 mb-3 text-brand-500" />
                            )}
                            <span className="font-medium text-slate-200 text-center truncate w-full">{space.name}</span>
                            <span className="text-xs text-slate-500 mt-1">{space.type === 'hidden' ? t('hidden_space') : 'Space'}</span>
                        </div>
                    ))}

                    {/* Resources (Files) */}
                    {resources.map(res => {
                        const isSelected = selectedIds.has(res.id);
                        const isInspected = selectedItem?.id === res.id;
                        
                        return (
                            <div 
                                key={res.id}
                                onClick={() => setSelectedItem(res)}
                                className={`
                                    p-4 rounded-xl border transition-all flex flex-col relative group cursor-pointer
                                    ${isInspected ? 'border-brand-500 bg-slate-800 ring-1 ring-brand-500' : isSelected ? 'border-brand-500/50 bg-slate-800/80' : 'border-slate-800 bg-slate-900 hover:bg-slate-800'}
                                `}
                            >
                                {/* Selection Checkbox */}
                                <div 
                                    onClick={(e) => { e.stopPropagation(); toggleSelection(res.id); }}
                                    className={`
                                        absolute top-3 left-3 z-20 p-1.5 rounded-full cursor-pointer transition-all
                                        ${isSelected ? 'opacity-100' : 'opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-slate-700/50'}
                                    `}
                                >
                                    {isSelected ? ( 
                                        <CheckCircle2 className="w-5 h-5 text-brand-500 fill-brand-900/20" /> 
                                    ) : ( 
                                        <Circle className="w-5 h-5 text-slate-500 hover:text-slate-200" /> 
                                    )}
                                </div>

                                <div className="mb-4 pl-8">{getIcon(res.type_tag)}</div>
                                <h3 className="font-medium text-slate-200 truncate mb-1" title={res.name}>{res.name}</h3>
                                <div className="text-xs text-slate-500 flex justify-between">
                                    <span>{res.size}</span>
                                    <span>v{res.version}</span>
                                </div>
                            </div>
                        );
                    })}
                    
                    {visibleSpaces.length === 0 && resources.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-600 italic">
                            {t('no_content')}
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Bulk Action Bar */}
        <BulkActionBar 
            selectedCount={selectedIds.size} 
            onClear={() => setSelectedIds(new Set())}
            onShare={() => setIsShareModalOpen(true)}
        />

        {/* Share Modal */}
        <ShareModal 
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            selectedCount={selectedIds.size}
            selectedIds={Array.from(selectedIds)}
            onSuccess={() => setSelectedIds(new Set())}
        />

        {/* Right Inspector Panel */}
        {selectedItem && (
            <ItemInspector 
                item={selectedItem} 
                onClose={() => setSelectedItem(null)} 
            />
        )}

        {/* Floating Secret Key Terminal */}
        <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end">
            {terminalMessage && (
                <div className="mb-2 bg-slate-800 border border-brand-500 text-brand-400 px-3 py-1 rounded-md text-xs font-mono animate-fade-in-up shadow-lg">
                    {`> ${terminalMessage}`}
                </div>
            )}
            <form onSubmit={handleKeySubmit} className="flex items-center bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg overflow-hidden shadow-2xl transition-all focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                <div className="pl-3 pr-2 text-slate-500">
                    <Terminal className="w-4 h-4" />
                </div>
                <input 
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={t('enter_key_placeholder')}
                    className="bg-transparent border-none text-xs text-white placeholder-slate-600 focus:ring-0 py-2.5 w-40 font-mono"
                    autoComplete="off"
                />
                <button type="submit" className="pr-3 pl-2 text-slate-500 hover:text-brand-400 transition-colors">
                    <Key className="w-4 h-4" />
                </button>
            </form>
            <div className="text-[10px] text-slate-600 font-mono mt-1 uppercase tracking-widest">{t('secret_terminal')}</div>
        </div>
    </div>
  );
};
