// import { useScreenSize } from './components/hooks/useWindowSize';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer'; 


function App() {
	
	// const { width, height } = useScreenSize();
	
	return (
		<>
			{/* <h1 className="text-xl font-light bg-yellow-400">Hye Henry!</h1> */}
			
			{/* Main Container */}
			{/* <div className="h-dvh w-full flex flex-col overflow-hidden bg-slate-500"> */}
			
			<div className="h-dvh w-full flex flex-col overflow-hidden bg-slate-500">
				{/* <h1 className="text-xl font-light bg-yellow-400 w-fit">
					Hye Henry!  <br />
					Width: {width}  <br />
					Height: {height}  <br />
					</h1> */}
					
					
				<div className="flex flex-row">
					{/* Sidebar Section */}
					<Sidebar />
					
					{/* Hero Main Section */}
					<div>
						{/* Navbar */}
						<Navbar />
						
						{/* Middle Hero Section */}
						<div>
						<Hero />
					</div>
					
					{/* Footer */}
					<Footer />
					</div>
				
				</div>
			</div>
				
				{/* <div className="flex justify-center align-items-center">Footer</div> */}
				
			</>
		);
	}
	
	export default App;