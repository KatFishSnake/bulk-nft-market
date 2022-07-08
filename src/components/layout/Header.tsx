import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import useIsMounted from '@/lib/hooks/useIsMounted';
import {
  StateType as CartStoreStateType,
  useCartStore,
} from '@/lib/store/cartStore';
import { StateType as UIStoreStateType, useUIStore } from '@/lib/store/uiStore';

import UnstyledLink from '@/components/links/UnstyledLink';
import { useThemeContext } from '@/components/ThemeContext';

import ThemeToggle from './ThemeToggle';
import { WalletConnectButton } from './WalletConnectButton';

const Header = () => {
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();
  const [localNumberOfSelectedTokens, setLocalNumberOfSelectedTokens] =
    useState(0);
  const { textColor, bgColor } = useThemeContext();
  const { openCartPanel }: Partial<UIStoreStateType> = useUIStore();
  const { tokens: selectedTokens }: Partial<CartStoreStateType> =
    useCartStore();

  const handleOpenCartPanel = () => {
    openCartPanel?.();
  };

  // ? TODO: is there a better way todo this otherwise next complains about after hydration UI mismatch
  useEffect(() => {
    setLocalNumberOfSelectedTokens(selectedTokens?.length || 0);
  }, [selectedTokens?.length]);

  return (
    <header className={clsx('sticky top-0 z-50', bgColor, textColor)}>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink href='/' className='flex items-center font-bold'>
          <span className='pr-2 text-2xl'>🍱</span>BNFT
        </UnstyledLink>
        <nav className='flex'>
          <ul className='flex items-center justify-between space-x-4'>
            {isMounted() && isConnected ? <WalletConnectButton /> : null}
            <li
              key='open-cart-panel'
              onClick={handleOpenCartPanel}
              tabIndex={0}
              onKeyDown={handleOpenCartPanel}
            >
              <span className='cursor-pointer hover:underline'>
                Cart
                {localNumberOfSelectedTokens
                  ? `(${localNumberOfSelectedTokens})`
                  : null}
              </span>
            </li>
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;
