import React, { useCallback, useEffect, useState } from 'react';

import { skeletonCardsLoading } from '@/lib/constants';
import { sortListBy } from '@/lib/helper';
import useFetcher from '@/lib/hooks/useFetcher';
import type { TokenType } from '@/lib/types';

import TokenCard from '@/components/CollectionTokensCard';
import SearchInput from '@/components/SearchInput';
import Skeleton from '@/components/Skeleton';

type PropsType = {
  collectionContractAddress: string;
};

type TokensResponseType = {
  assets: Array<TokenType>;
};

const Tokens = ({ collectionContractAddress }: PropsType) => {
  const [tokens, setTokens] = useState<Array<TokenType>>([]);

  // TODO loads only 50 items, add pagination
  const { data, error, loading } = useFetcher<TokensResponseType>(
    `/api/collection-assets/${collectionContractAddress}?limit=50&order=desc`
  );

  useEffect(() => {
    if (data?.assets) {
      setTokens(sortListBy(data.assets, 'name'));
    }
  }, [data?.assets]);

  const handleOnSearchChange = useCallback(
    (value: string) => {
      if (value === '') {
        setTokens(sortListBy(data?.assets, 'name'));
        return;
      }
      setTokens((previousTokens) =>
        [...previousTokens].filter((token) =>
          token.name?.toLowerCase().trim()?.includes(value.trim().toLowerCase())
        )
      );
    },
    [data?.assets]
  );

  if (error) return <div>Failed to load token list</div>;
  if (loading)
    return (
      <div className='layout grid grid-cols-1 gap-4 pt-5 pt-5 pb-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {skeletonCardsLoading.map((index: number) => (
          <Skeleton key={index} className='h-40 rounded-lg shadow-md' />
        ))}
      </div>
    );

  return (
    <section>
      <div className='layout pt-5'>
        <SearchInput onSearchChange={handleOnSearchChange} />
      </div>
      <div className='layout pt-5 text-gray-500'>
        <p>Click on a token to add it to your cart</p>
      </div>
      <div className='layout grid grid-cols-1 gap-4 pt-5 pb-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {tokens.length
          ? tokens.map((token) => <TokenCard key={token.id} token={token} />)
          : 'No tokens found'}
      </div>
    </section>
  );
};

export default Tokens;
