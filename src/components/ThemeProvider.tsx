"use client";

import { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext<any>(null);

const ThemeProvider = ({children}: {children: React.ReactNode}) => {
    const [theme, setTheme] = useState("light");

    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark");
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider