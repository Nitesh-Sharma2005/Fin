import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FinancialItem } from '../types';
import { AlertCircle, Calendar, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardProps {
  items: FinancialItem[];
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'];

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  const totalDue = useMemo(() => items.reduce((acc, item) => acc + item.amount, 0), [items]);
  
  const today = new Date().toISOString().split('T')[0];
  const dueTodayCount = useMemo(() => items.filter(i => i.due_date === today).length, [items, today]);
  
  const highPriorityCount = useMemo(() => items.filter(i => i.priority === 'high').length, [items]);

  const dataByType = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(item => {
      map.set(item.type, (map.get(item.type) || 0) + item.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [items]);

  const dataByPriority = useMemo(() => {
     const map = new Map<string, number>();
    items.forEach(item => {
      map.set(item.priority, (map.get(item.priority) || 0) + item.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [items]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-indigo-500/20 rounded-full text-indigo-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Due</p>
            <p className="text-2xl font-bold text-white">{totalDue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-pink-500/20 rounded-full text-pink-400">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Due Today</p>
            <p className="text-2xl font-bold text-white">{dueTodayCount}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex items-center space-x-4">
          <div className="p-3 bg-red-500/20 rounded-full text-red-400">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">High Priority</p>
            <p className="text-2xl font-bold text-white">{highPriorityCount}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
            <TrendingUp size={18} /> Expense Distribution (Type)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <h3 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
            <AlertCircle size={18} /> Priority Breakdown
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataByPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                   cursor={{fill: '#334155', opacity: 0.4}}
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]}>
                   {dataByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.name === 'high' ? '#ef4444' : entry.name === 'medium' ? '#f59e0b' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
