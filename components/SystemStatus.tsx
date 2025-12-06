
import React, { useEffect, useState } from 'react';
import { Activity, Server, Hash, Database, Wifi, Clock, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { Backend } from '../services/mockBackend';
import { Resource, AppNetworkStatus, Peer, IdentityProfile, Tag } from '../types';
import { useLanguage } from '../i18n';

export const SystemStatus: React.FC = () => {
    const { t } = useLanguage();
    const [resources, setResources] = useState<Resource[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [status, setStatus] = useState<AppNetworkStatus>('online');
    const [identity, setIdentity] = useState<IdentityProfile | null>(null);
    const [peers, setPeers] = useState<Peer[]>([]);
    const [loading, setLoading] = useState(true);

    // Derived stats
    const [tagFrequency, setTagFrequency] = useState<Record<string, number>>({});
    const [activePeerCount, setActivePeerCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [resData, tagData, statusData, idData, peerData] = await Promise.all([
                Backend.getResources(),
                Backend.getTags('f-1'), // Fetching from first facet primarily, but we'll manually aggregate raw tags
                Backend.getNetworkStatus(),
                Backend.getIdentityProfile(),
                Backend.getPeers()
            ]);
            
            // Need all active tags from all facets actually, but simplistic check on resources.tags (strings)
            // is better for "Usage Heatmap"
            
            setResources(resData);
            setStatus(statusData);
            setIdentity(idData);
            setPeers(peerData);
            setActivePeerCount(peerData.filter(p => p.status === 'online').length);
            setTags(tagData); // Used for total structured count
            
            // Calculate Usage
            const freq: Record<string, number> = {};
            resData.forEach(r => {
                r.tags.forEach(tag => {
                    freq[tag] = (freq[tag] || 0) + 1;
                });
            });
            setTagFrequency(freq);
            
            setLoading(false);
        };
        fetchData();
    }, []);

    // Helper to get color intensity based on frequency
    const getTagIntensity = (count: number, max: number) => {
        const ratio = count / (max || 1);
        if (ratio > 0.8) return 'bg-brand-500 text-white';
        if (ratio > 0.5) return 'bg-brand-600/60 text-brand-100';
        if (ratio > 0.2) return 'bg-slate-700 text-slate-300';
        return 'bg-slate-800 text-slate-400';
    };

    const maxFreq = Math.max(...Object.values(tagFrequency), 1);

    if (loading) return <div className="p-8 text-slate-500">{t('loading')}</div>;

    return (
        <div className="p-6 md:p-8 h-full overflow-y-auto">
            {/* Header */}
            <div className="mb-8 flex items-center space-x-4">
                <div className="p-3 bg-brand-500/10 rounded-xl">
                    <Activity className="w-8 h-8 text-brand-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{t('system_status')}</h2>
                    <p className="text-slate-400">{t('system_status_desc')}</p>
                </div>
            </div>

            {/* Top Grid: Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Network Status Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                     <div className="relative z-10">
                         <div className="text-slate-400 text-xs uppercase font-bold mb-1">{t('network_status')}</div>
                         <div className={`text-xl font-bold flex items-center gap-2 ${status === 'online' ? 'text-emerald-400' : 'text-slate-400'}`}>
                             {status === 'online' ? t('status_online') : t('status_offline')}
                         </div>
                     </div>
                     <div className={`p-3 rounded-full ${status === 'online' ? 'bg-emerald-900/20' : 'bg-slate-800'}`}>
                         <Wifi className={`w-6 h-6 ${status === 'online' ? 'text-emerald-500' : 'text-slate-500'}`} />
                     </div>
                </div>

                {/* Resource Count */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                         <div className="text-slate-400 text-xs uppercase font-bold mb-1">{t('item_count')}</div>
                         <div className="text-2xl font-bold text-white">{resources.length}</div>
                     </div>
                     <div className="p-3 bg-brand-900/20 rounded-full">
                         <Database className="w-6 h-6 text-brand-500" />
                     </div>
                </div>

                {/* Active Peers */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                         <div className="text-slate-400 text-xs uppercase font-bold mb-1">{t('active_peers')}</div>
                         <div className="text-2xl font-bold text-white">{activePeerCount} <span className="text-sm font-normal text-slate-500">/ {peers.length}</span></div>
                     </div>
                     <div className="p-3 bg-indigo-900/20 rounded-full">
                         <Users className="w-6 h-6 text-indigo-500" />
                     </div>
                </div>

                {/* Total Tags (Unique strings) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
                     <div>
                         <div className="text-slate-400 text-xs uppercase font-bold mb-1">{t('tag_count')}</div>
                         <div className="text-2xl font-bold text-white">{Object.keys(tagFrequency).length}</div>
                     </div>
                     <div className="p-3 bg-amber-900/20 rounded-full">
                         <Hash className="w-6 h-6 text-amber-500" />
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Network Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Server className="w-5 h-5 text-slate-400" />
                            {t('connection_details')}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase font-bold block mb-1">{t('peer_id')}</label>
                                <div className="font-mono text-xs text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800 break-all">
                                    {identity?.publicKey || 'Unknown'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">{t('uptime')}</label>
                                    <div className="flex items-center gap-2 text-slate-200">
                                        <Clock className="w-4 h-4 text-slate-500" />
                                        <span>3d 12h 45m</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Protocol</label>
                                    <div className="text-slate-200">Iroh / QUIC</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                        <ArrowUp className="w-3 h-3" /> {t('bytes_sent')}
                                    </span>
                                    <span className="text-lg font-mono text-slate-300">1.2 GB</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                        <ArrowDown className="w-3 h-3" /> {t('bytes_received')}
                                    </span>
                                    <span className="text-lg font-mono text-slate-300">4.8 GB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tag Heatmap */}
                <div className="lg:col-span-2">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-slate-400" />
                            {t('tag_heatmap')}
                        </h3>
                        
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(tagFrequency)
                                .sort(([,a], [,b]) => b - a) // Sort by frequency desc
                                .map(([tag, count]) => (
                                <div 
                                    key={tag}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 cursor-default flex items-center gap-2 ${getTagIntensity(count, maxFreq)}`}
                                >
                                    <span>#{tag}</span>
                                    <span className="text-[10px] opacity-70 bg-black/20 px-1.5 rounded-full">{count}</span>
                                </div>
                            ))}
                            
                            {Object.keys(tagFrequency).length === 0 && (
                                <div className="text-slate-500 italic w-full text-center py-12">
                                    No tags found on resources.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
