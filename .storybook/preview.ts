import "../app/_styles/global.scss";
import type { Preview } from "@storybook/react";
import { withScreenshot } from "storycap";

export const decorators = [withScreenshot];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    screenshot: {
      fullPage: false,
      delay: 0,
      viewports: {
        desktop: { width: 1920, height: 1080 },
        mobile: { width: 375, height: 812, isMobile: true, hasTouch: true },
      },
    },
  },
};

export default preview;
