import React from "react";
import "./styles/App.scss";
import BookSearch from "./book-search/BookSearch";
import BookWishList from "./book-wishlist/BookWishList";

function App() {
  return (
    <main>
      <BookSearch />
      <BookWishList />
    </main>
  );
}

export default App;
