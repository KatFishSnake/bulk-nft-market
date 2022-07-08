import clsx from 'clsx';
import { SidePane } from 'react-side-pane';

import { StateType, useUIStore } from '@/lib/store/uiStore';

import Portal from '@/components/Portal';
import ShoppingCartBody from '@/components/ShoppingCartBody';
import { useThemeContext } from '@/components/ThemeContext';

const ShoppingCart = () => {
  const { textColor, bgColor } = useThemeContext();
  const { isCartPanelOpen, closeCartPanel }: Partial<StateType> = useUIStore();

  const handleCloseCartPanel = () => {
    closeCartPanel?.();
  };

  return (
    <Portal>
      <SidePane
        className={clsx(textColor, `${bgColor}`)}
        open={isCartPanelOpen || false}
        width={50}
        onClose={handleCloseCartPanel}
      >
        <ShoppingCartBody />
      </SidePane>
    </Portal>
  );
};

export default ShoppingCart;
