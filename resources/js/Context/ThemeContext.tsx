import * as React from 'react';
import { PropsWithChildren } from 'react';
import { SunIcon } from '@/Components/shared/icons/SunIcon';
import { MoonIcon } from '@/Components/shared/icons/MoonIcon';

const ThemeContext = React.createContext({} as { ThemeButton: Function });

export function ThemeProvider({ children }: PropsWithChildren) {

    const [theme, setTheme] = React.useState("dark");
    const Icon = theme === "dark" ? MoonIcon : SunIcon;

    React.useEffect(() => {
        const saved_theme = localStorage.getItem("orbio-theme");

        if (!saved_theme) {
            localStorage.setItem("orbio-theme", "dark");
            return;
        }

        if (saved_theme === "light") {
            document.body.classList.remove("dark");
            setTheme(saved_theme);
        }

    }, []);

    function toggle() {

        let new_value = theme === 'light' ? "dark" : "light";

        if (theme === "dark") {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }

        localStorage.removeItem("orbio-theme");
        localStorage.setItem("orbio-theme", new_value);
        setTheme(new_value);
    }

    function ThemeButton() {
        return (
            <button onClick={toggle} type="button" className="text-gray-600 dark:text-white hover:text-green-600 dark:hover:text-green-600 font-medium rounded-lg text-sm p-1 text-center inline-flex items-center mr-2">
                <Icon />
            </button>
        )
    }

    return (
        <ThemeContext.Provider value={{ ThemeButton }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    return React.useContext(ThemeContext);
}