import Image from 'next/image';
import React, { memo, useMemo } from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';

import { ghostName, themeKeys } from '@/lib/constants';
import { StateType, useCartStore } from '@/lib/store/cartStore';
import type { TokenType } from '@/lib/types';

import UnderlineLink from '@/components/links/UnderlineLink';
import { useThemeContext } from '@/components/ThemeContext';

type PropsType = {
  token: TokenType;
};

// TODO do not inject token here, use primitives
const TokensCard = ({ token }: PropsType) => {
  const { tokens: selectedTokens, toggleToken }: Partial<StateType> =
    useCartStore();
  const { bgColor, currentTheme } = useThemeContext();

  const { image_thumbnail_url, image_url, permalink, name, description } =
    token;

  const isSelected = useMemo(
    () =>
      selectedTokens?.some(
        (selectedToken: TokenType) => selectedToken.id === token.id
      ),
    [selectedTokens, token]
  );

  const handleToggleToken = () => {
    toggleToken?.(token);
  };

  return (
    <div
      className={`flex cursor-pointer flex-col rounded-lg border ${bgColor} shadow-md ${
        currentTheme === themeKeys.dark
          ? 'dark:hover:bg-gray-700'
          : 'hover:bg-gray-100'
      }  dark:border-gray-700  `}
      onClick={handleToggleToken}
      onKeyDown={handleToggleToken}
      tabIndex={0}
    >
      {image_thumbnail_url || image_url ? (
        <div className='relative h-24 w-full rounded-t-lg md:h-48'>
          <Image
            className='rounded-t-lg md:h-48'
            src={`/api/imageProxy?url=${encodeURIComponent(
              image_thumbnail_url || image_url || ''
            )}`}
            alt={`Collection banner image for ${name}`}
            layout='fill'
            objectFit='cover'
          />
        </div>
      ) : null}
      <div className='flex flex-col justify-between p-4 leading-normal'>
        <div className='mb-2'>
          <UnderlineLink href={permalink} className='mb-0 self-start'>
            <h5
              className='text-lg font-bold tracking-tight'
              title={name || ghostName}
            >
              {isSelected ? (
                <IoMdCheckmarkCircle className='mr-2 inline text-xl text-primary-500' />
              ) : null}
              {name || ghostName}
            </h5>
          </UnderlineLink>
        </div>

        <p
          className='font-normal text-gray-700 line-clamp-2 dark:text-gray-400'
          title={description || ''}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default memo(TokensCard);
