import React from "react";
import { cleanup, fireEvent, waitForElement } from "@testing-library/react";

import BookSearch from "./BookSearch";
import { renderWithContext } from "../App.test";
import { getBooksByType } from "./book-search.service";
import Book from "./book/Book";
import BookWishList from "../book-wishlist/BookWishList";

const InputSetup = () => {
  const utils = renderWithContext(<BookSearch />);
  const input = utils.getByLabelText("bookSearch");
  return {
    input,
    ...utils,
  };
};
afterAll(cleanup);

const mockJavascriptResponseData = {
  kind: "books#volumes",
  totalItems: 1972,
  jsItems: [
    {
      kind: "books#volume",
      id: "123",
      etag: "XoIn3UCxrnA",
      selfLink: "https://www.googleapis.com/books/v1/volumes/ptiYBAAAQBAJ",
      volumeInfo: {
        title: "Javascript IS Awesome",
        authors: ["Java", "Script"],
        publisher: "Javascript",
        publishedDate: "1980-10-10",
        description: "Learn Javascript",
        imageLinks: {
          thumbnail:
            "http://books.google.com/books/content?id=ptiYBAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        },
      },
    },
  ],
};

describe("BookSearch Component", () => {
  it("should take a snapshot", () => {
    const { asFragment } = renderWithContext(<BookSearch />);
    expect(asFragment(<BookSearch />)).toMatchSnapshot();
  });

  it("should set value to be Javascript for the input", () => {
    const { input } = InputSetup();
    fireEvent.change(input, { target: { value: "Javascript" } });
    expect(input.value).toBe("Javascript");
  });

  it("should get results when debounced search input have text 'Javascript'", async () => {
    const { input } = InputSetup();
    fireEvent.change(input, { target: { value: "Javascript" } });
    const booksData = await waitForElement(() => getBooksByType(input.value));
    expect(booksData).not.toEqual({});
  });

  it("should get results for the input word 'Javascript' when user type into the input and click enter", async () => {
    const { input } = InputSetup();
    fireEvent.change(input, { target: { value: "Javascript" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    const booksData = await waitForElement(() => getBooksByType(input.value));
    expect(booksData).not.toEqual({});
  });
});

describe("Book Component", () => {
  it("should take a snapshot", () => {
    const { jsItems } = mockJavascriptResponseData;
    const { id, volumeInfo } = jsItems[0];
    const { asFragment } = renderWithContext(
      <Book id={+id} volumeInfo={volumeInfo} />
    );
    expect(
      asFragment(<Book id={+id} volumeInfo={volumeInfo} />)
    ).toMatchSnapshot();
  });

  it("should render Book with given data example title should be 'Javascript IS Awesome'", () => {
    const { jsItems } = mockJavascriptResponseData;
    const { id, volumeInfo } = jsItems[0];
    const { getByTestId } = renderWithContext(
      <Book id={+id} volumeInfo={volumeInfo} />
    );
    expect(getByTestId("title")).toMatchSnapshot("Javascript IS Awesome");
    expect(getByTestId("publisher")).toMatchSnapshot("Javascript");
    expect(getByTestId("published")).toMatchSnapshot("1980-10-10");
  });

  it("should add books to my reading wishlist when you click on 'Add to wishlist'", async () => {
    const { jsItems } = mockJavascriptResponseData;
    const { id, volumeInfo } = jsItems[0];
    const { getByTestId, getByRole } = renderWithContext(
      <>
        <Book id={Number(id)} volumeInfo={volumeInfo} />
        <BookWishList />
      </>
    );

    expect(getByTestId("title")).toMatchSnapshot("Javascript IS Awesome");
    fireEvent.click(getByTestId("addToWishList"));

    const booksCount = await waitForElement(() =>
      getByTestId("numberOfWishlistBooks")
    );
    expect(booksCount).toHaveTextContent("1");
  });

  it("should disabled 'Add to wishlist' button after uses added book to the wishlist", async () => {
    const { jsItems } = mockJavascriptResponseData;
    const { id, volumeInfo } = jsItems[0];
    const { getByTestId } = renderWithContext(
      <>
        <Book id={Number(id)} volumeInfo={volumeInfo} />
        <BookWishList />
      </>
    );
    const addToWishListButton = getByTestId("addToWishList");
    fireEvent.click(addToWishListButton);
    expect(addToWishListButton).toBeDisabled();
  });

  it("should not add the same book to My Reading Wishlist more than 1 times", async () => {
    const { input } = InputSetup();
    const { jsItems } = mockJavascriptResponseData;
    const { id, volumeInfo } = jsItems[0];
    const { getByTestId, getByRole } = renderWithContext(
      <>
        <Book id={Number(id)} volumeInfo={volumeInfo} />
        <BookWishList />
      </>
    );

    const addToWishListButton = getByTestId("addToWishList");
    const listOfBooks = getByTestId("listOfBooks");
    const numberOfWishlistBooks = getByTestId("numberOfWishlistBooks");

    fireEvent.change(input, { target: { value: "Javascript" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    const jsbooksData = await waitForElement(() => getBooksByType(input.value));
    expect(jsbooksData).not.toEqual({});
    fireEvent.click(addToWishListButton);
    expect(getByTestId("title")).toMatchSnapshot("Javascript IS Awesome");
    fireEvent.click(addToWishListButton);

    const booksCount = await waitForElement(() => numberOfWishlistBooks);
    expect(booksCount).toHaveTextContent("1");
    expect(listOfBooks).toHaveTextContent("Javascript IS Awesome");
  });
});
