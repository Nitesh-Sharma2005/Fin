import { FinancialItem } from './types';

export const INITIAL_DATA: FinancialItem[] = [
  {
    id: '1',
    type: 'EMI',
    name: 'Bike Loan',
    amount: 3500,
    due_date: '2026-02-20',
    reminder_days_before: 3,
    priority: 'high'
  },
  {
    id: '2',
    type: 'Subscription',
    name: 'Netflix Premium',
    amount: 649,
    due_date: '2024-05-15', // Intentionally past/near date for demo
    reminder_days_before: 1,
    priority: 'low'
  },
  {
    id: '3',
    type: 'Bill',
    name: 'Electricity Bill',
    amount: 1250,
    due_date: new Date().toISOString().split('T')[0], // Due today
    reminder_days_before: 2,
    priority: 'high'
  }
];

export const ITEM_TYPES: string[] = ['EMI', 'Bill', 'Subscription', 'Loan', 'Other'];
export const PRIORITIES: string[] = ['high', 'medium', 'low'];
