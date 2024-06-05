/// <reference types="vite/client" />

/**
 * Storybook の全ての Story をテストするスクリプト
 * @see {@link https://zenn.dev/yumemi_inc/articles/run-all-stories-as-test-with-vitest-jsdom
 *  Vitest(jsdom)でStorybookのStory全部テストする大作戦}
 */

import { composeStories, Meta, StoryFn } from "@storybook/react";
import { render } from "@testing-library/react";
import { describe, test } from "vitest";

declare module "@storybook/types" {
  interface Parameters {
    vitest?: {
      /**
       * テストレベルを指定します。
       * - `none`: Story をスキップします。（Storybook でのみ実行されます）
       * - `smoke-only`: Story のレンダリングのみをテストします。
       * - `interaction`: Story のレンダリングとインタラクションをテストします。
       *
       * @default "interaction"
       */
      testLevel?: "none" | "smoke-only" | "interaction" | undefined;
    };
  }
}

const stories = Promise.all(
  Object.entries(
    import.meta.glob<{
      default: Meta;
      [name: string]: StoryFn | Meta;
    }>("../**/*.(stories|story).@(js|jsx|mjs|ts|tsx)", {
      eager: true,
    })
  ).map(async ([path, exports]) => {
    const composedStories = composeStories(exports);
    return {
      path: path.replace(/^\.\.\//, "app/"),
      stories: Object.entries(composedStories).map(([name, Component]) => {
        const runStory = async () => {
          const testLevel = Component.parameters.vitest?.testLevel ?? "interaction";

          if (testLevel === "none") {
            return;
          }

          const screen = render(<Component />);

          if (testLevel === "smoke-only") {
            return;
          }

          await Component.play?.({ canvasElement: screen.container });
        };

        return {
          name,
          runStory,
        };
      }),
    };
  })
);

stories.then((stories) => {
  describe.each(stories)("$path", ({ stories }) => {
    test.each(stories)("$name", async ({ runStory }) => {
      await runStory();
    });
  });
});
