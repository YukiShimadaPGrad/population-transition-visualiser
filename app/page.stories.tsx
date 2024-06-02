import type { Meta, StoryObj } from "@storybook/react";
import Home from "./page";

const meta = {
  title: "Home",
  component: Home,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
} as Meta<typeof Home>;

export default meta;

type Story = StoryObj<typeof Home>;

export const Default: Story = {};
