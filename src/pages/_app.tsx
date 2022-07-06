import {
  lightTheme,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { AppProps } from 'next/app';
import { useMemo } from 'react';
import { WagmiConfig } from 'wagmi';

import '@/styles/globals.css';

import connectorTools from '@/lib/chainConnector';
import { themeKeys } from '@/lib/constants';
import { Provider as UIStateProvider, useCreateStore } from '@/lib/store';

import CartSidePanel from '@/components/ShoppingCartSidePanel';
import { ThemeProvider, useThemeContext } from '@/components/ThemeContext';

function ThemedAppWrapper({ Component, pageProps }: AppProps) {
  const createStore = useCreateStore(pageProps.initialZustandState);
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
        <UIStateProvider createStore={createStore}>
          <ThemeProvider>
            <Component {...pageProps} />
            <CartSidePanel />
          </ThemeProvider>
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
