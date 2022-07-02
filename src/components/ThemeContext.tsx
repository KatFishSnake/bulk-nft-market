import { createContext, ReactNode, useContext, useMemo } from 'react';

import { themeKeys } from '@/lib/constants';
import useLocalStorage from '@/lib/hooks/useLocalStorage';

type PropsType = {
  children: ReactNode;
};

const defaultContextValue = {
  currentTheme: themeKeys.light,
  toggleTheme: function doNothing() {
    // do nothing.
  },
  // Light theme
  textColor: 'text-gray-600',
  bgColor: 'bg-gray-50',
};

const ThemeContext = createContext(defaultContextValue);
ThemeContext.displayName = 'BNFT.ThemeContext';

const THEME_LS_KEY = 'bnft-theme';

export const ThemeProvider = ({ children }: PropsType) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage(
    THEME_LS_KEY,
    defaultContextValue.currentTheme
  );

  const toggleTheme = () => {
    const themeKey =
      currentTheme === themeKeys.light ? themeKeys.dark : themeKeys.light;
    setCurrentTheme(themeKey);
  };

  const contextValue = useMemo(
    () => ({
      currentTheme,
      toggleTheme,
      textColor:
        currentTheme === themeKeys.dark ? 'text-gray-300' : 'text-gray-600',
      bgColor: currentTheme === themeKeys.dark ? 'bg-dark' : 'bg-gray-50',
    }),
    [currentTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
