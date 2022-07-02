import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { useThemeContext } from '@/components/ThemeContext';
import clsx from 'clsx';

export default function HomePage() {
  const { textColor, bgColor } = useThemeContext();
  return (
    <Layout>
      <Seo templateTitle='BNFT' />
      <main className={clsx(textColor, bgColor, 'grow')}>
        <div className='layout flex h-64 flex-col items-center justify-center text-center'>
          <h1 className='mt-4'>
            <span className='text-2xl'>🚧</span> Workin ...{' '}
            <span className='text-2xl'>🚧</span>
          </h1>
        </div>
      </main>
    </Layout>
  );
}
