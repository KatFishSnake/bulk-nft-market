import * as React from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/header/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
