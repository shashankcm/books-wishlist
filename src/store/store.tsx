import React, { createContext, useContext, useReducer } from "react";
import { IState, IContextProps, StoreProviderProps } from "../shared/types";
import { wishlistReducer, availableBooksReducer } from "./reducer";

export const initialState: IState = {
  wishlist: [],
  availableBooks: { kind: "", totalItems: 0, items: [] },
};

export const StoreContext = createContext<IContextProps>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: IState, action: any) => ({
  wishlist: wishlistReducer(state.wishlist, action),
  availableBooks: availableBooksReducer(state.availableBooks, action),
});

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreProviderValue = () => useContext(StoreContext);
