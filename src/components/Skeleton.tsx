import React from 'react';

import { themeKeys } from '@/lib/constants';
import { clsxm } from '@/lib/helper';

import { useThemeContext } from '@/components/ThemeContext';

type SkeletonProps = React.ComponentPropsWithoutRef<'div'>;

const Skeleton = ({ className, ...rest }: SkeletonProps) => {
  const { currentTheme } = useThemeContext();
  return (
    <div
      className={clsxm(
        'animate-shimmer',
        currentTheme === themeKeys.light ? 'bg-[#f6f7f8]' : 'bg-[#2C2C2C]',
        className
      )}
      style={{
        backgroundImage:
          currentTheme === themeKeys.light
            ? 'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)'
            : 'linear-gradient(to right, #444444 0%, #393939 20%, #2C2C2C 40%, #222222 100%)',
        backgroundSize: '700px 100%',
        backgroundRepeat: 'no-repeat',
      }}
      {...rest}
    />
  );
};

export default Skeleton;
