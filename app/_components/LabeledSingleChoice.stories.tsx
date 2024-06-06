import type { Meta, StoryObj } from "@storybook/react";
import LabeledSingleChoice from "./LabeledSingleChoice";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

const meta = {
  title: "Components/LabeledSingleChoice",
  component: LabeledSingleChoice,
} satisfies Meta<typeof LabeledSingleChoice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    label: "ラベル",
    group: "group",
    onChoose: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("初期状態", async () => {
      await expect(canvas.getByText(args.label)).toBeInTheDocument();
      await expect(canvas.getByRole("radio", { checked: false })).toBeInTheDocument();
      await expect(args.onChoose).not.toHaveBeenCalled();
    });

    await step("1回目のクリック", async () => {
      await userEvent.click(canvas.getByRole("radio"));
      await waitFor(() => {
        expect(args.onChoose).toBeCalledWith(true, args.label);
      });
      await expect(args.onChoose).toHaveBeenCalledTimes(1);
      await expect(await canvas.findByRole("radio", { checked: true })).toBeInTheDocument();
    });

    await step("2回目のクリック", async () => {
      await userEvent.click(canvas.getByRole("radio"));
      await expect(canvas.queryByRole("radio", { checked: false })).not.toBeInTheDocument();
      await expect(args.onChoose).toHaveBeenCalledTimes(1);
    });
  },
} satisfies Story;

export const DefaultChecked = {
  args: {
    label: "最初から選択済み",
    group: "group",
    defaultChosen: true,
    onChoose: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("初期状態", async () => {
      await expect(canvas.getByText(args.label)).toBeInTheDocument();
      await expect(canvas.getByRole("radio", { checked: true })).toBeInTheDocument();
      await expect(args.onChoose).not.toHaveBeenCalled();
    });

    await step("1回目のクリック", async () => {
      await userEvent.click(canvas.getByRole("radio"));
      await expect(canvas.queryByRole("radio", { checked: false })).not.toBeInTheDocument();
      await expect(args.onChoose).toHaveBeenCalledTimes(0);
    });
  },
} satisfies Story;
