
import React, { useState, useEffect } from 'react';
import { Facet, Tag, Resource } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { Tags, Plus, Trash2, ChevronRight, Folder, FolderOpen, Hash, Edit2, Save, X } from 'lucide-react';

export const TagTaxonomy: React.FC = () => {
  const { t } = useLanguage();
  const [facets, setFacets] = useState<Facet[]>([]);
  const [selectedFacetId, setSelectedFacetId] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit States
  const [isEditingFacet, setIsEditingFacet] = useState(false);
  const [newFacetName, setNewFacetName] = useState('');
  const [newFacetCode, setNewFacetCode] = useState('');
  const [newFacetMulti, setNewFacetMulti] = useState(false);

  // Tag Create State
  const [creatingTagParentId, setCreatingTagParentId] = useState<string | null>(null); // null = root
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    loadFacets();
  }, []);

  useEffect(() => {
    if (selectedFacetId) {
        loadTags(selectedFacetId);
    } else {
        setTags([]);
    }
  }, [selectedFacetId]);

  const loadFacets = async () => {
    setLoading(true);
    const data = await Backend.getFacets();
    setFacets(data);
    if (data.length > 0 && !selectedFacetId) {
        setSelectedFacetId(data[0].id);
    }
    setLoading(false);
  };

  const loadTags = async (facetId: string) => {
      const data = await Backend.getTags(facetId);
      setTags(data);
  };

  // --- Facet Actions ---
  const handleAddFacet = async () => {
      if (!newFacetName || !newFacetCode) return;
      const newFacet: Facet = {
          id: `f-${Date.now()}`,
          name: newFacetName,
          code: newFacetCode,
          isMultiSelect: newFacetMulti
      };
      await Backend.saveFacet(newFacet);
      setFacets([...facets, newFacet]);
      setSelectedFacetId(newFacet.id);
      setIsEditingFacet(false);
      setNewFacetName('');
      setNewFacetCode('');
  };

  const handleDeleteFacet = async (id: string) => {
      if (!confirm(t('confirm_delete'))) return;
      await Backend.deleteFacet(id);
      const remaining = facets.filter(f => f.id !== id);
      setFacets(remaining);
      setSelectedFacetId(remaining[0]?.id || null);
  };

  // --- Tag Actions ---
  const handleAddTag = async () => {
      if (!selectedFacetId || !newTagName) return;
      const newTag: Tag = {
          id: `t-${Date.now()}`,
          facetId: selectedFacetId,
          parentId: creatingTagParentId,
          name: newTagName,
          path: '', // Backend handles path generation
          level: 0
      };
      await Backend.saveTag(newTag);
      await loadTags(selectedFacetId);
      setIsCreatingTag(false);
      setNewTagName('');
  };

  const handleDeleteTag = async (id: string) => {
      if (!confirm(t('confirm_delete'))) return;
      await Backend.deleteTag(id);
      if (selectedFacetId) loadTags(selectedFacetId);
  };

  // --- Recursive Render ---
  const renderTagTree = (parentId: string | null, level: number = 0) => {
      const children = tags.filter(t => t.parentId === parentId);
      if (children.length === 0 && parentId !== null) return null;

      return (
          <div className={`space-y-1 ${level > 0 ? 'ml-6 border-l border-slate-800 pl-2' : ''}`}>
              {children.map(tag => (
                  <div key={tag.id}>
                      <div className="flex items-center justify-between group py-1 pr-2 rounded hover:bg-slate-900">
                          <div className="flex items-center space-x-2">
                              <Hash className="w-3 h-3 text-slate-500" />
                              <span className="text-sm text-slate-300">{tag.name}</span>
                              <span className="text-[10px] text-slate-600 font-mono hidden group-hover:inline-block">{tag.path}</span>
                          </div>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setCreatingTagParentId(tag.id); setIsCreatingTag(true); }}
                                className="p-1 text-slate-400 hover:text-brand-400" 
                                title={t('add_sub_tag')}
                              >
                                  <Plus className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => handleDeleteTag(tag.id)}
                                className="p-1 text-slate-400 hover:text-red-400"
                              >
                                  <Trash2 className="w-3 h-3" />
                              </button>
                          </div>
                      </div>
                      {renderTagTree(tag.id, level + 1)}
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
        {/* Left: Facets (Dimensions) */}
        <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <div className="flex items-center space-x-2">
                    <Tags className="w-5 h-5 text-brand-500" />
                    <span className="font-bold text-white">{t('facets')}</span>
                </div>
                <button 
                    onClick={() => setIsEditingFacet(true)} 
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Facet List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {facets.map(facet => (
                    <button
                        key={facet.id}
                        onClick={() => setSelectedFacetId(facet.id)}
                        className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between group transition-all ${selectedFacetId === facet.id ? 'bg-brand-600/20 border border-brand-500/50 text-brand-100' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
                    >
                        <div>
                            <div className="font-medium text-sm">{facet.name}</div>
                            <div className="text-[10px] opacity-60 font-mono">{facet.code}</div>
                        </div>
                        {selectedFacetId === facet.id ? (
                            <ChevronRight className="w-4 h-4 text-brand-400" />
                        ) : (
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteFacet(facet.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        )}
                    </button>
                ))}
            </div>
            
            {/* New Facet Form */}
            {isEditingFacet && (
                <div className="p-4 border-t border-slate-800 bg-slate-900 absolute bottom-0 left-0 w-72 shadow-2xl z-10">
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase">{t('add_facet')}</h4>
                        <input 
                            placeholder={t('facet_name')}
                            value={newFacetName}
                            onChange={(e) => setNewFacetName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:border-brand-500 focus:outline-none"
                            autoFocus
                        />
                        <input 
                            placeholder={t('facet_code')}
                            value={newFacetCode}
                            onChange={(e) => setNewFacetCode(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:border-brand-500 focus:outline-none font-mono"
                        />
                        <label className="flex items-center space-x-2">
                            <input 
                                type="checkbox"
                                checked={newFacetMulti}
                                onChange={(e) => setNewFacetMulti(e.target.checked)}
                                className="rounded bg-slate-800 border-slate-600 text-brand-600 focus:ring-0"
                            />
                            <span className="text-xs text-slate-400">{t('multi_select')}</span>
                        </label>
                        <div className="flex space-x-2 pt-2">
                            <button onClick={handleAddFacet} className="flex-1 bg-brand-600 hover:bg-brand-500 text-white py-1.5 rounded text-xs font-medium">{t('save')}</button>
                            <button onClick={() => setIsEditingFacet(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded text-xs font-medium">{t('back')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Right: Tag Tree */}
        <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
            {selectedFacetId ? (
                <>
                    <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50">
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                            <FolderOpen className="w-4 h-4" />
                            <span>{facets.find(f => f.id === selectedFacetId)?.name}</span>
                            <span className="text-slate-600">/</span>
                            <span className="text-slate-200">{t('tags_tree')}</span>
                        </div>
                        <button 
                            onClick={() => { setCreatingTagParentId(null); setIsCreatingTag(true); }}
                            className="flex items-center space-x-1.5 bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 hover:text-brand-300 px-3 py-1.5 rounded-lg text-sm border border-brand-500/20 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>{t('add_root_tag')}</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {tags.length === 0 ? (
                            <div className="text-center py-12 text-slate-600">
                                <Tags className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>{t('no_content')}</p>
                            </div>
                        ) : (
                            renderTagTree(null)
                        )}
                    </div>

                    {/* New Tag Modal / Overlay */}
                    {isCreatingTag && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-80 shadow-2xl">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    {creatingTagParentId ? t('add_sub_tag') : t('add_root_tag')}
                                </h3>
                                <input 
                                    placeholder={t('tag_name')}
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white focus:border-brand-500 focus:outline-none mb-6"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                />
                                <div className="flex space-x-3">
                                    <button onClick={() => setIsCreatingTag(false)} className="flex-1 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                                        Cancel
                                    </button>
                                    <button onClick={handleAddTag} className="flex-1 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors">
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                    <Tags className="w-16 h-16 mb-4 text-slate-800" />
                    <p>{t('select_facet_first')}</p>
                </div>
            )}
        </div>
    </div>
  );
};
