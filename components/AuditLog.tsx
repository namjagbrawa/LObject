
import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { useLanguage } from '../i18n';

export const AuditLog: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="p-8">
            <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{t('audit_trail')}</h2>
                    <p className="text-slate-400">Security & Access Logs</p>
                </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-800 text-slate-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Timestamp</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        <tr className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono text-xs">2023-10-27 10:42:01</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">READ</span></td>
                            <td className="px-6 py-4">Admin</td>
                            <td className="px-6 py-4">Accessed Root Space</td>
                        </tr>
                        <tr className="hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono text-xs">2023-10-27 09:15:22</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded text-xs">LOGIN</span></td>
                            <td className="px-6 py-4">System</td>
                            <td className="px-6 py-4">Node Online</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
