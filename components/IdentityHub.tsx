
import React, { useEffect, useState } from 'react';
import { IdentityProfile, Peer } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { User, Smartphone, Server, Monitor, ShieldAlert, Key, Save, Activity } from 'lucide-react';

export const IdentityHub: React.FC = () => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<IdentityProfile | null>(null);
  const [nodes, setNodes] = useState<Peer[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'devices' | 'inheritance'>('profile');

  useEffect(() => {
    Backend.getIdentityProfile().then(setProfile);
    Backend.getPeers().then(setNodes);
  }, []);

  if (!profile) return <div>{t('loading')}</div>;

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-2xl">
                {profile.name.charAt(0)}
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <div className="flex items-center space-x-2 text-slate-400 text-sm font-mono mt-1">
                    <Key className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{profile.publicKey}</span>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 mb-8 w-fit">
            {(['profile', 'devices', 'inheritance'] as const).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    {t(tab === 'profile' ? 'profile' : tab === 'devices' ? 'devices' : 'inheritance')}
                </button>
            ))}
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-4">{t('profile')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Display Name</label>
                            <input disabled value={profile.name} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-300" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-bold block mb-1">DID (Decentralized ID)</label>
                            <input disabled value={`did:lobject:${profile.id}`} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-300 font-mono text-xs" />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'devices' && (
            <div className="space-y-4">
                {nodes.map(node => (
                    <div key={node.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                {node.deviceType === 'mobile' ? <Smartphone className="w-6 h-6 text-slate-400" /> : 
                                 node.deviceType === 'server' ? <Server className="w-6 h-6 text-slate-400" /> : 
                                 <Monitor className="w-6 h-6 text-slate-400" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">{node.name}</h4>
                                <div className="text-xs text-slate-500 font-mono">{node.publicKey.substring(0, 16)}...</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                             <div className={`w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                             <span className="text-sm text-slate-400 capitalize">{node.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'inheritance' && (
            <div className="max-w-2xl">
                <div className={`p-6 rounded-xl border mb-6 ${profile.inheritance.enabled ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <ShieldAlert className={`w-8 h-8 ${profile.inheritance.enabled ? 'text-emerald-500' : 'text-slate-500'}`} />
                            <div>
                                <h3 className="text-lg font-bold text-white">{t('dead_man_switch')}</h3>
                                <p className="text-sm text-slate-400 mt-1">{profile.inheritance.enabled ? t('inheritance_enabled') : t('inheritance_disabled')}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={profile.inheritance.enabled} className="sr-only peer" onChange={() => {}} />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>
                </div>

                <div className="space-y-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
                     <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">{t('trigger_condition')}</label>
                        <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-300">
                            <option value="inactivity">{t('inactivity_days')}</option>
                            <option value="manual">Manual Trigger</option>
                        </select>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">{t('inactivity_days')}</label>
                            <div className="relative">
                                <input type="number" defaultValue={profile.inheritance.inactivityPeriodDays} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-300 pl-10" />
                                <Activity className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            </div>
                         </div>
                         <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">{t('beneficiary')}</label>
                            <div className="relative">
                                <input type="text" defaultValue={profile.inheritance.beneficiaryId} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-300 pl-10 font-mono text-sm" />
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            </div>
                         </div>
                     </div>

                     <button className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white py-2 rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                        <span>{t('save_settings')}</span>
                     </button>
                </div>
            </div>
        )}
    </div>
  );
};