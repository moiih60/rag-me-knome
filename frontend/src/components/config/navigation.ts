import Hero from '../pages/Hero';
import Projects from '../pages/Projects';
import About from '../pages/About';
import Contact from '../pages/Contact';
import  React from 'react';


// setting up the type for Navbar Menu Items
export interface MenuItems {
	label: string;
	path: string;
	component: React.ComponentType;
}


// initializing Navbar Menu Items List for Nabvar.tsx
export const navbarItems: MenuItems[] = [
	{ label: 'Home',  path: '/',  component: Hero },
	{ label: 'Projects',  path: '/projects',  component: Projects },
	{ label: 'About Me',  path: '/about',  component: About },
	{ label: 'Contact Me',  path: '/contact',  component: Contact },
];
