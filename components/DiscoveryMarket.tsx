
import React, { useEffect, useState } from 'react';
import { MarketItem } from '../types';
import { Backend } from '../services/mockBackend';
import { useLanguage } from '../i18n';
import { ShoppingBag, Search, HardDrive, Cpu, Network, Database, Star } from 'lucide-react';

export const DiscoveryMarket: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<MarketItem[]>([]);

  useEffect(() => {
    Backend.getMarketItems().then(setItems);
  }, []);

  const getIcon = (cat: string) => {
      switch(cat) {
          case 'storage': return <HardDrive className="w-6 h-6 text-blue-400" />;
          case 'compute': return <Cpu className="w-6 h-6 text-amber-400" />;
          case 'network': return <Network className="w-6 h-6 text-emerald-400" />;
          default: return <Database className="w-6 h-6 text-purple-400" />;
      }
  };

  const getLabel = (cat: string) => {
      switch(cat) {
          case 'storage': return t('service_storage');
          case 'compute': return t('service_compute');
          case 'network': return t('service_network');
          default: return t('service_data');
      }
  };

  return (
    <div className="p-6 md:p-8 h-full overflow-y-auto">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{t('discovery_market')}</h2>
            <p className="text-slate-400 text-sm">{t('market_desc')}</p>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-xl">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
             <input 
                type="text" 
                placeholder="Search nodes, services, or public data..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 shadow-xl"
             />
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            {['All', 'storage', 'compute', 'network', 'data'].map(cat => (
                <button key={cat} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm text-slate-300 hover:text-white hover:border-brand-500 whitespace-nowrap capitalize transition-colors">
                    {cat === 'All' ? 'All Services' : getLabel(cat)}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-brand-500/50 transition-all hover:shadow-lg hover:shadow-brand-900/10 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-800 rounded-lg">
                            {getIcon(item.category)}
                        </div>
                        <div className="flex items-center space-x-1 bg-amber-900/20 text-amber-400 px-2 py-1 rounded text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{item.rating}</span>
                        </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 flex-1">{item.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="text-brand-300 font-mono text-sm">{item.price}</div>
                        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-medium transition-colors">
                            {t('hire')}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};