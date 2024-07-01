"use client";

import { useContext, useState } from 'react';
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
                <div onClick={toggleTheme} className="cursor-pointer dark:text-white">
                    {theme === 'light' ? <Moon size={"2rem"}/> : <Sun size={"2rem"}/>}
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
                {/* <div className="block sm:hidden" links={mobileLinks}>
                    <Mobile links={mobileLinks} />
                </div> */}
            </div>
        </div>
    );
};

export default Header;
