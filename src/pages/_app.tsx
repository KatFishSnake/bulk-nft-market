import {
  lightTheme,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { AppProps } from 'next/app';
import { useMemo } from 'react';
import { WagmiConfig } from 'wagmi';
import { Toaster } from 'react-hot-toast';

import '@/styles/globals.css';

import connectorTools from '@/lib/chainConnector';
import { themeKeys } from '@/lib/constants';
import {
  Provider as CartStateProvider,
  useCreateCartStore,
} from '@/lib/store/cartStore';
import {
  Provider as UIStateProvider,
  useCreateUIStore,
} from '@/lib/store/uiStore';

import CartSidePanel from '@/components/ShoppingCart';
import { ThemeProvider, useThemeContext } from '@/components/ThemeContext';

function ThemedAppWrapper({ Component, pageProps }: AppProps) {
  const createCartStore = useCreateCartStore(pageProps.initialZustandState);
  const createUIStore = useCreateUIStore(pageProps.initialZustandState);
  const { currentTheme } = useThemeContext();

  // TODO ideally would respond to theme changes, needs to be reloaded right now
  const rainbowKitTheme = useMemo(() => {
    const themeConfig = {
      accentColor: '#f97315',
    };
    return currentTheme === themeKeys.dark
      ? midnightTheme(themeConfig)
      : lightTheme(themeConfig);
  }, [currentTheme]);
  return (
    <WagmiConfig client={connectorTools.wagmiClient}>
      <RainbowKitProvider
        chains={connectorTools.chains}
        theme={rainbowKitTheme}
      >
        <UIStateProvider createStore={createUIStore}>
          <CartStateProvider createStore={createCartStore}>
            <ThemeProvider>
              <Component {...pageProps} />
              <CartSidePanel />
              <Toaster
                position='top-center'
                toastOptions={{
                  // Default options for toasts
                  duration: 3000,
                  style: {
                    background:
                      currentTheme === themeKeys.dark ? '#363636' : '#f6f7f8',
                    color: currentTheme === themeKeys.dark ? '#fff' : '#000',
                  },
                }}
              />
            </ThemeProvider>
          </CartStateProvider>
        </UIStateProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function App(props: AppProps) {
  return (
    <ThemeProvider>
      <ThemedAppWrapper {...props} />
    </ThemeProvider>
  );
}

export default App;
