import React, { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { OpenSeaPort } from 'opensea-js';

import { StateType, useCartStore } from '@/lib/store/cartStore';
import { TokenType } from '@/lib/types';

import ShoppingCartBodyTokenItem from '@/components/ShoppingCartBodyTokensItem';

export const defaultOfferOnAllAmount = '0.0001';

type CollectionsWithTokensType = {
  [key: string]: {
    name: string;
    tokens: Array<TokenType>;
  };
};

type PropsType = {
  seaportProvider: OpenSeaPort | null;
};

const ShoppingCartBodyTokens = ({ seaportProvider }: PropsType) => {
  const { address } = useAccount();
  const { tokens: selectedTokens }: Partial<StateType> = useCartStore();

  const collectionsWithTokens = useMemo(
    () =>
      (selectedTokens || []).reduce(
        (obj: CollectionsWithTokensType, token: TokenType) => {
          const collectionSlug = token?.collection?.slug || 'others';
          const collectionName = token?.collection?.name || 'Others';
          if (obj[collectionSlug]) obj[collectionSlug].tokens.push(token);
          else obj[collectionSlug] = { name: collectionName, tokens: [token] };
          return obj;
        },
        {}
      ),
    [selectedTokens]
  );

  const collectionKeys = useMemo(
    () => Object.keys(collectionsWithTokens),
    [collectionsWithTokens]
  );

  return (
    <div className='mt-10'>
      {collectionKeys.map((collectionKey) => (
        <div key={collectionKey} className='mb-2 flex flex-col'>
          <strong className='mb-2 grow'>
            {collectionsWithTokens[collectionKey].name}
          </strong>
          {collectionsWithTokens[collectionKey].tokens.map(
            ({ id, token_id, asset_contract, name, permalink }: TokenType) => (
              <ShoppingCartBodyTokenItem
                key={id}
                id={id}
                tokenId={token_id}
                tokenAddress={asset_contract.address}
                // We can guarantee when this ui is shown address is defined
                walletAddress={address as string}
                linkToToken={permalink}
                name={name}
                seaportProvider={seaportProvider}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default ShoppingCartBodyTokens;
