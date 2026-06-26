import React, { useState, type ChangeEvent, type SubmitEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
}

export default function ChatInput({ onSendMessage, loading }: ChatInputProps): React.JSX.Element {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    onSendMessage(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input 
        type="text" 
        value={input} 
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} 
        disabled={loading}
        className="flex-grow p-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 transition-all placeholder-gray-400"
        placeholder={loading ? "Waiting for AI..." : "Ask your documentation repository..."}
      />
      <button 
        type="submit" 
        disabled={loading || !input.trim()} 
        className={`px-5 py-3 rounded-lg text-sm font-semibold text-white transition-all shadow-sm ${
          loading || !input.trim()
            ? 'bg-gray-300 cursor-not-allowed text-gray-400' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
        }`}
      >
        Send
      </button>
    </form>
  );
}
