import { ConnectButton } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import React from 'react';
import { useAccount } from 'wagmi';

import useIsMounted from '@/lib/hooks/useIsMounted';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import { useThemeContext } from '@/components/ThemeContext';

const HomePage = () => {
  const { textColor, bgColor } = useThemeContext();
  const isMounted = useIsMounted();
  const { isConnected } = useAccount();

  return (
    <Layout>
      <Seo templateTitle='BNFT' />
      <main
        className={clsx(
          textColor,
          bgColor,
          'flex grow items-center justify-center'
        )}
      >
        <section className='max-w-md'>
          <h1 className='mb-3 text-3xl'>Welcome to BNFT app</h1>
          <ul>
            <li>➊ Connect your wallet</li>
            <li>➋ Select a token for a collection</li>
            <li>➌ Add it to your shopping cart</li>
            <li>➍ Bulk or individually buy selected tokens</li>
          </ul>
          <div className='mt-4 text-center'></div>
          <div className='mt-4 text-center'>
            {isMounted() && isConnected ? (
              <ArrowLink
                as={UnstyledLink}
                className='inline-flex items-center text-primary-500'
                href='/collections'
              >
                Proceed to collections
              </ArrowLink>
            ) : (
              <ConnectButton />
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default HomePage;
