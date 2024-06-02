import { composeStories } from "@storybook/react";
import * as stories from "./page.stories";
import { render, screen } from "@testing-library/react";

const { Default } = composeStories(stories);

describe("Stories", () => {
  describe("Default", () => {
    test("mainがある", () => {
      render(<Default />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
