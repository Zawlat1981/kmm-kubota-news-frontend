'use client';

import { useState, type FormEvent } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function KmmChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#F36F21] text-white px-4 py-3 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">KMM AI Assistant</h3>
              <p className="text-xs text-orange-100">KMM Kubota Myanmar • News & Sales</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-orange-600 rounded-lg px-2 py-1 text-sm"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center mt-10">
                <p className="font-medium text-gray-700">မင်္ဂလာပါ ခင်ဗျာ 👋</p>
                <p className="text-xs mt-1">
                  KMM သတင်းများ၊ ထွန်စက်ဈေးနှုန်းများနှင့် အရောင်းစာရင်းများကို မေးမြန်းနိုင်ပါသည်။
                </p>
              </div>
            )}

            {messages.map((m) => {
              const messageText = m.parts
                ? m.parts
                    .filter((part) => part.type === 'text')
                    .map((part) => part.text)
                    .join('')
                : '';

              if (!messageText) return null;

              return (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-[#007B8A] text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {messageText}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="text-xs text-gray-400 italic">AI ရှာဖွေဖြေကြားနေပါသည်...</div>
            )}

            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                Error: {error.message}
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="မေးခွန်းရိုက်ထည့်ပါ..."
              className="flex-1 text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#F36F21]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#F36F21] hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              ပို့မည်
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#F36F21] hover:bg-orange-600 text-white rounded-full px-5 py-3.5 shadow-lg flex items-center gap-2 font-medium text-sm transition ml-auto"
      >
        <span>💬</span>
        <span>{isOpen ? 'ပိတ်မည်' : 'KMM AI မေးရန်'}</span>
      </button>
    </div>
  );
}
