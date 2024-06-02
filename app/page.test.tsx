import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  test("mainがある", () => {
    render(<Home></Home>);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
