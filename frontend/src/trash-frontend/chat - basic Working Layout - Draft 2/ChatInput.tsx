import React, { useState, type ChangeEvent, type SubmitEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => Promise<void>;
  loading: boolean;
}

export default function ChatInput({ onSendMessage, loading }: ChatInputProps): React.JSX.Element {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!input.trim()) return;

    // Trigger the function passed down from the parent component
    onSendMessage(input);
    
    // Clear out this component's local typing buffer state box
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-[10px]">
      <input 
        type="text" 
        value={input} 
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} 
        className="flex-grow p-[10px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        placeholder="Ask a question..."
        disabled={loading}
      />
      <button 
        type="submit" 
        disabled={loading} 
        className={`px-5 py-[10px] rounded-md text-sm font-medium text-white transition-colors ${
          loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 cursor-pointer'
          }`}
      >
        Send
      </button>
    </form>
  );
}
