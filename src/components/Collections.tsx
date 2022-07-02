import clsx from 'clsx';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import { themeKeys } from '@/lib/constants';
import fetcher from '@/lib/fetcher';
import type { CollectionType } from '@/lib/types';

import UnstyledLink from '@/components/links/UnstyledLink';
import SearchInput from '@/components/SearchInput';
import { useThemeContext } from '@/components/ThemeContext';

type CollectionsResponseType = {
  collections: Array<CollectionType>;
};

const Collections = () => {
  const { textColor, bgColor, currentTheme } = useThemeContext();
  const [collections, setCollections] = useState<Array<CollectionType>>([]);
  const { data, error } = useSWR<CollectionsResponseType>(
    'https://testnets-api.opensea.io/api/v1/collections?offset=0&limit=300',
    fetcher
  );

  useEffect(() => {
    if (data?.collections) {
      setCollections(
        data.collections.sort((a, b) =>
          (a?.name || '').localeCompare(b?.name || '')
        )
      );
    }
  }, [data?.collections]);

  const handleOnSearchChange = useCallback(
    (value: string) => {
      if (value === '') {
        setCollections(data?.collections || []);
        return;
      }
      setCollections(
        collections.filter((collection) =>
          collection.name
            ?.toLowerCase()
            .trim()
            ?.includes(value.trim().toLowerCase())
        )
      );
    },
    [data?.collections]
  );

  if (error) return <div>Failed to load</div>;
  if (!collections) return <div>Loading...</div>;

  return (
    <main className={clsx(textColor, bgColor, 'grow')}>
      <div className='container mx-auto pt-5'>
        <SearchInput onSearchChange={handleOnSearchChange} />
      </div>
      <div className='container mx-auto grid grid-cols-1 gap-4 pt-10 pb-10 md:grid-cols-3 xl:grid-cols-4'>
        {collections?.length ? (
          collections.map(
            ({ slug, name, short_description, banner_image_url }) => (
              <UnstyledLink
                key={slug}
                href={`/collection/${slug}`}
                className={`flex flex-col rounded-lg border ${bgColor} bg-white shadow-md ${
                  currentTheme === themeKeys.dark
                    ? 'dark:hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }  dark:border-gray-700  `}
              >
                {banner_image_url ? (
                  <div className='relative h-24 w-full rounded-t-lg md:h-48'>
                    <Image
                      className='rounded-t-lg md:h-48'
                      src={banner_image_url}
                      alt={`Collection banner image for ${name}`}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                ) : null}
                <div className='flex flex-col justify-between p-4 leading-normal'>
                  <h5
                    className='break-all text-lg font-bold tracking-tight'
                    title={name || ''}
                  >
                    {name}
                  </h5>
                  {short_description ? (
                    <p
                      className='mt-2 font-normal text-gray-700 dark:text-gray-400'
                      title={short_description || ''}
                    >
                      {short_description}
                    </p>
                  ) : null}
                </div>
              </UnstyledLink>
            )
          )
        ) : (
          <p>No collections</p>
        )}
      </div>
    </main>
  );
};

export default Collections;
