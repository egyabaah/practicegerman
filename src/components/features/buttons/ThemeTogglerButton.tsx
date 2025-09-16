"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggleButton() {
    const [isDark, setIsDark] = useState(false);

    // On mount, check current theme
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            if (storedTheme === "dark") {
                document.documentElement.classList.add("dark");
                setIsDark(true);
            } else {
                document.documentElement.classList.remove("dark");
                setIsDark(false);
            }
        } else {
            // If localStorage is empty, fallback to system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (prefersDark) {
                document.documentElement.classList.add("dark");
                localStorage.setItem("theme", "dark");
                setIsDark(true);
            } else {
                document.documentElement.classList.remove("dark");
                localStorage.setItem("theme", "light");
                setIsDark(false);
            }
        }
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            html.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle theme"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}