import { useEffect, useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';

// import { Seaport } from '@opensea/seaport-js';
// import { utils, ethers } from 'ethers';
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
  const { chain } = useNetwork();
  const { currentTheme } = useThemeContext();
  const { tokens: selectedTokens, resetCart }: Partial<StateType> = useStore();

  // ! TEST DATA
  useEffect(() => {
    console.log(address, chain);
    // const provider = ethers.getDefaultProvider(chain?.network, {
    //   infura: '1c8d6e93db1a486b85bb72459efde7d5',
    // });
    // const accounts = await window.ethereum.enable();
    // console.log(window.ethereum);
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const infuraRpcSubprovider = new RPCSubprovider({
    //   rpcUrl: `https://${
    //     chain?.network
    //   }.infura.io/v3/${'1c8d6e93db1a486b85bb72459efde7d5'}`,
    // });
    // const providerEngine = new Web3ProviderEngine();
    // if (window.ethereum) {
    //   providerEngine.addProvider(new SignerSubprovider(window.ethereum));
    // }
    // providerEngine.addProvider(mnemonicWalletSubprovider);
    // providerEngine.addProvider(infuraRpcSubprovider);
    // providerEngine.start();
    // let engine = new JsonRpcEngine();
    // const seaport = new Seaport(provider);
    // const provider = new ethers.providers.InfuraProvider(
    //   'rinkeby',
    //   '1c8d6e93db1a486b85bb72459efde7d5'
    // );
    // console.log(seaport);
    // const offerer = '0xbF2E37A9805bf0f33C5F82f8d3f3D3931b189bAC';
    // (async () => {
    //   const { executeAllActions } = await seaport.createOrder({
    //     offer: [
    //       {
    //         amount: utils.parseEther('0.001').toString(),
    //         // WETH
    //         token: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    //       },
    //     ],
    //     consideration: [
    //       {
    //         itemType: 2, // ItemType.ERC721
    //         // my custom token
    //         token: '0x4a9e2e6caf3d84dc2771d5509f40a87cb6ae6a7d',
    //         identifier: '1',
    //         recipient: offerer,
    //       },
    //     ],
    //   });
    //   const order = await executeAllActions();
    //   const { executeAllActions: executeAllFulfillActions } =
    //     await seaport.fulfillOrder({
    //       order,
    //       accountAddress: address,
    //     });
    //   const transaction = await executeAllFulfillActions();
    //   console.log(transaction);
    // })();
  }, []);

  console.log('isConnected', isConnected);

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
                  ({ id, token_id, name }: TokenType) => (
                    <ShoppingCartBodyTokenItem
                      key={id}
                      id={id}
                      inCollectionTokenId={token_id}
                      name={name}
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
