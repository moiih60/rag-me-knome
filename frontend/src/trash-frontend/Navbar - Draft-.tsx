import { BrowserRouter, NavLink } from 'react-router-dom';
import { navbarItems, type MenuItems }  from './navigation';


function Navbar() {

    return (
        <>
            <nav>
                <ul>
                    {navbarItems.map((item: MenuItems) => (
                        <li key={item.path}>
                            {/* <BrowserRouter> */}
                                <NavLink
                                    to={item.path} 
                                    end={item.path === '/'} 
                                >
                                    {item.label}
                                </NavLink>
                            {/* </BrowserRouter> */}
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

export default Navbar;