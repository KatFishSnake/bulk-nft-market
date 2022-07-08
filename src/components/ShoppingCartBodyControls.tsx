import type { OpenSeaPort } from 'opensea-js';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';

import { themeKeys } from '@/lib/constants';
import { StateType, useCartStore } from '@/lib/store/cartStore';
import { TokenType } from '@/lib/types';

import Button from '@/components/Button';
import { useThemeContext } from '@/components/ThemeContext';

export const defaultOfferOnAllAmount = '0.0001';

type PropsType = {
  seaportProvider: OpenSeaPort | null;
};

const ShoppingCartBodyControls = ({ seaportProvider }: PropsType) => {
  const { address } = useAccount();
  const { currentTheme } = useThemeContext();
  const [allAmount, setAllAmount] = useState(defaultOfferOnAllAmount);
  const { tokens: selectedTokens, resetCart }: Partial<StateType> =
    useCartStore();

  const hasSelectedTokens = useMemo(
    () => selectedTokens && selectedTokens.length > 0,
    [selectedTokens]
  );

  const handleCartClear = () => {
    resetCart?.();
  };

  const handleSetAllAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAllAmount(e.target.value);
  };

  const buyTokensInSequence = async (
    updatedList: Array<TokenType> = selectedTokens as Array<TokenType>
  ) => {
    if (updatedList.length === 0) return null;

    const firstToken = updatedList[0];
    await seaportProvider?.createBuyOrder({
      asset: {
        tokenId: firstToken.token_id,
        tokenAddress: firstToken.asset_contract.address,
      },
      accountAddress: address as string,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: allAmount,
    });

    await buyTokensInSequence(updatedList.slice(1));
  };

  const handleBuyAll = async () => {
    toast('Creating offers on all tokens ...', {
      duration: 1000,
    });

    await buyTokensInSequence();
    resetCart?.();

    toast('Offers created for all selected tokens!', {
      icon: '🎉',
    });
  };

  // TODO need to improve the UX of the cart

  return (
    <div className='mt-8'>
      {hasSelectedTokens ? (
        <>
          <div className='mb-4'>
            <label>
              <p className='pb-2 text-xs text-gray-500'>
                Buy all tokens for a price:
              </p>
              <input
                className='mr-2 max-w-xs grow appearance-none rounded border-none py-2 px-2 text-xs leading-tight shadow focus:outline-none'
                type='text'
                placeholder={defaultOfferOnAllAmount}
                onChange={handleSetAllAmount}
              />
              <Button
                variant='primary'
                isDarkBg={currentTheme === themeKeys.dark}
                onClick={handleBuyAll}
                className='mr-2 border-none py-2 text-xs shadow-none outline-none'
              >
                Buy all
              </Button>
            </label>
          </div>
          <Button
            variant='ghost'
            isDarkBg={currentTheme === themeKeys.dark}
            onClick={handleCartClear}
            className='text-xs'
          >
            Clear cart
          </Button>
        </>
      ) : (
        <p>No tokens found</p>
      )}
    </div>
  );
};

export default ShoppingCartBodyControls;
