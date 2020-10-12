import React, { useEffect, useState, useCallback, useMemo } from "react";

import Book from "./book/Book";
import { getBooksByType } from "./book-search.service";

import { useStoreProviderValue } from "../store/store";
import { ActionTypes, AllBooks, DebounceCleanupAction } from "../shared/types";

import { randomNumber } from "../shared/utils";
import { useDebouncedFunction } from "../shared/useDebouncedFunction";

const BookSearch = () => {
  const [bookType, updateBookType] = useState("");
  const [bookTypeToSearch, updateBookTypeToSearch] = useState("");
  const { state, dispatch } = useStoreProviderValue();

  const requestBooks = useCallback(async () => {
    if (bookTypeToSearch) {
      const allBooks: AllBooks = await getBooksByType(bookTypeToSearch);
      dispatch({
        type: ActionTypes.ADD_AVAILABLE_BOOKS,
        payload: allBooks,
      });
    }
  }, [bookTypeToSearch, dispatch]);

  useEffect(() => {
    async function getAllBooks() {
      await requestBooks();
    }
    getAllBooks();
  }, [bookTypeToSearch, requestBooks]);

  const books = useMemo(() => state?.availableBooks?.items, [state]);

  const generateNumber = useMemo(() => {
    randomNumber();
  }, []);

  const debouncedSearch = useDebouncedFunction(
    updateBookTypeToSearch,
    500,
    DebounceCleanupAction.Flush
  );

  const immediateSearch = useCallback(
    (...args: Parameters<typeof updateBookType>) => {
      debouncedSearch.cancel();
      updateBookType(...args);
    },
    [debouncedSearch]
  );

  const onUpdateBookType = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      updateBookType(value);
      const action = value ? debouncedSearch : immediateSearch;
      action(value);
    },
    [debouncedSearch, immediateSearch]
  );

  const onSearchBooks = useCallback(
    (event) => {
      event.preventDefault();
      updateBookTypeToSearch(bookType);
      immediateSearch("");
    },
    [bookType, immediateSearch]
  );

  return (
    <div className="book__search">
      <form className="book__search--search__form" onSubmit={onSearchBooks}>
        <fieldset>
          <legend>Search Books</legend>
          <label htmlFor="book_search">Book Name</label>
          <input
            className="book__search--search__input"
            autoFocus
            name="book search"
            id="book_search"
            aria-label="bookSearch"
            type="search"
            value={bookType}
            placeholder="Search for books to add to your reading list and press Enter"
            onChange={onUpdateBookType}
          />
        </fieldset>
      </form>
      <div className="book__search--container">
        {books &&
          books.map((book, index) => (
            <Book key={index} id={generateNumber} {...book} />
          ))}
      </div>
    </div>
  );
};

export default BookSearch;
