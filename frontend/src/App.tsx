// import { useScreenSize } from './components/hooks/useWindowSize';
import Sidebar from './components/pages/Sidebar';
import Navbar from './components/pages/Navbar';
import Hero from './components/pages/Hero';
//import Footer from './components/pages/Footer'; 
import { Routes, Route, useLocation } from 'react-router-dom';	// For Routing
import { motion, AnimatePresence } from 'motion/react';		// For animations  
import { navbarItems, type MenuItems }  from './components/config/navigation';	// For looping components in routes
import { div } from 'motion/react-client';



// BrowserRouter has been shifted to main.tsx, so that we can use "useLocation()". The useLocatio() only works when it is used in a component which is a child of BrowserRouter component.


function App() {
	
	const location = useLocation();
	
	// We can create dummy(placeholder) components like this below:
// const dummyComponent = () => (<div>Dummy</div>);

	// const About = () =>  ( <div className='h-full text-center p-6 bg-yellow-400 rounded-xl'>Welcom to About Section</div> );
	// const Contact = () =>  ( <div className='text-center p-6 bg-pink-600 rounded-xl'>Welcom to Contact Section</div> );
	// const Projects = () =>  ( <div className='text-center p-6 bg-blue-200 rounded-xl'>Welcom to Projects Section</div> );
	
	return (
		<>
			{/* Main Outermost container */}
			<div className='h-dvh w-full flex flex-row overflow-hidden bg-slate-500 bg-slate-500'>
				{/* Sidebar section */}
				<Sidebar />

				{/* Main Dynamic App Area on right */}
				<div className='grow flex flex-col gap-2 items-center justify-center  rounded-xl border border-red-300 '>

					<div className='pt-3'>
						<Navbar />
					</div>
					
					<main className='grow flex justify-center items-center'>
						<div className='grow'>
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
														transition={{ duration: 0.3 }}
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
						</div>
					</main>

				</div>
			</div>
		
		</>
	);
	}
	
	export default App;