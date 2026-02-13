import React, { useState, useEffect } from 'react';
import { FinancialItem } from './types';
import { INITIAL_DATA } from './constants';
import Dashboard from './components/Dashboard';
import FinancialList from './components/FinancialList';
import DataEntry from './components/DataEntry';
import AIChat from './components/AIChat';
import { CreditCard, LayoutDashboard, List, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<FinancialItem[]>(() => {
    const saved = localStorage.getItem('finmind_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'ai'>('dashboard');

  useEffect(() => {
    localStorage.setItem('finmind_data', JSON.stringify(items));
  }, [items]);

  const handleAddItem = (newItem: FinancialItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleImportJson = (newItems: FinancialItem[]) => {
    setItems(prev => [...newItems, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col sticky top-0 h-auto md:h-screen z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <CreditCard size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">FinMind</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-x-auto md:overflow-visible flex md:block">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <List size={20} /> Manage Items
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <MessageSquare size={20} /> AI Assistant
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center md:text-left">
          <p>© 2024 FinMind AI.</p>
          <p className="mt-1">Secure & Local Storage</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
        <header className="mb-8 flex justify-between items-center">
            <div>
                 <h2 className="text-2xl font-bold text-white mb-1">
                    {activeTab === 'dashboard' && 'Financial Overview'}
                    {activeTab === 'list' && 'Manage Finances'}
                    {activeTab === 'ai' && 'AI Financial Assistant'}
                 </h2>
                 <p className="text-slate-400 text-sm">Welcome back, check your reminders.</p>
            </div>
        </header>

        <div className="max-w-6xl mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard items={items} />
          )}

          {activeTab === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-1">
                  <DataEntry onAddItem={handleAddItem} onImportJson={handleImportJson} />
               </div>
               <div className="lg:col-span-2">
                  <FinancialList items={items} onDelete={handleDeleteItem} />
               </div>
            </div>
          )}

          {activeTab === 'ai' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AIChat items={items} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6">
                        <h4 className="font-semibold text-indigo-200 mb-2">Voice Mode Tips</h4>
                        <p className="text-sm text-indigo-300 leading-relaxed">
                            Turn on <strong>Voice Mode</strong> to hear natural spoken summaries. 
                            <br/><br/>
                            Try asking:
                            <ul className="list-disc ml-4 mt-2 space-y-1">
                                <li>"What are my today reminders?"</li>
                                <li>"Give me a summary of my loans."</li>
                                <li>"Do I have any high priority bills?"</li>
                            </ul>
                        </p>
                    </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
