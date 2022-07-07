import { IoMdClose } from 'react-icons/io';
import { utils } from 'ethers';
import { ItemType } from '@opensea/seaport-js/lib/constants';

import { ghostName } from '@/lib/constants';
import { StateType, useStore } from '@/lib/store';
import type { Seaport } from '@opensea/seaport-js';
import Button from '@/components/Button';
import { useState } from 'react';

type PropsType = {
  id: string;
  tokenId: string;
  tokenAddress: string;
  name: string | null;
  walletAddress: string;
  seaportProvider: Seaport | null;
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
    const { executeAllActions } = await seaportProvider.createOrder(
      {
        offer: [
          {
            itemType: ItemType.ERC721,
            token: tokenAddress,
            identifier: tokenId,
          },
        ],
        consideration: [
          {
            amount: utils.parseEther('0.000001').toString(),
            recipient: walletAddress,
          },
        ],
      },
      walletAddress
    );
    const order = await executeAllActions();
    const { executeAllActions: executeAllFulfillActions } =
      await seaportProvider.fulfillOrder({
        order,
        accountAddress: walletAddress,
      });
    const transaction = await executeAllFulfillActions();
    console.log(transaction);
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
