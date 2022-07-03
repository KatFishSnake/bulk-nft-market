import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { Provider, useCreateStore } from '@/lib/store';

import CartSidePanel from '@/components/CartSidePanel';
import { ThemeProvider } from '@/components/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  const createStore = useCreateStore(pageProps.initialZustandState);
  return (
    <Provider createStore={createStore}>
      <ThemeProvider>
        <Component {...pageProps} />
        <CartSidePanel />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
