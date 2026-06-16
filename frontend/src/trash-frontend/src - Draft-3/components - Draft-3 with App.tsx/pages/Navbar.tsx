import { NavLink } from 'react-router-dom';
import { navbarItems, type MenuItems }  from '../navigation';


function Navbar() {
	
	return (
		<>
			<nav className='bg-white'>
				<ul className='flex flex-row '>
					{navbarItems.map((item: MenuItems) => (
						<li key={item.path}>
							<NavLink 
								to={item.path}
								className={({ isActive, isPending, isTransitioning }) => `
									px-2 py-1 rounded transition-all duration-200
									${isActive ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'}
								`}
								end={item.path === "/"}
							>
									{item.label}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;