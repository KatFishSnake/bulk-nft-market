import * as React from 'react';

import UnderlineLink from '@/components/links/UnderlineLink';
import { useThemeContext } from '@/components/ThemeContext';
import clsx from 'clsx';

export default function Footer() {
  const { textColor, bgColor } = useThemeContext();
  return (
    <footer className={clsx('h-10 pt-2 text-center', textColor, bgColor)}>
      © {new Date().getFullYear()} By{' '}
      <UnderlineLink href='https://curio.tools'>
        Andre & Curio team
      </UnderlineLink>
    </footer>
  );
}
