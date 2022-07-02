import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { themeKeys } from '@/lib/constants';
import fetcher from '@/lib/fetcher';
import type { TokenType } from '@/lib/types';

import UnderlineLink from '@/components/links/UnderlineLink';
import SearchInput from '@/components/SearchInput';
import { useThemeContext } from '@/components/ThemeContext';

type PropsType = {
  collectionContractAddress: string;
};

type TokensResponseType = {
  assets: Array<TokenType>;
};

const defaultTokenName = 'Ghost';

const Tokens = ({ collectionContractAddress }: PropsType) => {
  const { bgColor, currentTheme } = useThemeContext();
  const [tokens, setTokens] = useState<Array<TokenType>>([]);

  // TODO loads only 50 items, add pagination
  const { data, error } = useSWR<TokensResponseType>(
    `https://testnets-api.opensea.io/api/v1/assets?asset_contract_address=${collectionContractAddress}&order_direction=desc&offset=0&limit=50&include_orders=false`,
    fetcher
  );

  useEffect(() => {
    if (data?.assets) {
      setTokens(
        [...data.assets].sort((a, b) =>
          (a?.name || '').localeCompare(b?.name || '')
        )
      );
    }
  }, [data?.assets]);

  const handleOnSearchChange = useCallback(
    (value: string) => {
      if (value === '') {
        setTokens(data?.assets || []);
        return;
      }
      setTokens(
        [...tokens].filter((token) =>
          token.name?.toLowerCase().trim()?.includes(value.trim().toLowerCase())
        )
      );
    },
    [data?.assets]
  );

  if (error) return <div>Failed to load</div>;
  if (!tokens) return <div>Loading...</div>;

  return (
    <section>
      <div className='container mx-auto pt-5'>
        <SearchInput onSearchChange={handleOnSearchChange} />
      </div>
      <div className='container mx-auto grid grid-cols-1 gap-4 pt-10 pb-10 md:grid-cols-3 xl:grid-cols-4'>
        {tokens.length
          ? tokens.map(
              ({
                id,
                name,
                description,
                image_thumbnail_url,
                image_url,
                permalink,
              }) => (
                <div
                  key={id}
                  className={`flex cursor-pointer flex-col rounded-lg border ${bgColor} bg-white shadow-md ${
                    currentTheme === themeKeys.dark
                      ? 'dark:hover:bg-gray-700'
                      : 'hover:bg-gray-100'
                  }  dark:border-gray-700  `}
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
                    <UnderlineLink href={permalink} className='mb-2'>
                      <h5
                        className='text-lg font-bold tracking-tight'
                        title={name || defaultTokenName}
                      >
                        {name || defaultTokenName}
                      </h5>
                    </UnderlineLink>

                    <p
                      className='font-normal text-gray-700 dark:text-gray-400'
                      title={description || ''}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              )
            )
          : 'No tokens found'}
      </div>
    </section>
  );
};

export default Tokens;
