import { IoMdClose } from 'react-icons/io';

import { ghostName } from '@/lib/constants';
import { StateType, useStore } from '@/lib/store';
import type { OpenSeaPort } from 'opensea-js';
import Button from '@/components/Button';
import { useState } from 'react';

type PropsType = {
  id: string;
  tokenId: string;
  tokenAddress: string;
  name: string | null;
  walletAddress: string;
  seaportProvider: OpenSeaPort | null;
};

const ShoppingCartBodyTokenItem = ({
  id,
  tokenId,
  tokenAddress,
  name = ghostName,
  walletAddress,
  seaportProvider,
}: PropsType) => {
  const [amount, setAmount] = useState(0);
  const { removeToken }: Partial<StateType> = useStore();

  const handleBuyToken = async () => {
    if (!seaportProvider) return null;

    const order = await seaportProvider.createBuyOrder({
      asset: {
        tokenId,
        tokenAddress,
      },
      accountAddress: walletAddress,
      // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
      startAmount: amount,
    });

    console.log(order);
  };

  const handleSetAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  return (
    <div className='mb-2 flex flex-row px-2 py-1 bg-blend-darken'>
      <span className='w-4 grow truncate'>
        {tokenId} {name}
      </span>
      <input type='text' onChange={handleSetAmount} />
      <Button onClick={handleBuyToken}>Buy</Button>
      <IoMdClose
        onClick={() => {
          removeToken?.(id);
        }}
      />
    </div>
  );
};

export default ShoppingCartBodyTokenItem;
