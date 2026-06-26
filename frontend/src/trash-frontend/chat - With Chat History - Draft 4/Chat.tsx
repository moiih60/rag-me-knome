import React, { useState, useEffect } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatApiResponse {
  response: string;
}

export default function Chat(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Assign a persistent unique Session Tracker hash token on startup mount
  useEffect(() => {
    let activeSession = localStorage.getItem('rag_session_id');
    if (!activeSession) {
      activeSession = 'session_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('rag_session_id', activeSession);
    }
    setSessionId(activeSession);
  }, []);

  const handleSendMessage = async (userText: string): Promise<void> => {
    const userMessage: Message = { text: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // CRITICAL: Replace with your exact active forwarded Port 8000 GitHub Codespaces URL
      const response = await fetch('https://obscure-bassoon-gx4gr6x56v9qcvrv4-8000.app.github.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userText,
          session_id: sessionId 
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data: ChatApiResponse = await response.json();
      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      alert('Error:' + error);
      setMessages((prev) => [...prev, { text: 'Network dropped out.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearSessionMemory = (): void => {
    const freshSession = 'session_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('rag_session_id', freshSession);
    setSessionId(freshSession);
    setMessages([]);
  };

  return (
    <div className="mx-auto my-6 max-w-[600px] font-sans px-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Contextual Chatbot</h2>
          <button 
            type="button" 
            onClick={clearSessionMemory} 
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1 px-3 rounded transition-colors"
          >
            Reset Thread
          </button>
        </div>
        
        <ChatHistory messages={messages} loading={loading} />
        <ChatInput onSendMessage={handleSendMessage} loading={loading} />
      </div>
    </div>
  );
}
