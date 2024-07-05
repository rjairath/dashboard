"use client";

import { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext<any>(null);

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const [theme, setTheme] = useState("");

    useEffect(() => {
        const themeFromLS = window?.localStorage.getItem('theme') || 'light';
        setTheme(themeFromLS);
    }, []);

    const toggleTheme = () => {
        console.log("is toggle called?")
        const isFromDarkTheme = !document.documentElement.classList.toggle("dark");
        const newTheme = isFromDarkTheme ? 'light' : 'dark';
        window.localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider