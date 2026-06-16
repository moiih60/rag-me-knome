import { useScreenSize } from "../hooks/useWindowSize";


// interface to accept className property from App.tsx
interface SidebarProps {
	className?: string;		//  (?:) means this prop is optional. It is NOT ternary operators syntax. It is reserved Typescript syntax.
}


function Sidebar({ className='' }: SidebarProps) {
	
	const { width, height } = useScreenSize();
	
	return (
		<>
			<div className={`min-h-screen shadow-lg ${className}`}>
			
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