
import React, { useEffect, useState } from 'react';
import { 
    Cloud, Cpu, ShieldCheck, Database, MessageSquare, Globe, Plus, Layout, Workflow, Box, User, ShoppingBag, Search, 
    Network, ChevronLeft, ChevronRight, X, Wifi, WifiOff, Loader2, Tags, Grid, Settings, Activity
} from 'lucide-react';
import { ViewState, CustomPage, AppNetworkStatus, SystemModule } from '../types';
import { useLanguage } from '../i18n';
import { Backend } from '../services/mockBackend';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  desktopCollapsed: boolean;
  setDesktopCollapsed: (collapsed: boolean) => void;
  customPages: CustomPage[];
  onSelectCustomPage: (id: string) => void;
  activePageId: string | null;
  onRefreshPages: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  mobileOpen, 
  setMobileOpen,
  desktopCollapsed,
  setDesktopCollapsed,
  customPages,
  onSelectCustomPage,
  activePageId,
  onRefreshPages
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [networkStatus, setNetworkStatus] = useState<AppNetworkStatus>('online');
  const [systemModules, setSystemModules] = useState<SystemModule[]>([]);
  const [userNav, setUserNav] = useState<ViewState[]>([]);

  // Function to load navigation
  const loadNavigation = async () => {
      const [modules, nav] = await Promise.all([
          Backend.getSystemModules(),
          Backend.getUserNavigation()
      ]);
      setSystemModules(modules);
      setUserNav(nav);
  };

  useEffect(() => {
    // Initial fetch
    Backend.getNetworkStatus().then(setNetworkStatus);
    loadNavigation();
    
    // Polling for status updates (e.g. during connecting)
    const interval = setInterval(() => {
        Backend.getNetworkStatus().then(setNetworkStatus);
        // Also poll navigation in case it changed from AppLibrary
        if (currentView === 'APP_LIBRARY') {
            loadNavigation();
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentView]); // Reload nav when view changes (e.g. returning from App Library)

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const handleToggleNetwork = async () => {
    const newStatus = await Backend.toggleNetwork();
    setNetworkStatus(newStatus);
  };

  const handleCreatePage = async () => {
      await Backend.createCustomPage('New Page');
      onRefreshPages();
  };

  // Helper to resolve icon string to Component
  const getIconComponent = (name: string) => {
      switch(name) {
          case 'Box': return Box;
          case 'User': return User;
          case 'ShoppingBag': return ShoppingBag;
          case 'Search': return Search;
          case 'Tags': return Tags;
          case 'MessageSquare': return MessageSquare;
          case 'Cloud': return Cloud;
          case 'Cpu': return Cpu;
          case 'Workflow': return Workflow;
          case 'ShieldCheck': return ShieldCheck;
          case 'Activity': return Activity;
          default: return Grid;
      }
  };

  const NavItem = ({ view, icon: Icon, label, isActive, onClick }: { view?: ViewState; icon: any; label: string, isActive?: boolean, onClick?: () => void }) => (
    <button
      onClick={onClick || (() => view && onChangeView(view))}
      title={desktopCollapsed ? label : undefined}
      className={`w-full flex items-center ${desktopCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg transition-all duration-200 group relative ${
        (view && currentView === view) || isActive
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className={`flex-shrink-0 ${desktopCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${((view && currentView === view) || isActive) ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
      {!desktopCollapsed && <span className="font-medium tracking-wide text-sm whitespace-nowrap truncate">{label}</span>}
      
      {desktopCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">
          {label}
        </div>
      )}
    </button>
  );

  return (
    <>
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out
          md:static
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:shadow-none'}
          ${desktopCollapsed ? 'md:w-20' : 'md:w-64'}
          w-72
        `}
      >
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Header */}
          <div className={`flex items-center ${desktopCollapsed ? 'justify-center px-0' : 'justify-between px-4'} mb-8 mt-4 h-12 shrink-0`}>
            <div className={`flex items-center ${desktopCollapsed ? '' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-md flex items-center justify-center shadow-lg shadow-brand-500/20 flex-shrink-0">
                <Database className="w-5 h-5 text-white" />
              </div>
              {!desktopCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-lg font-bold text-slate-100 tracking-tight whitespace-nowrap">LObject</h1>
                  <p className="text-xs text-brand-500 font-mono whitespace-nowrap">v3.0 Space</p>
                </div>
              )}
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1.5 px-2 md:px-3">
            {!desktopCollapsed && <div className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">{t('workspace')}</div>}
            
            {/* Dynamic Modules from Backend */}
            {userNav.map(viewId => {
                const module = systemModules.find(m => m.id === viewId);
                if (!module) return null;
                const Icon = getIconComponent(module.iconName);
                return (
                    <NavItem 
                        key={viewId} 
                        view={viewId} 
                        icon={Icon} 
                        label={t(module.i18nKey)} 
                    />
                );
            })}

            {/* App Library Button */}
            <div className="my-2 border-t border-slate-800/50"></div>
            <NavItem 
                view="APP_LIBRARY" 
                icon={Grid} 
                label={t('app_library')} 
                isActive={currentView === 'APP_LIBRARY'}
            />
            
            {/* Custom Pages */}
            {!desktopCollapsed && (
              <div className="mt-4 px-2 py-2 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span className="truncate">{t('custom_views')}</span>
                <button onClick={handleCreatePage} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
            {customPages.map(page => (
               <NavItem 
                 key={page.id}
                 icon={Layout} 
                 label={page.name}
                 isActive={currentView === 'CUSTOM_PAGE' && activePageId === page.id}
                 onClick={() => {
                     onChangeView('CUSTOM_PAGE');
                     onSelectCustomPage(page.id);
                 }}
               />
            ))}
            
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-3 shrink-0">
          <button
            onClick={handleToggleNetwork}
            className={`w-full bg-slate-850 rounded-lg border transition-all duration-300 ${
                networkStatus === 'online' ? 'border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30' : 
                networkStatus === 'connecting' ? 'border-amber-500/30 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
            } ${desktopCollapsed ? 'p-2 flex justify-center' : 'p-3'}`}
            title={t('network_status')}
          >
            <div className={`flex items-center ${desktopCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center space-x-2">
                {networkStatus === 'online' && <Wifi className={`w-4 h-4 text-emerald-400 ${desktopCollapsed ? 'w-5 h-5' : ''}`} />}
                {networkStatus === 'offline' && <WifiOff className={`w-4 h-4 text-slate-500 ${desktopCollapsed ? 'w-5 h-5' : ''}`} />}
                {networkStatus === 'connecting' && <Loader2 className={`w-4 h-4 text-amber-400 animate-spin ${desktopCollapsed ? 'w-5 h-5' : ''}`} />}
                
                {!desktopCollapsed && (
                    <span className={`text-xs font-medium ${
                        networkStatus === 'online' ? 'text-emerald-400' : 
                        networkStatus === 'connecting' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                        {networkStatus === 'online' ? t('status_online') : 
                         networkStatus === 'connecting' ? t('status_connecting') : t('status_offline')}
                    </span>
                )}
              </div>
              {!desktopCollapsed && networkStatus === 'online' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              )}
            </div>
          </button>
          
          <button 
            onClick={toggleLanguage}
            className={`w-full flex items-center ${desktopCollapsed ? 'justify-center' : 'justify-start space-x-3 px-3'} py-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors`}
          >
            <Globe className="w-5 h-5" />
            {!desktopCollapsed && <span className="text-xs font-medium">{language === 'en' ? 'English' : '中文'}</span>}
          </button>

          <button 
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {desktopCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};
