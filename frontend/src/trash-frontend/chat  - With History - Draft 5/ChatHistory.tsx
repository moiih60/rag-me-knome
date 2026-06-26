// ChatHistory.tsx
import React, { useEffect, useRef } from 'react'; // 1. IMPORT useEffect and useRef
import ReactMarkdown from 'react-markdown';
import { type Message } from './Chat';

interface ChatHistoryProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatHistory({ messages, loading }: ChatHistoryProps): React.JSX.Element {
  // 2. CREATE A REFERENCE ANCHOR OBJECT
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 3. EFFECT BLOCK RUNS AUTOMATICALLY EVERY TIME MESSAGES UPDATES
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]); // Listens for new messages or loading state changes

  return (
    <div className="h-[380px] overflow-y-auto border border-gray-200 p-4 rounded-lg flex flex-col gap-3 bg-gray-50/50">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-sm text-gray-400 italic text-center px-4">
          Chat history is blank. Ask a question to begin a contextual conversation.
        </div>
      ) : (
        messages.map((msg: Message, index: number) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={index} 
              className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <span className="text-[10px] font-bold text-gray-400 mb-1 px-1">
                {isUser ? 'You' : 'AI'}
              </span>
              <div 
                className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}
              >
                
                <ReactMarkdown 
                  components={{
                    a: ({ node, ...props }) => (
                      <a 
                        {...props} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`font-semibold underline ${isUser ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong {...props} className="font-bold" />
                    )
                  }}
                >
                  
                  {msg.text}
                  {/* {msg.text.replace('\n\n', '\n')} */}

                </ReactMarkdown>

              </div>
            </div>
          );
        })
      )}
      
      {loading && (
        <div className="self-start text-xs text-gray-400 font-medium italic mt-1 animate-pulse flex items-center gap-1">
          AI is thinking...
        </div>
      )}

      {/* 4. THE INVISIBLE SCROLL ANCHOR ELEMENT */}
      <div ref={messagesEndRef} />
    </div>
  );
}
