import * as React from 'react';
import clsx from 'clsx';

import UnderlineLink from '@/components/links/UnderlineLink';
import { useThemeContext } from '@/components/ThemeContext';

const Footer = () => {
  const { textColor, bgColor } = useThemeContext();
  return (
    <footer className={clsx('h-10 pt-2 text-center', textColor, bgColor)}>
      © {new Date().getFullYear()} By{' '}
      <UnderlineLink href='https://curio.tools'>
        Andre & Curio team
      </UnderlineLink>
    </footer>
  );
};

export default Footer;
