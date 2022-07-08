import clsx from 'clsx';
import React, { useCallback, useEffect, useState } from 'react';

import { skeletonCardsLoading } from '@/lib/constants';
import { sortListBy } from '@/lib/helper';
import useFetcher from '@/lib/hooks/useFetcher';
import type { CollectionType } from '@/lib/types';

import CollectionsCard from '@/components/CollectionsCard';
import SearchInput from '@/components/SearchInput';
import Skeleton from '@/components/Skeleton';
import { useThemeContext } from '@/components/ThemeContext';

type CollectionsResponseType = {
  collections: Array<CollectionType>;
};

const Collections = () => {
  const { textColor, bgColor } = useThemeContext();
  const [collections, setCollections] = useState<Array<CollectionType>>([]);

  // ! TODO this will sometimes will cycle through items as it is not ordered
  // ! additionally we can load more items with offset and limit, ei. infinite scroll
  const { data, error, loading } =
    useFetcher<CollectionsResponseType>('/api/collections');

  useEffect(() => {
    if (data?.collections) {
      setCollections(sortListBy(data.collections, 'name'));
    }
  }, [data?.collections]);

  const handleOnSearchChange = useCallback(
    (value: string) => {
      if (value === '') {
        setCollections(sortListBy(data?.collections, 'name'));
        return;
      }

      setCollections((previousCollections) =>
        previousCollections.filter((collection) =>
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

  return (
    <main className={clsx(textColor, bgColor, 'grow')}>
      <div className='layout pt-5'>
        <SearchInput onSearchChange={handleOnSearchChange} />
      </div>
      <div className='layout grid grid-cols-1 gap-4 pt-5 pb-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {!loading
          ? collections.map(
              ({ slug, name, short_description, banner_image_url }) => (
                <CollectionsCard
                  key={slug}
                  slug={slug}
                  name={name}
                  shortDescription={short_description}
                  imageUrl={banner_image_url}
                />
              )
            )
          : skeletonCardsLoading.map((index: number) => (
              <Skeleton key={index} className='h-40 rounded-lg shadow-md' />
            ))}
      </div>
    </main>
  );
};

export default Collections;
