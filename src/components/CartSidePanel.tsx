import clsx from 'clsx';
import { useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { IoMdClose } from 'react-icons/io';
import { SidePane } from 'react-side-pane';

import { StateType, useStore } from '@/lib/store';
import { TokenType } from '@/lib/types';

import Button from '@/components/Button';
import Portal from '@/components/Portal';
import { useThemeContext } from '@/components/ThemeContext';

type ConfettiType = {
  (options?: any): Promise<null> | null;
  reset: any;
};

const CartSidePanel = () => {
  const refConfetti = useRef<(config: any) => void>();
  const { textColor, bgColor } = useThemeContext();
  const {
    tokens: selectedTokens,
    removeToken,
    isCartPanelOpen,
    closeCartPanel,
  }: Partial<StateType> = useStore();

  const handleCloseCartPanel = () => {
    closeCartPanel?.();
  };

  // Lol
  const getConfettiInstance = (confetti: (config: any) => void) => {
    refConfetti.current = confetti;
  };
  const makeShot = (particleRatio: number, opts: object) => {
    refConfetti.current &&
      refConfetti.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
  };
  const fire = () => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

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
            <p>Bellow are the tokens you have selected for purchase.</p>
            <div className='mt-10'>
              {selectedTokens?.map((token: TokenType) => (
                <div key={token.id} className='mb-2 flex flex-row px-1 py-1'>
                  <span className='grow'>
                    {token.id} - {token.name || 'Ghost'}
                  </span>
                  <IoMdClose
                    onClick={() => {
                      removeToken?.(token.id);
                    }}
                  />
                </div>
              ))}
            </div>
            <div>
              <Button variant='primary' onClick={fire}>
                💸 Checkout 💸
              </Button>
            </div>
          </div>
          <ReactCanvasConfetti
            style={{
              position: 'fixed',
              width: '100%',
              zIndex: -1,
            }}
            refConfetti={getConfettiInstance as ConfettiType}
          />
        </>
      </SidePane>
    </Portal>
  );
};

export default CartSidePanel;
