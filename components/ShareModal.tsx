
import React, { useEffect, useState } from 'react';
import { Peer } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { X, Smartphone, Monitor, Share2, CheckCircle2, Loader2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  selectedIds: string[];
  onSuccess: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, selectedCount, selectedIds, onSuccess }) => {
  const { t } = useLanguage();
  const [availablePeers, setAvailablePeers] = useState<Peer[]>([]);
  const [sharingStatus, setSharingStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useEffect(() => {
    if (isOpen) {
        Backend.getPeers().then(setAvailablePeers);
        setSharingStatus('idle');
    }
  }, [isOpen]);

  const handleShareToPeer = async (peer: Peer) => {
      setSharingStatus('sending');
      await Backend.shareResources(peer.id, selectedIds);
      setSharingStatus('success');
      setTimeout(() => {
          onSuccess();
          onClose();
      }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">{t('share_modal_title', {count: selectedCount})}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {sharingStatus === 'sending' ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-300 font-medium">{t('establishing_tunnel')}</p>
                    <p className="text-xs text-slate-500 mt-2">{t('encrypting_payload')}</p>
                </div>
            ) : sharingStatus === 'success' ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-white font-bold text-lg">{t('sent_successfully')}</p>
                </div>
            ) : (
                <>
                    <p className="text-sm text-slate-400 mb-4">{t('select_peer_desc')}</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                        {availablePeers.length === 0 && (
                            <div className="text-center py-8 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                                No active peers found.
                            </div>
                        )}
                        {availablePeers.map(peer => (
                            <button 
                                key={peer.id}
                                onClick={() => handleShareToPeer(peer)}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-brand-500/50 transition-all group text-left"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 bg-slate-800 group-hover:bg-slate-700 rounded-lg text-slate-400 group-hover:text-white transition-colors">
                                        {peer.deviceType === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-200 text-sm">{peer.name}</div>
                                        <div className="flex items-center space-x-1.5 mt-0.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${peer.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            <span className="text-[10px] text-slate-500 capitalize">{peer.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <Share2 className="w-4 h-4 text-slate-600 group-hover:text-brand-400" />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    </div>
  );
};
