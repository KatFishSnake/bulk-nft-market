import clsx from 'clsx';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';

import useFetcher from '@/lib/hooks/useFetcher';
import type { CollectionType } from '@/lib/types';

import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';
import { useThemeContext } from '@/components/ThemeContext';
import Tokens from '@/components/CollectionTokens';
import Skeleton from '@/components/Skeleton';

type CollectionsResponseType = { collection: CollectionType };

const Collection = () => {
  const router = useRouter();
  const { collection_id } = router.query;

  const { textColor, bgColor } = useThemeContext();

  const { data, error, loading } = useFetcher<CollectionsResponseType>(
    `/api/collection/${collection_id}`
  );

  const collection = data?.collection;
  const collectionContractAddress =
    collection?.primary_asset_contracts?.[0]?.address || null;

  // TODO this is bad, ideally will fix the server
  if (error) return <div>Failed to load collection</div>;

  return (
    <main className={clsx(textColor, bgColor, 'grow')}>
      <div className='layout pt-5'>
        <UnstyledLink
          href='/collections'
          className='flex items-center font-bold'
        >
          <BiArrowBack className='pr-2 text-2xl' />
          Back to collections
        </UnstyledLink>
      </div>
      {!loading && !error?.isThrottled ? (
        <>
          <div className='layout flex flex-row pt-5'>
            {collection?.banner_image_url?.length ? (
              <NextImage
                src={collection.banner_image_url || ''}
                className='mr-4 w-24'
                alt={`${collection.name} collection thumbnail picture`}
                width={200}
                height={200}
                layout='responsive'
                objectFit='cover'
              />
            ) : null}
            <div className='flex items-center'>
              <h1>{collection?.name || 'Ghost collection'}</h1>
            </div>
          </div>
          {collectionContractAddress ? (
            <Tokens collectionContractAddress={collectionContractAddress} />
          ) : (
            <div className='layout pt-5'>
              <p>Collection has no tokens</p>
            </div>
          )}
        </>
      ) : (
        <div className='layout flex flex-row items-center pt-5'>
          <Skeleton className='h-24 w-24 rounded-lg shadow-md' />
          <Skeleton className='ml-4 h-12 w-full rounded-lg shadow-md' />
        </div>
      )}
    </main>
  );
};

export default Collection;
