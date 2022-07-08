import { useLayoutEffect } from 'react';
import create, { UseBoundStore } from 'zustand';
import createContext from 'zustand/context';

export type StateType = ReturnType<typeof getDefaultInitialState>;
type UseStoreStateType = typeof initializeStore extends (
  ...args: never
) => UseBoundStore<infer T>
  ? T
  : never;

const getDefaultInitialState = () => ({
  isCartPanelOpen: false,
  openCartPanel: () => {},
  closeCartPanel: () => {},
});

export const initializeStore = (preloadedState = {}) =>
  create((set) => ({
    ...getDefaultInitialState(),
    ...preloadedState,

    openCartPanel: () => {
      set({ isCartPanelOpen: true });
    },
    closeCartPanel: () => {
      set({ isCartPanelOpen: false });
    },
  }));

let store: any;
export const useCreateUIStore = (serverInitialState: StateType) => {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeStore(serverInitialState);
  }

  const isReusingStore = Boolean(store);
  // For CSR, always re-use same store.
  store = store ?? initializeStore(serverInitialState);
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    // serverInitialState is undefined for CSR pages. It is up to you if you want to reset
    // states on CSR page navigation or not. I have chosen not to, but if you choose to,
    // then add `serverInitialState = getDefaultInitialState()` here.
    if (serverInitialState && isReusingStore) {
      store.setState(
        {
          // re-use functions from existing store
          ...store.getState(),
          // but reset all other properties.
          ...serverInitialState,
        },
        true // replace states, rather than shallow merging
      );
    }
  });

  return () => store;
};

const zustandContext = createContext<UseStoreStateType>();

export const Provider = zustandContext.Provider;
export const useUIStore = zustandContext.useStore;
