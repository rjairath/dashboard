"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from './ThemeProvider';

const Header = () => {
    const {theme, toggleTheme}: {theme: string, toggleTheme: () => void} = useContext(ThemeContext);

    return (
        <div id="header" className="bg-blue-500 text-white p-4 dark:bg-slate-700">
            <div className="flex justify-between">
                <div onClick={toggleTheme} className="cursor-pointer">
                    {theme === 'light' ? <Moon /> : <Sun />}
                </div>
                <ul className="flex">
                    <li className="mr-6">
                        <Link href="/">
                            <span className="hover:text-slate-900">Home</span>
                        </Link>
                    </li>
                    <li className="mr-6">
                        <Link href="/analytics">
                            <span className="hover:text-slate-900">
                                Analytics
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Header;
