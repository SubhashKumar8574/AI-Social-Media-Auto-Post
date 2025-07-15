import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      // Dark theme - Black and Golden
      primary: 'from-gray-900 via-black to-gray-800',
      secondary: 'from-yellow-600 to-amber-500',
      accent: 'bg-yellow-500/20',
      text: 'text-yellow-100',
      textSecondary: 'text-yellow-200',
      textMuted: 'text-gray-400',
      border: 'border-yellow-500/30',
      input: 'bg-black/40 border-yellow-500/30',
      card: 'bg-black/40 backdrop-blur-lg border-yellow-500/20',
      button: 'from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700',
      buttonSecondary: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200',
      icon: 'text-yellow-400',
      success: 'bg-green-500/20 border-green-500/50 text-green-200',
      error: 'bg-red-500/20 border-red-500/50 text-red-200'
    } : {
      // Light theme - Purple mode
      primary: 'from-purple-900 via-purple-800 to-indigo-900',
      secondary: 'from-purple-500 to-indigo-600',
      accent: 'bg-purple-500/20',
      text: 'text-white',
      textSecondary: 'text-purple-200',
      textMuted: 'text-gray-300',
      border: 'border-white/20',
      input: 'bg-white/10 border-white/20',
      card: 'bg-white/10 backdrop-blur-lg border-white/20',
      button: 'from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700',
      buttonSecondary: 'bg-white/20 hover:bg-white/30 text-purple-200',
      icon: 'text-purple-400',
      success: 'bg-green-500/20 border-green-500/50 text-green-200',
      error: 'bg-red-500/20 border-red-500/50 text-red-200'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};