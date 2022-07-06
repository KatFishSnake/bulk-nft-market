import { IoMdClose } from 'react-icons/io';

import { ghostName } from '@/lib/constants';
import { StateType, useStore } from '@/lib/store';

type PropsType = {
  id: string;
  inCollectionTokenId: string;
  name: string | null;
};

const ShoppingCartBodyTokenItem = ({
  id,
  inCollectionTokenId,
  name = ghostName,
}: PropsType) => {
  const { removeToken }: Partial<StateType> = useStore();
  return (
    <div className='mb-2 flex flex-row px-2 py-1 bg-blend-darken'>
      <span className='w-4 grow truncate'>
        {inCollectionTokenId} {name}
      </span>
      <IoMdClose
        onClick={() => {
          removeToken?.(id);
        }}
      />
    </div>
  );
};

export default ShoppingCartBodyTokenItem;
