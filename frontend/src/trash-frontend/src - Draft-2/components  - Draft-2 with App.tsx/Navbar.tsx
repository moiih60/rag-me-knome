// import { BrowserRouter, NavLink } from 'react-router-dom';
import { navbarItems, type MenuItems }  from './navigation';


function Navbar() {
	
	return (
		<>
			<nav>
				<ul>
					{navbarItems.map((item: MenuItems) => (
						<li key={item.path}>
							<a href={item.path}>
								{item.label}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</>
	);
}

export default Navbar;