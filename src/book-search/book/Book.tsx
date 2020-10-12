import React, { memo, useCallback } from "react";
import { ActionTypes, Book as BookType } from "../../shared/types";
import { useStoreProviderValue } from "../../store/store";

const Book = memo(
  ({
    volumeInfo: {
      title,
      authors,
      publisher,
      publishedDate,
      description,
      imageLinks,
    },
    id,
  }: BookType) => {
    const {
      state: { wishlist },
      dispatch,
    } = useStoreProviderValue();

    const onAddToWishList = useCallback(() => {
      dispatch({
        type: ActionTypes.ADD_TO_WISHLIST,
        payload: { id, title },
      });
    }, [dispatch, id, title]);

    const shouldDisable = () => wishlist.some((items) => items.id === id);

    return (
      <div className="book__container" key={id}>
        <div className="book__container--header">
          <img
            src={
              imageLinks?.thumbnail
                ? imageLinks?.thumbnail
                : "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F100scopenotes.com%2Ffiles%2F2016%2F02%2Fno_book_cover_lg.jpg&f=1&nofb=1"
            }
            alt={title}
            className="book__container--header__img"
          />
          <div className="book__container--header__info">
            <div>
              <label htmlFor="Title">Title: </label>
              <div
                className="book__container--header__info--title"
                data-testid="title"
              >
                {title}
              </div>
            </div>
            <div>
              <label>Authors: </label>
              <div
                className="book__container--header__info--author"
                data-testid="author"
              >
                {authors && authors.map((author) => `${author}, `)}
              </div>
            </div>
            <div>
              <label>Publisher: </label>
              <div
                className="book__container--header__info--publisher"
                data-testid="publisher"
              >
                {publisher}
              </div>
            </div>
            <div>
              <label>Published Date: </label>
              <div
                className="book__container--header__info--published"
                data-testid="published"
              >
                {publishedDate}
              </div>
            </div>
          </div>
        </div>
        <div className="book__container--description">{description}</div>
        <div className="book__container--button__container">
          <button
            type="button"
            onClick={onAddToWishList}
            disabled={shouldDisable()}
            data-testid="addToWishList"
          >
            Add to wishlist
          </button>
        </div>
      </div>
    );
  }
);
export default Book;
