
import React, { useState, useEffect } from 'react';
import { ItemSchema, SchemaField, SchemaFieldType, SchemaMethod, SchemaPipeline } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { Plus, Trash2, Save, FileType, Code, GitMerge, ChevronRight, Play, Box, X } from 'lucide-react';

export const SchemaDesigner: React.FC = () => {
  const { t } = useLanguage();
  const [schemas, setSchemas] = useState<ItemSchema[]>([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fields' | 'methods' | 'pipelines'>('fields');
  const [loading, setLoading] = useState(true);

  // Load Schemas
  useEffect(() => {
    loadSchemas();
  }, []);

  const loadSchemas = async () => {
    setLoading(true);
    const data = await Backend.getSchemas();
    setSchemas(data);
    if (data.length > 0 && !selectedSchemaId) {
        setSelectedSchemaId(data[0].id);
    }
    setLoading(false);
  };

  const selectedSchema = schemas.find(s => s.id === selectedSchemaId);

  // -- CRUD Actions --

  const handleCreateSchema = async () => {
      const newSchema: ItemSchema = {
          id: `schema-${Date.now()}`,
          name: t('new_type_default'),
          description: '',
          fields: [],
          methods: [],
          pipelines: []
      };
      await Backend.saveSchema(newSchema);
      setSchemas([...schemas, newSchema]);
      setSelectedSchemaId(newSchema.id);
  };

  const handleDeleteSchema = async (id: string) => {
      if (!confirm(t('confirm_delete'))) return;
      await Backend.deleteSchema(id);
      const remaining = schemas.filter(s => s.id !== id);
      setSchemas(remaining);
      if (selectedSchemaId === id) {
          setSelectedSchemaId(remaining[0]?.id || null);
      }
  };

  const updateSchema = async (updated: ItemSchema) => {
      setSchemas(schemas.map(s => s.id === updated.id ? updated : s));
      // Debounce save in real app
      await Backend.saveSchema(updated);
  };

  // -- Field Helpers --
  const addField = () => {
      if (!selectedSchema) return;
      const newField: SchemaField = {
          id: `f-${Date.now()}`,
          name: t('new_field_default'),
          type: 'Text',
          required: false
      };
      updateSchema({ ...selectedSchema, fields: [...selectedSchema.fields, newField] });
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
      if (!selectedSchema) return;
      updateSchema({
          ...selectedSchema,
          fields: selectedSchema.fields.map(f => f.id === id ? { ...f, ...updates } : f)
      });
  };

  const deleteField = (id: string) => {
      if (!selectedSchema) return;
      updateSchema({
          ...selectedSchema,
          fields: selectedSchema.fields.filter(f => f.id !== id)
      });
  };

  // -- Method Helpers --
  const addMethod = () => {
      if (!selectedSchema) return;
      const newMethod: SchemaMethod = {
          id: `m-${Date.now()}`,
          name: t('new_method_default'),
          code: 'fn new_method(item) {\n  return item;\n}'
      };
      updateSchema({ ...selectedSchema, methods: [...selectedSchema.methods, newMethod] });
  };

  const updateMethod = (id: string, updates: Partial<SchemaMethod>) => {
      if (!selectedSchema) return;
      updateSchema({
          ...selectedSchema,
          methods: selectedSchema.methods.map(m => m.id === id ? { ...m, ...updates } : m)
      });
  };

  const deleteMethod = (id: string) => {
      if (!selectedSchema) return;
      updateSchema({
          ...selectedSchema,
          methods: selectedSchema.methods.filter(m => m.id !== id)
      });
  };

  // -- Pipeline Helpers --
  const addPipeline = () => {
      if (!selectedSchema) return;
      const newPipeline: SchemaPipeline = {
          id: `p-${Date.now()}`,
          name: t('new_pipeline_default'),
          steps: []
      };
      updateSchema({ ...selectedSchema, pipelines: [...selectedSchema.pipelines, newPipeline] });
  };

  const updatePipeline = (id: string, updates: Partial<SchemaPipeline>) => {
      if (!selectedSchema) return;
      updateSchema({
          ...selectedSchema,
          pipelines: selectedSchema.pipelines.map(p => p.id === id ? { ...p, ...updates } : p)
      });
  };

  const deletePipeline = (id: string) => {
      if (!selectedSchema) return;
      updateSchema({
          ...selectedSchema,
          pipelines: selectedSchema.pipelines.filter(p => p.id !== id)
      });
  };

  const addPipelineStep = (pipelineId: string, methodId: string) => {
      if (!selectedSchema) return;
      const pipeline = selectedSchema.pipelines.find(p => p.id === pipelineId);
      if (!pipeline) return;
      updatePipeline(pipelineId, { steps: [...pipeline.steps, methodId] });
  };

  const removePipelineStep = (pipelineId: string, index: number) => {
      if (!selectedSchema) return;
      const pipeline = selectedSchema.pipelines.find(p => p.id === pipelineId);
      if (!pipeline) return;
      const newSteps = [...pipeline.steps];
      newSteps.splice(index, 1);
      updatePipeline(pipelineId, { steps: newSteps });
  };

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
        {/* Left Sidebar: Type List */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-100">{t('schema_types')}</span>
                <button onClick={handleCreateSchema} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors" title={t('add_type')}>
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {schemas.map(schema => (
                    <button
                        key={schema.id}
                        onClick={() => setSelectedSchemaId(schema.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group ${selectedSchemaId === schema.id ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <span className="truncate">{schema.name}</span>
                        <ChevronRight className={`w-3 h-3 ${selectedSchemaId === schema.id ? 'text-white' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                    </button>
                ))}
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            {selectedSchema ? (
                <>
                    {/* Header */}
                    <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900 shrink-0">
                        <div className="flex-1 mr-8">
                             <input 
                                type="text" 
                                value={selectedSchema.name} 
                                onChange={(e) => updateSchema({ ...selectedSchema, name: e.target.value })}
                                className="bg-transparent text-xl font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-500 w-full mb-1"
                             />
                             <input 
                                type="text"
                                value={selectedSchema.description}
                                onChange={(e) => updateSchema({ ...selectedSchema, description: e.target.value })}
                                placeholder={t('schema_desc_placeholder')}
                                className="bg-transparent text-xs text-slate-500 focus:outline-none w-full"
                             />
                        </div>
                        <button onClick={() => handleDeleteSchema(selectedSchema.id)} className="text-slate-500 hover:text-red-400 p-2">
                             <Trash2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 pt-4 border-b border-slate-800 flex space-x-6">
                        <button onClick={() => setActiveTab('fields')} className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${activeTab === 'fields' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                            <FileType className="w-4 h-4" />
                            <span>{t('fields')}</span>
                        </button>
                        <button onClick={() => setActiveTab('methods')} className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${activeTab === 'methods' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                            <Code className="w-4 h-4" />
                            <span>{t('methods')}</span>
                        </button>
                        <button onClick={() => setActiveTab('pipelines')} className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center space-x-2 ${activeTab === 'pipelines' ? 'border-brand-500 text-brand-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                            <GitMerge className="w-4 h-4" />
                            <span>{t('pipelines')}</span>
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                        
                        {/* FIELDS TAB */}
                        {activeTab === 'fields' && (
                            <div className="max-w-4xl mx-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">{t('fields')}</h3>
                                    <button onClick={addField} className="flex items-center space-x-1 text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors">
                                        <Plus className="w-4 h-4" />
                                        <span>{t('add_field')}</span>
                                    </button>
                                </div>
                                <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-800 text-slate-400 text-xs uppercase font-semibold">
                                            <tr>
                                                <th className="px-4 py-3">{t('field_name')}</th>
                                                <th className="px-4 py-3">{t('field_type')}</th>
                                                <th className="px-4 py-3 text-center">{t('required')}</th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {selectedSchema.fields.map(field => (
                                                <tr key={field.id} className="hover:bg-slate-800/50">
                                                    <td className="px-4 py-2">
                                                        <input 
                                                            value={field.name}
                                                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                                                            className="bg-transparent border border-transparent hover:border-slate-700 focus:border-brand-500 rounded px-2 py-1 w-full text-slate-200 focus:outline-none"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <select
                                                            value={field.type}
                                                            onChange={(e) => updateField(field.id, { type: e.target.value as SchemaFieldType })}
                                                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:outline-none"
                                                        >
                                                            <option value="Text">{t('field_type_text')}</option>
                                                            <option value="Number">{t('field_type_number')}</option>
                                                            <option value="Boolean">{t('field_type_boolean')}</option>
                                                            <option value="Date">{t('field_type_date')}</option>
                                                            <option value="Reference">{t('field_type_reference')}</option>
                                                            <option value="File">{t('field_type_file')}</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <input 
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                            className="rounded bg-slate-700 border-slate-600 text-brand-600 focus:ring-0"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <button onClick={() => deleteField(field.id)} className="text-slate-500 hover:text-red-400 p-1">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* METHODS TAB */}
                        {activeTab === 'methods' && (
                            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-1 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-white">{t('methods')}</h3>
                                        <button onClick={addMethod} className="p-1 hover:bg-slate-800 rounded text-brand-400 hover:text-white" title={t('add_method')}>
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {selectedSchema.methods.map(method => (
                                            <div key={method.id} className="bg-slate-900 border border-slate-800 rounded-lg p-3 group hover:border-brand-500/50 transition-colors">
                                                <div className="flex justify-between items-center mb-2">
                                                    <input 
                                                        value={method.name}
                                                        onChange={(e) => updateMethod(method.id, { name: e.target.value })}
                                                        className="bg-transparent font-mono text-sm text-brand-300 font-bold focus:outline-none w-full"
                                                    />
                                                    <button onClick={() => deleteMethod(method.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="text-xs text-slate-500 truncate">fn {method.name}(item)</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="bg-slate-900 border border-slate-800 rounded-lg h-full flex flex-col min-h-[400px]">
                                        <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 text-xs text-slate-400 font-mono">
                                            {selectedSchema.methods.length > 0 ? t('method_code_label') : t('no_steps')}
                                        </div>
                                        <div className="flex-1 p-0 relative">
                                            {selectedSchema.methods.length > 0 ? (
                                                <textarea 
                                                    value={selectedSchema.methods[0].code} 
                                                    onChange={(e) => updateMethod(selectedSchema.methods[0].id, { code: e.target.value })}
                                                    className="w-full h-full bg-slate-950 text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none"
                                                    spellCheck={false}
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-600 italic">
                                                    {t('no_steps')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PIPELINES TAB */}
                        {activeTab === 'pipelines' && (
                            <div className="max-w-4xl mx-auto space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-white">{t('pipelines')}</h3>
                                    <button onClick={addPipeline} className="flex items-center space-x-1 text-sm bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded transition-colors">
                                        <Plus className="w-4 h-4" />
                                        <span>{t('add_pipeline')}</span>
                                    </button>
                                </div>

                                {selectedSchema.pipelines.map(pipeline => (
                                    <div key={pipeline.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex-1">
                                                <input 
                                                    value={pipeline.name}
                                                    onChange={(e) => updatePipeline(pipeline.id, { name: e.target.value })}
                                                    className="bg-transparent text-lg font-bold text-white focus:outline-none border-b border-transparent focus:border-brand-500"
                                                    placeholder={t('pipeline_name')}
                                                />
                                            </div>
                                            <button onClick={() => deletePipeline(pipeline.id)} className="text-slate-500 hover:text-red-400">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-2 overflow-x-auto pb-4">
                                            {/* Start Node */}
                                            <div className="flex-shrink-0 flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                                                    <Box className="w-5 h-5" />
                                                </div>
                                                <div className="h-0.5 w-8 bg-slate-700"></div>
                                            </div>

                                            {/* Steps */}
                                            {pipeline.steps.map((stepId, index) => {
                                                const method = selectedSchema.methods.find(m => m.id === stepId);
                                                return (
                                                    <div key={`${stepId}-${index}`} className="flex-shrink-0 flex items-center group relative">
                                                        <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 flex flex-col items-center min-w-[120px]">
                                                            <span className="text-xs text-brand-400 font-mono font-bold mb-1">{method?.name || t('unknown')}</span>
                                                            <span className="text-[10px] text-slate-500">{t('function_label')}</span>
                                                            
                                                            <button 
                                                                onClick={() => removePipelineStep(pipeline.id, index)}
                                                                className="absolute -top-2 -right-2 bg-slate-800 border border-slate-600 rounded-full p-0.5 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <div className="h-0.5 w-8 bg-slate-700">
                                                            <ChevronRight className="w-4 h-4 text-slate-600 mx-auto -mt-2" />
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Add Step Button */}
                                            <div className="flex-shrink-0 relative group">
                                                <button className="w-10 h-10 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 hover:border-brand-500 flex items-center justify-center text-slate-500 hover:text-brand-400 transition-colors">
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                                
                                                {/* Dropdown for adding step */}
                                                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                    <div className="py-1">
                                                        {selectedSchema.methods.length === 0 && <div className="px-4 py-2 text-xs text-slate-500">{t('no_steps')}</div>}
                                                        {selectedSchema.methods.map(method => (
                                                            <button
                                                                key={method.id}
                                                                onClick={() => addPipelineStep(pipeline.id, method.id)}
                                                                className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                                            >
                                                                {method.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                    <Box className="w-16 h-16 mb-4 text-slate-700" />
                    <h3 className="text-xl font-bold text-slate-300 mb-2">{t('no_schemas')}</h3>
                    <p>{t('add_type')}</p>
                </div>
            )}
        </div>
    </div>
  );
};