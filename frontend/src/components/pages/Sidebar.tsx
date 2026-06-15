import { useScreenSize } from "../hooks/useWindowSize";


function Sidebar() {
	
	const { width, height } = useScreenSize();
	
	return (
		<>
			<div className="h-screen w-[20%] shadow-md">
			
				<span>Sidebar Section</span>  <br />
				
				<h1 className="font-light bg-yellow-400 w-fit">
					Hye Henry!  <br />
					Width: {width}  <br />
					Height: {height}  <br />
				</h1>
			
			</div>
		</>
	);
}

export default Sidebar;