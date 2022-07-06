import Image from 'next/image';
import React, { memo } from 'react';

import { ghostName, themeKeys } from '@/lib/constants';

import UnstyledLink from '@/components/links/UnstyledLink';
import { useThemeContext } from '@/components/ThemeContext';

type PropsType = {
  slug: string;
  name: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
};

const CollectionsCard = ({
  slug,
  name = ghostName,
  shortDescription,
  imageUrl,
}: PropsType) => {
  const { bgColor, currentTheme } = useThemeContext();

  return (
    <UnstyledLink
      href={`/collection/${slug}`}
      className={`flex flex-col rounded-lg border ${bgColor} shadow-md ${
        currentTheme === themeKeys.dark
          ? 'dark:hover:bg-gray-700'
          : 'hover:bg-gray-100'
      }  dark:border-gray-700  `}
    >
      {imageUrl ? (
        <div className='relative h-24 w-full rounded-t-lg md:h-48'>
          <Image
            className='rounded-t-lg md:h-48'
            src={imageUrl}
            alt={`Collection banner image for ${name}`}
            layout='fill'
            objectFit='cover'
          />
        </div>
      ) : null}
      <div className='flex flex-col justify-between p-4 leading-normal'>
        <h5 className='self-start break-all text-lg font-bold tracking-tight'>
          {name}
        </h5>
        {shortDescription ? (
          <p
            className='mt-2 font-normal text-gray-700 dark:text-gray-400'
            title={shortDescription}
          >
            {shortDescription}
          </p>
        ) : null}
      </div>
    </UnstyledLink>
  );
};

export default memo(CollectionsCard);
