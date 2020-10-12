import {
  Wish,
  WishlistAction,
  ActionTypes,
  AllBooks,
  AvailableBooksAction,
} from "../shared/types";

export const wishlistReducer = (state: Wish[], action: WishlistAction) => {
  switch (action.type) {
    case ActionTypes.ADD_TO_WISHLIST:
      return [
        ...state,
        {
          id: action.payload.id,
          title: action.payload.title,
        },
      ];

    default:
      return state;
  }
};

export const availableBooksReducer = (
  state: AllBooks,
  action: AvailableBooksAction
) => {
  switch (action.type) {
    case ActionTypes.ADD_AVAILABLE_BOOKS:
      return Object.assign(
        {},
        {
          kind: action.payload.kind,
          totalItems: action.payload.totalItems,
          items: action.payload.items,
        }
      );

    default:
      return state;
  }
};
