import React, { ReactNode, ReactChildren, ReactChild } from "react";

export type Book = {
  volumeInfo: {
    title: string;
    authors: string[];
    publisher: string;
    publishedDate: string;
    description: string;
    imageLinks: { thumbnail: string };
  };
  id: number;
};

export type AllBooks = {
  kind: string;
  totalItems: number;
  items: [];
};

export interface IState {
  wishlist: Wish[];
  availableBooks: AllBooks;
}

export interface IContextProps {
  state: IState;
  dispatch: React.Dispatch<any>;
}

export type Wish = {
  id: number;
  title: string;
};

export type StoreProviderProps = {
  children: ReactNode | ReactChildren | ReactChild;
};

export type Action<T extends { [index: string]: any }> = {
  [Key in keyof T]: T[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: T[Key];
      };
};

export enum ActionTypes {
  ADD_TO_WISHLIST = "ADD_TO_WISHLIST",
  ADD_AVAILABLE_BOOKS = "ADD_AVAILABLE_BOOKS",
}

export type WishlistPayload = {
  [ActionTypes.ADD_TO_WISHLIST]: Wish;
};

export type AvailableBooksPayload = {
  [ActionTypes.ADD_AVAILABLE_BOOKS]: AllBooks;
};

export type WishlistAction = Action<WishlistPayload>[keyof Action<
  WishlistPayload
>];

export type AvailableBooksAction = Action<AvailableBooksPayload>[keyof Action<
  AvailableBooksPayload
>];

export type CancelableDebounced<T extends (...args: any[]) => void> = {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
};

export enum DebounceCleanupAction {
  Cancel,
  Flush,
}
