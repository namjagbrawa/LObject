
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResourceGrid } from './components/ResourceGrid';
import { CloudManager } from './components/CloudManager';
import { AutomationStudio } from './components/AutomationStudio';
import { AuditLog } from './components/AuditLog';
import { ChatInterface } from './components/ChatInterface';
import { CustomPageRenderer } from './components/CustomPageRenderer';
import { SchemaDesigner } from './components/SchemaDesigner';
import { SpaceBrowser } from './components/SpaceBrowser';
import { IdentityHub } from './components/IdentityHub';
import { DiscoveryMarket } from './components/DiscoveryMarket';
import { TagTaxonomy } from './components/TagTaxonomy';
import { AppLibrary } from './components/AppLibrary';
import { SystemStatus } from './components/SystemStatus';
import { ViewState, CustomPage } from './types';
import { Backend } from './services/mockBackend';
import { Menu, Database } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('SPACES'); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);

  useEffect(() => {
    loadCustomPages();
  }, []);

  const loadCustomPages = async () => {
    const pages = await Backend.getCustomPages();
    setCustomPages(pages);
  };

  const handlePageDelete = async () => {
      await loadCustomPages();
      setCurrentView('SPACES');
      setActivePageId(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'SPACES':
        return <SpaceBrowser />;
      case 'IDENTITY':
        return <IdentityHub />;
      case 'MARKET':
        return <DiscoveryMarket />;
      case 'RESOURCES':
        return <ResourceGrid />;
      case 'TAG_TAXONOMY':
        return <TagTaxonomy />;
      case 'CLOUD':
        return <CloudManager />;
      case 'AUTOMATION':
        return <AutomationStudio />;
      case 'AUDIT':
        return <AuditLog />;
      case 'CHAT':
        return <ChatInterface />;
      case 'SCHEMA_DESIGNER':
        return <SchemaDesigner />;
      case 'APP_LIBRARY':
        return <AppLibrary />;
      case 'SYSTEM_STATUS':
        return <SystemStatus />;
      case 'CUSTOM_PAGE':
        return activePageId ? (
            <CustomPageRenderer 
                key={activePageId} 
                pageId={activePageId} 
                onDeletePage={handlePageDelete} 
            /> 
        ) : <div className="p-8 text-slate-500">Select a page</div>;
      default:
        return <SpaceBrowser />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-brand-500/30 selection:text-brand-200">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          setCurrentView(view);
          setActivePageId(null);
          setIsMobileMenuOpen(false);
        }}
        mobileOpen={isMobileMenuOpen}
        setMobileOpen={setIsMobileMenuOpen}
        desktopCollapsed={isDesktopCollapsed}
        setDesktopCollapsed={setIsDesktopCollapsed}
        customPages={customPages}
        activePageId={activePageId}
        onSelectCustomPage={(id) => {
            setActivePageId(id);
            setIsMobileMenuOpen(false);
        }}
        onRefreshPages={loadCustomPages}
      />

      <main 
        className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 relative w-full"
        role="main"
        aria-label="Workspace Content"
      >
        <div className="md:hidden h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4 flex-shrink-0 z-30">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-md flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Database className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-slate-100 tracking-tight">LObject</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        <div className="relative z-10 w-full h-full flex-1 overflow-hidden">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
