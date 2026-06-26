import React from 'react';
import { type Message } from './Chat'; // Import the type interface from parent

interface ChatHistoryProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatHistory({ messages, loading }: ChatHistoryProps): React.JSX.Element {
  return (
    <div className="h-[380px] overflow-y-auto border border-gray-300 p-[10px] rounded-md flex flex-col gap-3 bg-gray-50">
      {messages.map((msg: Message, index: number) => {
        const isUser = msg.sender === 'user';
        return (
          <div 
            key={index} 
            className={`flex flex-col max-w-[80%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
          >
            <span className="text-xs text-gray-500 mb-1 px-1">
              {isUser ? 'You' : 'AI'}
            </span>
            <div 
              className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                isUser 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
      
      {loading && (
        <div className="self-start text-xs text-gray-400 italic mt-1 animate-pulse">
          AI is formulating response...
        </div>
      )}
    </div>
  );
}
