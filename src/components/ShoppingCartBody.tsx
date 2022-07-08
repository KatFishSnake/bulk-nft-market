import React, { useMemo } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { Web3Provider } from '@ethersproject/providers';
import { OpenSeaPort, Network } from 'opensea-js';

import ShoppingCartBodyControls from '@/components/ShoppingCartBodyControls';
import ShoppingCartBodyTokens from '@/components/ShoppingCartBodyTokens';

export const defaultOfferOnAllAmount = '0.0001';

const ShoppingCartBody = () => {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const seaport = useMemo(() => {
    const web3Provider = signer?.provider as Web3Provider;
    if (!(web3Provider instanceof Web3Provider)) return null;
    return web3Provider?.provider
      ? new OpenSeaPort(web3Provider.provider as any, {
          networkName: (chain?.network as Network) || Network.Rinkeby,
        })
      : null;
  }, [signer, chain]);

  return (
    <div className='h-full overflow-scroll px-4 pt-6 pb-10'>
      <h2>Shopping cart</h2>
      {isConnected ? (
        <>
          <div className='pt-5 text-gray-500'>
            <p>
              Bellow are the tokens you have selected for purchase, grouped by
              collection
            </p>
          </div>
          <ShoppingCartBodyTokens seaportProvider={seaport} />
          <ShoppingCartBodyControls seaportProvider={seaport} />
        </>
      ) : (
        <p className='mt-4'>Please connect your wallet</p>
      )}
    </div>
  );
};

export default ShoppingCartBody;
