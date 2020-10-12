import React from "react";
import { render, cleanup } from "@testing-library/react";
import App from "./App";
import { StoreProvider } from "./store/store";

export const renderWithContext = (component: React.ReactNode) => {
  return {
    ...render(<StoreProvider>{component}</StoreProvider>),
  };
};

const renderApplication = () =>
  render(
    <StoreProvider>
      <App />
    </StoreProvider>
  );

afterEach(cleanup);

describe("App Component", () => {
  it("should take a snapshot", () => {
    const { asFragment } = renderApplication();
    expect(
      asFragment(
        <StoreProvider>
          <App />
        </StoreProvider>
      )
    ).toMatchSnapshot();
  });
});
