import React from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

type PropsType = { children: React.ReactNode };

const Layout = ({ children }: PropsType) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
