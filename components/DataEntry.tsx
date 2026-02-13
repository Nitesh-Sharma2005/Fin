import React, { useState } from 'react';
import { FinancialItem, ItemType, Priority } from '../types';
import { ITEM_TYPES, PRIORITIES } from '../constants';
import { Code, Plus, Save } from 'lucide-react';

interface DataEntryProps {
  onAddItem: (item: FinancialItem) => void;
  onImportJson: (items: FinancialItem[]) => void;
}

const DataEntry: React.FC<DataEntryProps> = ({ onAddItem, onImportJson }) => {
  const [mode, setMode] = useState<'form' | 'json'>('form');
  const [jsonInput, setJsonInput] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<ItemType>('EMI');
  const [dueDate, setDueDate] = useState('');
  const [reminderDays, setReminderDays] = useState('3');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !dueDate) return;

    const newItem: FinancialItem = {
      id: crypto.randomUUID(),
      name,
      amount: parseFloat(amount),
      type,
      due_date: dueDate,
      reminder_days_before: parseInt(reminderDays),
      priority
    };

    onAddItem(newItem);
    // Reset
    setName('');
    setAmount('');
    setDueDate('');
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      
      // Basic validation
      const validItems = items.map((item: any) => ({
        ...item,
        id: item.id || crypto.randomUUID()
      })) as FinancialItem[];

      onImportJson(validItems);
      setJsonInput('');
      alert('Data imported successfully');
    } catch (err) {
      alert('Invalid JSON format. Please check syntax.');
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg h-full">
       <div className="flex border-b border-slate-700">
        <button 
          onClick={() => setMode('form')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'form' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Plus size={16} /> Add Item
          </div>
        </button>
        <button 
          onClick={() => setMode('json')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'json' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
        >
           <div className="flex items-center justify-center gap-2">
            <Code size={16} /> JSON Import
          </div>
        </button>
      </div>

      <div className="p-6">
        {mode === 'form' ? (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Description / Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Bike Loan"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Amount</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as ItemType)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Priority</label>
                 <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
             
             <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Reminder (Days before)</label>
                <input 
                  type="number" 
                  value={reminderDays}
                  onChange={(e) => setReminderDays(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  min="0"
                  max="30"
                />
             </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Plus size={18} /> Add Record
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Paste your JSON data below. You can paste a single object or an array of objects.
            </p>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-mono text-green-400 focus:outline-none focus:border-indigo-500"
              placeholder={`{
 "type": "EMI",
 "name": "Bike Loan",
 "amount": 3500,
 "due_date": "2026-02-20",
 "reminder_days_before": 3,
 "priority": "high"
}`}
            />
             <button 
                onClick={handleJsonSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
              <Save size={18} /> Import JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataEntry;
