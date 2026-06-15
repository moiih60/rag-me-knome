import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResponseDisplay } from './components/ResponseDisplay';
import { ChatInput } from './components/ChatInput';
import type { ChatState } from './types';

const App: React.FC = () => {
  // Singular state tracking to overwrite previous responses instantly
  const [chat, setChat] = useState<ChatState>({
    question: null,
    answer: null,
    isLoading: false,
  });

  const handleQuestionSubmit = async (newQuestion: string) => {
    // 1. Stage the UI for the new question cycle immediately
    setChat({
      question: newQuestion,
      answer: null,
      isLoading: true,
    });

    try {
      // 2. Query your FastAPI endpoint
      const response = await fetch('http://127.0.0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion }), // Adjust model keys to match ChatRequest fields
      });

      if (!response.ok) throw new Error('Network fault encountered');
      
      const data = await response.json();

      // 3. Replace state cleanly with final payload data string
      setChat({
        question: newQuestion,
        answer: data.response, // Extracts text string matching FastAPI router return key
        isLoading: false,
      });

    } catch (error) {
      setChat({
        question: newQuestion,
        answer: "System Error: Unable to fetch payload answer stream from endpoint destination.",
        isLoading: false,
      });
    }
  };

  return (
    <div style={{ backgroundColor: 'red'}} className="flex flex-col md:flex-row h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Left Sidebar Frame Context Area (30% desktop) */}
      <Sidebar />

      {/* Right Interaction Content Panel Frame (70% desktop) */}
      <main className="flex-1 flex flex-col h-full bg-slate-950 relative">
        
        {/* Top Minimalist Header Navigation Bar */}
        <header className="h-14 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">RAG Engine Terminal</span>
          </div>
          <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">Status: Secure</span>
        </header>

        {/* Central Display Panel Wrapper */}
        <ResponseDisplay chat={chat} />

        {/* Fixed Core Bottom Input Row */}
        <ChatInput onSend={handleQuestionSubmit} disabled={chat.isLoading} />
      </main>
    </div>
  );
};

export default App;
