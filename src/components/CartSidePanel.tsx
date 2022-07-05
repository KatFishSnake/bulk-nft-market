import clsx from 'clsx';
import { useMemo } from 'react';
import { IoMdClose } from 'react-icons/io';
import { SidePane } from 'react-side-pane';

import { themeKeys } from '@/lib/constants';
import { StateType, useStore } from '@/lib/store';
import { TokenType } from '@/lib/types';

import Button from '@/components/Button';
import Portal from '@/components/Portal';
import { useThemeContext } from '@/components/ThemeContext';

type CollectionsWithTokensType = {
  [key: string]: {
    name: string;
    tokens: Array<TokenType>;
  };
};

const CartSidePanel = () => {
  const { textColor, bgColor, currentTheme } = useThemeContext();
  const {
    tokens: selectedTokens,
    removeToken,
    isCartPanelOpen,
    closeCartPanel,
    resetCart,
  }: Partial<StateType> = useStore();

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

  const handleCloseCartPanel = () => {
    closeCartPanel?.();
  };

  const handleCartClear = () => {
    resetCart?.();
  };

  // TODO need to improve the UX of the cart

  return (
    <Portal>
      <SidePane
        className={clsx(textColor, `${bgColor}`)}
        open={isCartPanelOpen || false}
        width={50}
        onClose={handleCloseCartPanel}
      >
        <>
          <div className='px-4 pt-6'>
            <h2>Shopping cart</h2>
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
                    (token: TokenType) => (
                      <div key={token.id} className='mb-2 flex flex-row'>
                        <span className='grow'>
                          {token.token_id} - {token.name || 'Ghost'}
                        </span>
                        <IoMdClose
                          onClick={() => {
                            removeToken?.(token.id);
                          }}
                        />
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
            <div className='mt-8'>
              <Button disabled variant='primary'>
                💸 Checkout 💸
              </Button>
              {hasSelectedTokens ? (
                <Button
                  variant='ghost'
                  className='ml-2'
                  isDarkBg={currentTheme === themeKeys.dark}
                  onClick={handleCartClear}
                >
                  Clear cart
                </Button>
              ) : null}
            </div>
          </div>
        </>
      </SidePane>
    </Portal>
  );
};

export default CartSidePanel;
