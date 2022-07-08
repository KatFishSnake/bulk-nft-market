import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from 'react';

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

export const CustomThemeProvider = ({ children }: PropsType) => {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useLocalStorage(
    THEME_LS_KEY,
    defaultContextValue.currentTheme
  );

  const toggleTheme = useCallback(() => {
    const themeKey =
      currentTheme === themeKeys.light ? themeKeys.dark : themeKeys.light;

    // TODO eventually migrate onto this guy
    // Set next-themes theme
    setTheme(themeKey);

    // Set internal custom context for theme
    setCurrentTheme(themeKey);
  }, [currentTheme, setTheme, setCurrentTheme]);

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

export const ThemeProvider = ({ children }: PropsType) => (
  <NextThemeProvider defaultTheme='light'>
    <CustomThemeProvider>{children}</CustomThemeProvider>
  </NextThemeProvider>
);

export const useThemeContext = () => useContext(ThemeContext);
