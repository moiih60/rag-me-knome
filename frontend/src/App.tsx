// import { useScreenSize } from './components/hooks/useWindowSize';
import Sidebar from './components/pages/Sidebar';
import Navbar from './components/pages/Navbar';
import Hero from './components/pages/Hero';
import Footer from './components/pages/Footer'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
	
	//const { width, height } = useScreenSize();
	const About = () =>  ( <div className='text-center p-6 bg-yellow-400 rounded-xl'>Welcom to About Section</div> );
	const Contact = () =>  ( <div className='text-center p-6 bg-pink-600 rounded-xl'>Welcom to Contact Section</div> );
	const Projects = () =>  ( <div className='text-center p-6 bg-blue-200 rounded-xl'>Welcom to Projects Section</div> );
	
	return (
		<>
			<BrowserRouter>
				{/* Main Outermost container */}
				<div className='h-dvh w-full flex flex-row overflow-hidden bg-slate-500 bg-slate-500'>
					{/* Sidebar section */}
					<Sidebar />

					{/* Main Dynamic App Area on right */}
					<div className='grow flex flex-col gap-2 items-center justify-center  rounded-xl border border-red-300 '>

						<div className='pt-3'>
							<Navbar />
						</div>
						
						<main className='grow'>
							<Routes>
								<Route path="/"  element={<Hero />} />
								<Route path="/about"  element={<About />} />
								<Route path="/contact"  element={<Contact />} />
								<Route path="/projects"  element={<Projects />} />
							</Routes>
						</main>

					</div>
				</div>
			</BrowserRouter>
		</>
	);
	}
	
	export default App;