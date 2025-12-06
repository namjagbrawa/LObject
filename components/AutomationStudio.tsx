
import React from 'react';
import { Cpu, Play } from 'lucide-react';
import { useLanguage } from '../i18n';

export const AutomationStudio: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="p-8 flex flex-col h-full">
            <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-indigo-500/10 rounded-lg">
                    <Cpu className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{t('automation')}</h2>
                    <p className="text-slate-400">{t('automation_subtitle')}</p>
                </div>
            </div>
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                <div className="bg-slate-800 px-4 py-2 text-xs font-mono text-slate-400 flex justify-between items-center">
                    <span>main.rhai</span>
                    <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300">
                        <Play className="w-3 h-3" />
                        <span>{t('run')}</span>
                    </button>
                </div>
                <textarea 
                    className="flex-1 bg-slate-950 p-4 font-mono text-sm text-slate-300 focus:outline-none resize-none"
                    defaultValue={`// Welcome to LObject Automation
fn process_item(item) {
    print("Processing: " + item.name);
    if item.size > 1024 {
        item.tags.push("large_file");
    }
    return item;
}`}
                ></textarea>
            </div>
        </div>
    );
};
