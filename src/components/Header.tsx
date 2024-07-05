"use client";

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from './ThemeProvider';
import { useRouter } from 'next/navigation';

interface linkObj {
    name: string;
    link: string
}

const links: linkObj[] = [
    {
        name: 'Home',
        link: '/',
    },
    {
        name: 'Work',
        link: '/work',
    },
    {
        name: 'Analytics',
        link: '/analytics',
    },
];
const mobileLinks: linkObj[] = [
    {
        name: 'Home',
        link: '/',
    },
    {
        name: 'Work',
        link: '/work',
    },
    {
        name: 'Analytics',
        link: '/analytics',
    },
];

export const Desktop = ({ links, hoveredIndex, setHoveredIndex, router }: {
    links: linkObj[],
    hoveredIndex: number | null,
    setHoveredIndex: CallableFunction,
    router: any
}) => {
    return (
      <>
        {links.map((navLink, index) => (
          <Link href={navLink.link}>
            <div
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative rounded-lg px-3 inline-block py-2 text-sm text-gray-700 dark:text-gray-200 transition-all delay-150 hover:text-gray-900 dark:hover:text-gray-900"
            >
              <span
                className={`relative z-10 ${
                  router.asPath === navLink.link
                    ? "text-teal-600"
                    : "text-gray-600 dark:text-gray-50"
                }`}
              >
                {navLink.name}
              </span>
              {router.asPath === navLink.link && (
                <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/40 dark:to-blue-400/0"></span>
              )}
            </div>
          </Link>
        ))}
      </>
    );
  };

export const Mobile = ({ links, router }: {
  links: linkObj[],
  router: any
}) => {
	const [open, setOpen] = useState(false);
	const dropIn = {
		hidden: {
			y: '-4vh',
			opacity: 0,
		},
		visible: {
			y: '0',
			opacity: 1,
			transition: {
				duration: 0.1,
				type: 'spring',
				damping: 25,
				stiffness: 500,
			},
		},
		exit: {
			y: '-4vh',
			opacity: 0,
		},
	};

	const handleClick = (link: string) => {
		setOpen(false);
		router.push(link);
	};

	useEffect(() => {
		console.log('open value', open);
	}, [open]);

	return (
		<div className="w-full flex flex-row items-center space-x-2">
			<button
				onClick={() => handleClick(links[0].link)}
				className="relative rounded-lg px-1 py-1 text-sm text-gray-700 dark:text-gray-200 transition-all delay-150 
          hover:text-gray-900 dark:hover:text-gray-900"
			>
				{links[0]?.name}
			</button>

			<button
				onClick={() => setOpen(!open)}
				className="p-2 rounded-md bg-gray-200 dark:bg-gray-800"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					className="w-6 h-6 text-black dark:text-white"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
				{open && (
					<div
						className={`absolute inset-x-0 mx-auto top-20 flex flex-col w-[90%]  p-4 rounded-lg shadow-xl z-[999] 
              bg-white dark:bg-gray-800 divide-y dark:divide-gray-700
              ${open ? 'animate-slideIn' : 'animate-slideOut'}
            `}
					>
						{[...links].splice(1).map((el) => (
							<button
								key={el?.link}
								onClick={() => handleClick(el.link)}
								className="relative font-bold px-1 py-4 sm:px-4 sm:py-2 text-sm text-gray-700 dark:text-gray-200 transition-all delay-150 hover:text-gray-900 dark:hover:text-gray-900 text-left"
							>
									<span className="relative z-10">
										{el.name}
									</span>
							</button>
						))}
					</div>
				)}
		</div>
	);
};

const Header = () => {
    const {theme, toggleTheme}: {theme: string, toggleTheme: () => void} = useContext(ThemeContext);
    const router = useRouter();

    let [hoveredIndex, setHoveredIndex] = useState(null);
    
    return (
        <div
            id="header"
            className="sticky-nav w-full bg-white dark:bg-zinc-900 bg-opacity-60"
        >
            <div className="flex justify-between items-center max-w-6xl p-8 mx-auto">
                <div onClick={toggleTheme} className="cursor-pointer dark:text-white p-2 rounded-3xl shadow-lg shadow-zinc-800/5 dark:shadow-white/5">
                    {theme === 'light' ? <Moon/> : <Sun/>}
                </div>
                <div className="hidden sm:block rounded-full px-3 text-sm font-medium 
                    bg-white/90 text-zinc-800 shadow-lg shadow-zinc-800/5
                    dark:bg-zinc-900/90 dark:text-zinc-200 dark:shadow-white/5">
                    <Desktop
                        links={links}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                        router={router}
                    />
                </div>
                <div className="block sm:hidden">
                    <Mobile links={mobileLinks} router={router} />
                </div>
            </div>
        </div>
    );
};

export default Header;
