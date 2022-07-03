import { useLayoutEffect } from 'react';
import create, { UseBoundStore } from 'zustand';
import createContext from 'zustand/context';
import { persist } from 'zustand/middleware';

import type { TokenType } from '@/lib/types';

// Questionable workaround for Zustand persistence for SSR
const dummyStorageApi = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export type StateType = ReturnType<typeof getDefaultInitialState>;
type UseStoreStateType = typeof initializeStore extends (
  ...args: never
) => UseBoundStore<infer T>
  ? T
  : never;

const alreadyHasToken = (tokenId: string, tokens: Array<TokenType>) => {
  return tokens.some((token) => token.id === tokenId);
};

const getDefaultInitialState = () => ({
  tokens: [],
  isCartPanelOpen: false,
  openCartPanel: () => {},
  closeCartPanel: () => {},
  addToken: (token: TokenType) => {},
  removeToken: (tokenId: string) => {},
  toggleToken: (token: TokenType) => {},
  resetCart: () => {},
});

export const initializeStore = (preloadedState = {}) =>
  create(
    persist(
      (set, get) => ({
        ...getDefaultInitialState(),
        ...preloadedState,

        addToken: (token: TokenType) => {
          const currentState = get() as StateType;
          if (alreadyHasToken(token.id, currentState.tokens)) {
            return;
          }

          set((state: StateType) => ({
            ...state,
            tokens: [...state.tokens, token],
          }));
        },

        removeToken: (tokenId: string) => {
          set((state: StateType) => ({
            ...state,
            tokens: state.tokens.filter(
              (token: TokenType) => token.id !== tokenId
            ),
          }));
        },

        toggleToken: (token: TokenType) => {
          const currentState = get() as StateType;

          if (alreadyHasToken(token.id, currentState.tokens)) {
            currentState.removeToken(token.id);
          } else {
            currentState.addToken(token);
          }
        },

        openCartPanel: () => {
          set({ isCartPanelOpen: true });
        },
        closeCartPanel: () => {
          set({ isCartPanelOpen: false });
        },

        resetCart: () => {
          set({
            tokens: [getDefaultInitialState().tokens],
          });
        },
      }),

      // TODO should really split this onto 2 stores, and persist only the selected tokens
      {
        name: 'ui-store', // unique name
        getStorage: () =>
          typeof window !== 'undefined' ? window.localStorage : dummyStorageApi,
      }
    )
  );

let store: any;
export const useCreateStore = (serverInitialState: StateType) => {
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
export const useStore = zustandContext.useStore;
