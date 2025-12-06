
import React from 'react';
import { Cloud, Check, X } from 'lucide-react';
import { useLanguage } from '../i18n';

export const CloudManager: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="p-8 text-center text-slate-500">
            <Cloud className="w-16 h-16 mx-auto mb-4 text-slate-700" />
            <h2 className="text-xl font-bold text-white mb-2">{t('cloud_fabric')}</h2>
            <p>{t('cloud_integration_desc')}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['OneDrive', 'Google Drive', 'AWS S3'].map(provider => (
                    <div key={provider} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                        <span className="font-medium text-slate-300">{provider}</span>
                        <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-400">Connect</button>
                    </div>
                ))}
            </div>
        </div>
    );
};
