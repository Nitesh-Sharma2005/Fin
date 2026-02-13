import React, { useState, useRef, useEffect } from 'react';
import { Bot, Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import { FinancialItem, ChatMessage } from '../types';
import { generateFinancialResponse } from '../services/geminiService';

interface AIChatProps {
  items: FinancialItem[];
}

const AIChat: React.FC<AIChatProps> = ({ items }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello! I am FinMind. Ask me about your dues, upcoming payments, or a financial summary.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text: string) => {
    if (!voiceMode) return;
    
    // Cancel previous speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to select a decent voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateFinancialResponse(userMsg.content, items, voiceMode);
      
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      if (voiceMode) {
        speak(responseText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Pre-load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  return (
    <div className="flex flex-col h-[600px] bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden relative">
      <div className="p-4 bg-slate-900 border-b border-slate-700 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 text-indigo-400">
          <Bot size={20} />
          <h3 className="font-semibold text-white">FinMind AI</h3>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs ${voiceMode ? 'text-green-400' : 'text-slate-500'}`}>
                {voiceMode ? 'Voice Mode ON' : 'Voice Mode OFF'}
            </span>
            <button 
                onClick={() => {
                    setVoiceMode(!voiceMode);
                    window.speechSynthesis.cancel();
                }}
                className={`p-2 rounded-full transition-colors ${voiceMode ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                title="Toggle Voice Mode"
            >
            {voiceMode ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-slate-700 text-slate-200 rounded-bl-none border border-slate-600'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-slate-700 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={voiceMode ? "Type a question (Reply will be spoken)..." : "Ask about your finances..."}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex-shrink-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
