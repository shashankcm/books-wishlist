import React from "react";
import { useStoreProviderValue } from "../store/store";

const BookWishList = () => {
  const {
    state: { wishlist },
  } = useStoreProviderValue();

  const renderWishlistedBooks = () =>
    wishlist.map(({ id, title }) => <li key={id}>{title}</li>);

  return (
    <div className="book__wishlist">
      <h3 className="book__wishlist--reading__list">
        My Reading Wishlist (
        <span data-testid="numberOfWishlistBooks">{wishlist.length || 0}</span>)
      </h3>
      <div className="book__wishlist--selected__book" data-testid="listOfBooks">
        <ol>{renderWishlistedBooks()}</ol>
      </div>
    </div>
  );
};

export default BookWishList;
