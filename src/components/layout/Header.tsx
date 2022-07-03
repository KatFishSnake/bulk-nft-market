import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { StateType, useStore } from '@/lib/store';

import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import { useThemeContext } from '@/components/ThemeContext';

import ThemeToggle from './ThemeToggle';

const links = [
  { href: '/components', label: 'Components' },
  { href: '/profile', label: 'Profile' },
];

const Header = () => {
  const [localNumberOfSelectedTokens, setLocalNumberOfSelectedTokens] =
    useState(0);
  const { textColor, bgColor } = useThemeContext();
  const { openCartPanel, tokens: selectedTokens }: Partial<StateType> =
    useStore();

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
          <span className='pr-2 text-2xl'>🍱</span>BNFT Marketplace
        </UnstyledLink>
        <nav className='flex'>
          <ul className='flex items-center justify-between space-x-4'>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnderlineLink href={href}>{label}</UnderlineLink>
              </li>
            ))}
            <li key='open-cart-panel' onClick={handleOpenCartPanel}>
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
