import { NavLink } from 'react-router-dom';
import { navbarItems, type MenuItems }  from '../config/navigation';
import { motion } from 'motion/react';
import { div } from 'motion/react-client';


function Navbar() {
	
	return (
		<>
			<nav className='bg-white p-2 rounded-full text-pink-800'>
				<ul className='flex flex-row gap-1'>
					{navbarItems.map((item: MenuItems) => (
						<li key={item.path}>
							<NavLink 
								to={item.path}
								end={item.path === "/"}
								className={({ isActive, isPending, isTransitioning }) => `
									relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 outline-none block z-10
                ${isActive ? 'text-white' : 'text-black hover:text-pink-900'}
              `}
							>
							
											{/* Destructure isActive in a function body to render the layout span */}
									{
										({ isActive }) => (
											<>
												{isActive && (
														<motion.span
																layoutId="active-navlink-indicator"
																className="absolute inset-0 bg-blue-500 rounded-full -z-10"

														/>
												)}
													{item.label}
											</>
										)
									}

							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;