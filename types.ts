export type Priority = 'high' | 'medium' | 'low';
export type ItemType = 'EMI' | 'Bill' | 'Subscription' | 'Loan' | 'Other';

export interface FinancialItem {
  id: string;
  type: ItemType;
  name: string;
  amount: number;
  due_date: string; // ISO Date string YYYY-MM-DD
  reminder_days_before: number;
  priority: Priority;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
