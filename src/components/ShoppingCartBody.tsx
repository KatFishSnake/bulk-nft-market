import { useEffect, useMemo } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';
// import { Web3Provider } from '@ethersproject/providers';
// import { OpenSeaPort, Network } from 'opensea-js';

import { themeKeys } from '@/lib/constants';
import { StateType, useStore } from '@/lib/store';
import { TokenType } from '@/lib/types';

import Button from '@/components/Button';
import ShoppingCartBodyTokenItem from '@/components/ShoppingCartBodyTokenItem';
import { useThemeContext } from '@/components/ThemeContext';

type CollectionsWithTokensType = {
  [key: string]: {
    name: string;
    tokens: Array<TokenType>;
  };
};

const ShoppingCartBody = () => {
  const { isConnected, address } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { currentTheme } = useThemeContext();
  const { tokens: selectedTokens, resetCart }: Partial<StateType> = useStore();

  // const seaport = useMemo(() => {
  //   const web3Provider = signer?.provider as Web3Provider;
  //   if (!(web3Provider instanceof Web3Provider)) return null;
  //   return web3Provider?.provider
  //     ? new OpenSeaPort(web3Provider.provider as any, {
  //         networkName: (chain?.network as Network) || Network.Rinkeby,
  //       })
  //     : null;
  // }, [signer, chain]);

  const seaport = null;

  const hasSelectedTokens = useMemo(
    () => selectedTokens && selectedTokens.length > 0,
    [selectedTokens]
  );

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

  const handleCartClear = () => {
    resetCart?.();
  };

  // TODO need to improve the UX of the cart

  return (
    <div className='px-4 pt-6'>
      <h2>Shopping cart</h2>
      {isConnected ? (
        <>
          <div className='pt-5 text-gray-500'>
            <p>
              Bellow are the tokens you have selected for purchase, grouped by
              collection
            </p>
          </div>
          <div className='mt-10'>
            {collectionKeys.map((collectionKey) => (
              <div key={collectionKey} className='mb-2 flex flex-col'>
                <strong className='mb-2 grow'>
                  {collectionsWithTokens[collectionKey].name}
                </strong>
                {collectionsWithTokens[collectionKey].tokens.map(
                  ({ id, token_id, asset_contract, name }: TokenType) => (
                    <ShoppingCartBodyTokenItem
                      key={id}
                      id={id}
                      tokenId={token_id}
                      tokenAddress={asset_contract.address}
                      // We can guarantee when this ui is shown address is defined
                      walletAddress={address as string}
                      name={name}
                      seaportProvider={seaport}
                    />
                  )
                )}
              </div>
            ))}
          </div>
          <div className='mt-8'>
            {hasSelectedTokens ? (
              <Button
                variant='ghost'
                isDarkBg={currentTheme === themeKeys.dark}
                onClick={handleCartClear}
              >
                Clear cart
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
};

export default ShoppingCartBody;
