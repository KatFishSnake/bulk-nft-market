import * as React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import type { GetServerSidePropsContext } from 'next';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { CollectionType } from '@/lib/types';
import { useThemeContext } from '@/components/ThemeContext';
import clsx from 'clsx';
import Tokens from '@/components/Tokens';
import UnstyledLink from '@/components/links/UnstyledLink';

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
        <div className='container mx-auto pt-5'>
          <UnstyledLink href='/' className='flex items-center font-bold'>
            <BiArrowBack className='pr-2 text-2xl' />
            Back to collections
          </UnstyledLink>
        </div>
        <div className='container mx-auto pt-5'>{collection.name}</div>
        <Tokens collectionContractAddress={collectionContractAddress} />
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

  const responseCollection: { collection: CollectionType } = await (
    await fetch(
      `https://testnets-api.opensea.io/api/v1/collection/${params?.collectionid}`
    )
  ).json();

  return {
    props: {
      collection: responseCollection,
      collectionContractAddress:
        responseCollection?.collection?.primary_asset_contracts?.[0]?.address,
    },
  };
};

export default CollectionPage;
