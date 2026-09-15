import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

export default function BhuSathiChatbot({ parcels }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am Bhu-Sathi Assistant for BHUSETU. How can I help you with land records, ULPIN, or compensation rules today?'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    const query = input.toLowerCase();
    setInput('');

    setTimeout(() => {
      let botReply = "Under RFCTLARR Act 2013, land acquisition involves Section 3A Intention Notice, Section 3D Declaration, and Section 3G Award with compulsory 100% solatium and rural multiplier factor (1.25x-2.0x).";

      if (query.includes('solatium') || query.includes('compensation') || query.includes('calculate')) {
        botReply = "Compulsory Solatium is 100% of the basic land value plus assets (structures/trees) under LARR 2013. In rural areas, a multiplier of 1.25x to 2.0x is applied based on distance from urban boundaries, plus 12% annual interest from Sec 3A notification date.";
      } else if (query.includes('ulpin') || query.includes('bhu aadhaar') || query.includes('status')) {
        botReply = "ULPIN (Unique Land Parcel Identification Number) is a 14-digit alphanumeric code assigned to every land plot. You can enter your ULPIN in our Citizen Portal to verify bank account details and track DBT payouts.";
      } else if (query.includes('objection') || query.includes('dispute') || query.includes('hearing')) {
        botReply = "Under Section 3C, landowners can file written objections within 21 days of Section 3A publication. Hearings are conducted by the Land Acquisition Officer (LAO).";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[2000]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-3.5 rounded-full shadow-xl hover:scale-105 transition-all flex items-center space-x-2 border border-amber-400 cursor-pointer"
        >
          <Bot className="w-6 h-6 text-slate-950" />
          <span className="text-xs font-mono tracking-wide hidden md:inline">Bhu-Sathi Assistant</span>
        </button>
      ) : (
        <div className="bg-white border border-slate-300 rounded-2xl w-80 md:w-96 shadow-2xl flex flex-col overflow-hidden text-slate-900">
          {/* Header */}
          <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center space-x-1">
                  <span>Bhu-Sathi Assistant</span>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </h4>
                <p className="text-[10px] text-amber-400 font-mono font-bold">BHUSETU Platform</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="p-3 space-y-3 h-72 overflow-y-auto text-xs font-medium">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-2.5 rounded-xl leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none' 
                      : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-2 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask about LARR 2013, ULPIN, DBT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
