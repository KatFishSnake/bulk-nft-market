import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { ThemeProvider } from '@/components/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
