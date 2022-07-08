import type { OpenSeaPort } from 'opensea-js';
import { memo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdClose } from 'react-icons/io';

import { ghostName, themeKeys } from '@/lib/constants';
import { StateType, useCartStore } from '@/lib/store/cartStore';

import Button from '@/components/Button';
import UnstyledLink from '@/components/links/UnstyledLink';
import { useThemeContext } from '@/components/ThemeContext';

type PropsType = {
  id: string;
  tokenId: string;
  tokenAddress: string;
  name: string | null;
  walletAddress: string;
  linkToToken: string;
  seaportProvider: OpenSeaPort | null;
};

const ShoppingCartBodyTokensItem = ({
  id,
  tokenId,
  tokenAddress,
  name = ghostName,
  walletAddress,
  linkToToken,
  seaportProvider,
}: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { currentTheme } = useThemeContext();
  const [amount, setAmount] = useState('0.0001');
  const { removeToken }: Partial<StateType> = useCartStore();

  const handleBuyToken = async () => {
    if (!seaportProvider) return null;

    const order = seaportProvider.createBuyOrder({
      asset: {
        tokenId,
        tokenAddress,
      },
      accountAddress: walletAddress,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: amount,
    });

    await toast.promise(order, {
      // TODO hardcoded units = bad
      loading: `Creating an offer of ${amount} WETH for "${name}"`,
      success: <b>🎉 Offer is created! 🎉</b>,
      error: <b>Could not create an offer.</b>,
    });

    removeToken?.(id);
    return order;
  };

  const handleSetAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleRemoveToken = () => {
    removeToken?.(id);
  };

  return (
    <div
      className={`mb-2 flex flex-row rounded border-2 ${
        currentTheme === themeKeys.light ? 'border-gray-300' : 'border-gray-700'
      } pl-2 pr-1 pt-1 pb-2`}
    >
      <div className='flex grow flex-wrap overflow-hidden'>
        <UnstyledLink className='mb-2 w-full grow truncate' href={linkToToken}>
          {tokenId} {name}
        </UnstyledLink>
        <input
          ref={inputRef}
          className='mr-2 max-w-xs grow appearance-none rounded border-none py-2 px-2 text-xs leading-tight shadow focus:outline-none'
          type='text'
          placeholder='0.0001'
          onChange={handleSetAmount}
        />
        <Button
          className='mr-2 border-none py-2 text-xs shadow-none outline-none'
          onClick={handleBuyToken}
        >
          Buy
        </Button>
      </div>
      <Button
        variant='ghost'
        isDarkBg={currentTheme === themeKeys.dark}
        className='flex w-10 flex-col items-center justify-center text-lg'
        onClick={handleRemoveToken}
      >
        <IoMdClose />
      </Button>
    </div>
  );
};

export default memo(ShoppingCartBodyTokensItem);
