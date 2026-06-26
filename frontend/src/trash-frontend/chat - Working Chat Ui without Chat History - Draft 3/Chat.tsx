import React, { useState, type SubmitEvent } from 'react';
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

  // This function runs here because it must modify the "messages" and "loading" states directly
  const handleNewUserMessage = async (userText: string): Promise<void> => {
    // 1. Append user's text immediately to the history state
    const userMessage: Message = { text: userText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // 2. Fire the network API request
      const response = await fetch('https://obscure-bassoon-gx4gr6x56v9qcvrv4-8000.app.github.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userText }),
      });

      if (!response.ok) throw new Error('Network error');

      const data: ChatApiResponse = await response.json();

      // 3. Append the server's response to the history state
      setMessages((prev) => [...prev, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { text: 'Failed to process message.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-5 max-w-[600px] font-sans px-4">
      {/* Pass down history data and loading flags as props */}
      <ChatHistory messages={messages} loading={loading} />
      
      {/* Pass down the callback function as a trigger prop */}
      <ChatInput onSendMessage={handleNewUserMessage} loading={loading} />
    </div>
  );
}
