import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';

import fetcher from '@/lib/fetcher';
import { sortListBy } from '@/lib/helper';
import type { TokenType } from '@/lib/types';

import SearchInput from '@/components/SearchInput';
import TokenCard from '@/components/TokenCard';

type PropsType = {
  collectionContractAddress: string;
};

type TokensResponseType = {
  assets: Array<TokenType>;
};

const Tokens = ({ collectionContractAddress }: PropsType) => {
  const [tokens, setTokens] = useState<Array<TokenType>>([]);

  // TODO loads only 50 items, add pagination
  const { data, error } = useSWR<TokensResponseType>(
    `/api/collection-assets/${collectionContractAddress}?limit=50&order=desc`,
    fetcher
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
      <div className='layout pt-5'>
        <SearchInput onSearchChange={handleOnSearchChange} />
      </div>
      <div className='layout pt-5 text-gray-500'>
        <p>Click on a token to add it to your cart</p>
      </div>
      <div className='layout grid grid-cols-1 gap-4 pt-5 pb-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
        {tokens.length
          ? tokens.map((token) => <TokenCard token={token} key={token.id} />)
          : 'No tokens found'}
      </div>
    </section>
  );
};

export default Tokens;
