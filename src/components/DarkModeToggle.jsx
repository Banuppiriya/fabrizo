import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';


const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);

  // Sync theme on mount and when system theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    root.style.colorScheme = isDark ? 'dark' : 'light';
    // Force a re-render for all components (for Tailwind dark classes)
    window.dispatchEvent(new Event('resize'));
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        setIsDark(media.matches);
      }
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="text-[#F2E1C1] hover:text-gray-300 transition duration-300"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default DarkModeToggle;
