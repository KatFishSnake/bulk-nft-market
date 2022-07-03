import clsx from 'clsx';
import type { GetServerSidePropsContext } from 'next';
import * as React from 'react';
import { BiArrowBack } from 'react-icons/bi';

import { getSiteUrl } from '@/lib/helper';
import type { CollectionType } from '@/lib/types';

import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';
import { useThemeContext } from '@/components/ThemeContext';
import Tokens from '@/components/Tokens';

type PropsType = {
  collection: CollectionType;
  collectionContractAddress: string;
};

const CollectionPage = ({
  collection,
  collectionContractAddress,
}: PropsType) => {
  const { textColor, bgColor } = useThemeContext();
  return (
    <Layout>
      <Seo templateTitle='Token' description='Individual token page' />

      <main className={clsx(textColor, bgColor, 'grow')}>
        <div className='layout pt-5'>
          <UnstyledLink href='/' className='flex items-center font-bold'>
            <BiArrowBack className='pr-2 text-2xl' />
            Back to collections
          </UnstyledLink>
        </div>
        <div className='layout flex flex-row pt-5'>
          {collection.banner_image_url?.length ? (
            <NextImage
              src={collection.banner_image_url || ''}
              className='w-24'
              alt={`${collection.name} collection thumbnail picture`}
              width={200}
              height={200}
              layout='responsive'
              objectFit='cover'
            />
          ) : null}
          <div className='ml-4 flex items-center'>
            <h1>{collection.name || 'Ghost collection'}</h1>
          </div>
        </div>
        {collectionContractAddress ? (
          <Tokens collectionContractAddress={collectionContractAddress} />
        ) : (
          <div className='layout pt-5'>
            <p>Collection has no tokens</p>
          </div>
        )}
      </main>
    </Layout>
  );
};

export const getServerSideProps = async ({
  params,
  res,
}: GetServerSidePropsContext) => {
  res?.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  // TODO This is not good, need to probably preserve the collection from the parent route or combine the fetches
  // ! Additionally need to improve error states, investigate how next recommends to do this

  const responseCollection: { collection: CollectionType } = await (
    await fetch(`${getSiteUrl()}/api/collection/${params?.collection_id}`)
  ).json();

  return {
    props: {
      collection: responseCollection?.collection,
      collectionContractAddress:
        responseCollection?.collection?.primary_asset_contracts?.[0]?.address ||
        null,
    },
  };
};

export default CollectionPage;
