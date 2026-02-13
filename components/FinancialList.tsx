import React from 'react';
import { FinancialItem } from '../types';
import { AlertTriangle, CheckCircle, Clock, Trash2 } from 'lucide-react';

interface FinancialListProps {
  items: FinancialItem[];
  onDelete: (id: string) => void;
}

const FinancialList: React.FC<FinancialListProps> = ({ items, onDelete }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400';
    }
  };

  const getDaysRemaining = (dateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(dateStr);
    due.setHours(0,0,0,0);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="font-semibold text-slate-200">Active Items</h3>
      </div>
      <div className="divide-y divide-slate-700">
        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No items found. Add some data!
          </div>
        ) : (
          items.map((item) => {
            const daysLeft = getDaysRemaining(item.due_date);
            let statusIcon = <Clock size={16} />;
            let statusText = `${daysLeft} days left`;
            let statusColor = "text-slate-400";

            if (daysLeft < 0) {
              statusIcon = <AlertTriangle size={16} />;
              statusText = `Overdue by ${Math.abs(daysLeft)} days`;
              statusColor = "text-red-500";
            } else if (daysLeft === 0) {
              statusIcon = <AlertTriangle size={16} />;
              statusText = "Due Today";
              statusColor = "text-red-400 font-bold";
            } else if (daysLeft <= item.reminder_days_before) {
              statusText = `Due soon (${daysLeft} days)`;
              statusColor = "text-amber-400";
            }

            return (
              <div key={item.id} className="p-4 hover:bg-slate-700/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(item.priority)} uppercase`}>
                      {item.priority}
                    </span>
                    <span className="text-slate-500 text-xs uppercase tracking-wider">{item.type}</span>
                  </div>
                  <h4 className="text-lg font-medium text-white">{item.name}</h4>
                  <div className={`text-sm flex items-center gap-1.5 mt-1 ${statusColor}`}>
                    {statusIcon}
                    <span>{statusText}</span>
                    <span className="text-slate-600 mx-1">•</span>
                    <span className="text-slate-400">Due: {item.due_date}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xl font-bold text-white font-mono">
                    {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"
                    title="Delete Item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FinancialList;
