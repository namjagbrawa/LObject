
import React from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { useLanguage } from '../i18n';

export const ChatInterface: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex h-full">
            <div className="w-64 bg-slate-900 border-r border-slate-800 p-4">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-4">Contacts</h3>
                <div className="space-y-2">
                    <div className="p-3 bg-slate-800 rounded-lg cursor-pointer">
                        <div className="font-bold text-white">Alice</div>
                        <div className="text-xs text-slate-400">Online</div>
                    </div>
                    <div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                        <div className="font-bold text-slate-300">Bob</div>
                        <div className="text-xs text-slate-500">Offline</div>
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-slate-950">
                <div className="flex-1 p-6 flex items-center justify-center text-slate-600">
                    <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>{t('select_device_desc')}</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-4">
                    <input type="text" placeholder={t('message_placeholder')} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-500" />
                    <button className="p-2 bg-brand-600 rounded-lg text-white hover:bg-brand-500">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
