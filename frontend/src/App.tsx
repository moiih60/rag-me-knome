// import { useScreenSize } from './components/hooks/useWindowSize';
import Sidebar from './components/pages/Sidebar';
import Navbar from './components/pages/Navbar';
// import ChatBox from './components/pages/ChatBox';
import Chat from './components/pages/chat/Chat';
//import Hero from './components/pages/Hero';
//import Footer from './components/pages/Footer'; 
import { Routes, Route, useLocation } from 'react-router-dom';	// For Routing
import { motion, AnimatePresence } from 'motion/react';		// For animations  
import { navbarItems, type MenuItems }  from './components/config/navigation';	// For looping components in routes
import React, { useState, useEffect } from 'react';
import ChatHistory from './components/pages/chat/ChatHistory';
import ChatInput from './components/pages/chat/ChatInput';



// BrowserRouter has been shifted to main.tsx, so that we can use "useLocation()". The useLocatio() only works when it is used in a component which is a child of BrowserRouter component.

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface ChatApiResponse {
  response: string;
}


function App() {
	
	const location = useLocation();
	
		// We can create dummy(placeholder) components like this below:
	// const dummyComponent = () => (<div>Dummy</div>);

	// const About = () =>  ( <div className='h-full text-center p-6 bg-yellow-400 rounded-xl'>Welcom to About Section</div> );
	// const Contact = () =>  ( <div className='text-center p-6 bg-pink-600 rounded-xl'>Welcom to Contact Section</div> );
	// const Projects = () =>  ( <div className='text-center p-6 bg-blue-200 rounded-xl'>Welcom to Projects Section</div> );


	// For Chat Input & History
	const [loading, setLoading] = useState<boolean>(false);
	const [sessionId, setSessionId] = useState<string>('');

	const [activeChat, setActiveChat] = useState<boolean>(true);  // for activating chat interface

	function handleActiveChat() {
		setActiveChat( (prev) => !prev );
	}


	// Load existing messages from localStorage on startup
	const [messages, setMessages] = useState<Message[]>(() => {
		const savedMessages = localStorage.getItem('chat_history_logs');
		return savedMessages ? JSON.parse(savedMessages) : [];
	});

	useEffect(() => {
		// Synchronize or generate a persistent Session Tracker token on startup mount
		let activeSession = localStorage.getItem('rag_session_id');
		if (!activeSession) {
		activeSession = 'session_' + Math.random().toString(36).substring(2, 11);
		localStorage.setItem('rag_session_id', activeSession);
		}
		setSessionId(activeSession);
	}, []);

	// Automatically saves messages whenever the array changes
	useEffect(() => {
		localStorage.setItem('chat_history_logs', JSON.stringify(messages));
	}, [messages]);

	const handleSendMessage = async (userText: string): Promise<void> => {
		const userMessage: Message = { text: userText, sender: 'user' };
		setMessages((prev) => [...prev, userMessage]);
		setLoading(true);

		try {
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
		setMessages((prev) => [...prev, { text: 'Network request dropped.', sender: 'bot' }]);
		} finally {
		setLoading(false);
		}
	};

	
	const clearSessionMemory = (): void => {
		const freshSession = 'session_' + Math.random().toString(36).substring(2, 11);
		localStorage.setItem('rag_session_id', freshSession);
		
		// 3. PERSISTENCE FIX: Clear message tracking logs completely out of local cache
		localStorage.removeItem('chat_history_logs');
		
		setSessionId(freshSession);
		setMessages([]);
	};
	
	return (
		<>
			{/* Main Outermost container */}
			{/* ------- "min-h-screen" for scrollable page -------- */}
			<div className='min-h-dvh w-full flex flex-row overflow-hidden bg-slate-500 bg-slate-500'>
				{/* Sidebar section */}
					<Sidebar className='w-fit hidden sm:block' />

				{/* Main Dynamic App Area on right */}
				<div className='flex-1 min-h-screen flex flex-col gap-1 justify-between items-center rounded-xl border-2 border-red-300'>

					<div className='flex-shrink-0 pt-3'>
						<Navbar />
					</div>
					
					<main className='flex-1 flex justify-center items-center border-2 border-yellow-300'>
							<div>
								<AnimatePresence mode='wait'>

									 {/* When activeChat is False */}
									{ !activeChat && (
										<Routes location={location}  key={location.pathname}>
											{/* ------- Mapping Routes and Framer Animation to each route using Loop ------- */}
											{navbarItems.map((item: MenuItems) => (
												<Route 
													key={item.path}  
													path={item.path}  
													element={
														<motion.div
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															exit={{ opacity: 0 }}
															transition={{ duration: 0.2 }}
														>
																<item.component />
															</motion.div>
														} 
												/>
											))}
											

													{/* ======= Manually hard-coding each Routes ====== */}
											{/* <Route path="/"  element={
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{ duration: 2 }}
												>
														<Hero />
												</motion.div>
											} />
											<Route path="/about"  element={<About />} />
											<Route path="/contact"  element={<Contact />} />
											<Route path="/projects"  element={<Projects />} /> */}
										</Routes>
									)}


										{/* When activeChat is False */}
									{ activeChat && ( 
										<div className="mx-auto my-6 max-w-[600px] font-sans px-4">
											<div className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col gap-4">
												<div className="flex justify-between items-center border-b border-gray-100 pb-2">
													<h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Contextual Chatbot</h2>
													<button 
													type="button" 
													onClick={clearSessionMemory} 
													className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1 px-3 rounded transition-colors"
													>
													Clear Screen & Thread
													</button>
												</div>
												
												<ChatHistory messages={messages} loading={loading} />
											</div>
										</div>
									)}

								</AnimatePresence>
							</div>
					</main>
					

						{/* Chat Input Section (Fixed) */}
					<div className='flex-1 w-[80%] border-2'>
							<ChatInput onSendMessage={handleSendMessage} loading={loading}  />
							{/* <Chat /> */}
					</div>
					
				</div>
			</div>
		
		</>
	);
	}
	
	export default App;