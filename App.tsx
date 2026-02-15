
import React, { useState } from 'react';
import { Page, AppSettings } from './types';
import { DEFAULT_APP_SETTINGS } from './constants';
import AssistantView from './components/AssistantView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';

const Sidebar: React.FC<{ currentPage: Page; setPage: (p: Page) => void }> = ({ currentPage, setPage }) => {
  const navItems = [
    { id: Page.HOME, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
    ), label: 'Assistant' },
    { id: Page.HISTORY, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    ), label: 'History' },
    { id: Page.TOOLS, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
    ), label: 'Tools' },
    { id: Page.SETTINGS, icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ), label: 'Settings' },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col items-center md:items-stretch h-full py-8 px-4">
      <div className="mb-12 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight">Nova AI</span>
      </div>

      <nav className="flex-1 space-y-4">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentPage === item.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            {item.icon}
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto md:p-4 bg-slate-800/40 rounded-2xl border border-slate-700 hidden md:block">
        <p className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Plan</p>
        <p className="text-sm font-bold text-slate-200">Pro Lifetime</p>
        <div className="mt-3 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-sky-500 w-[65%]" />
        </div>
        <p className="text-[10px] text-slate-500 mt-2">6.5GB / 10GB Shared Memory</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <AssistantView settings={settings} />;
      case Page.HISTORY: return <HistoryView />;
      case Page.SETTINGS: return <SettingsView settings={settings} onUpdate={setSettings} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
          <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <p className="text-lg">Module Coming Soon</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 selection:bg-sky-500/30">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold capitalize">{currentPage}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full border border-slate-950" />
            </button>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200">Jane Doe</p>
                <p className="text-[10px] text-sky-400 font-medium tracking-tighter uppercase">Verified Pro</p>
              </div>
              <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-950" alt="Profile" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
