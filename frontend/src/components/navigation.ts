// setting up the type for Navbar Menu Items
export interface MenuItems {
	label: string;
	path: string;
}

// initializing Navbar Menu Items List for Nabvar.tsx
export const navbarItems: MenuItems[] = [
	{ label: 'Home',  path: '/' },
	{ label: 'Projects',  path: '/projects' },
	{ label: 'About Me',  path: '/about' },
	{ label: 'Contact Me',  path: '/contact' }
];
