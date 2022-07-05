import { ConnectButton } from '@rainbow-me/rainbowkit';
import clsx from 'clsx';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import { useThemeContext } from '@/components/ThemeContext';

export default function HomePage() {
  const { textColor, bgColor } = useThemeContext();

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
          Welcome to BNFT app, currently you are able to select NFTs for a
          collection, add them to the shopping cart and pretty much it 😝
          <div className='mt-4 text-center'>
            <ConnectButton />
          </div>
          <div className='mt-4 text-center'>
            <ArrowLink
              as={UnstyledLink}
              className='inline-flex items-center text-primary-500'
              href='/collections'
            >
              Proceed to collections
            </ArrowLink>
          </div>
        </section>
      </main>
    </Layout>
  );
}
