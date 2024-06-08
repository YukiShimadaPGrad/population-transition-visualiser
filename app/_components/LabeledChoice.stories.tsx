import type { Meta, StoryObj } from "@storybook/react";
import LabeledChoice from "./LabeledChoice";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

const meta = {
  title: "Components/LabeledChoice",
  component: LabeledChoice,
} satisfies Meta<typeof LabeledChoice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    label: "ラベル",
    onChoose: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("初期状態", async () => {
      await expect(canvas.getByText(args.label)).toBeInTheDocument();
      await expect(canvas.getByRole("checkbox", { checked: false })).toBeInTheDocument();
      await expect(args.onChoose).not.toHaveBeenCalled();
    });

    await step("1回目のクリック", async () => {
      await userEvent.click(canvas.getByRole("checkbox"));
      await waitFor(() => {
        expect(args.onChoose).toBeCalledWith(true, args.label);
      });
      await expect(args.onChoose).toHaveBeenCalledTimes(1);
      await expect(await canvas.findByRole("checkbox", { checked: true })).toBeInTheDocument();
    });

    await step("2回目のクリック", async () => {
      await userEvent.click(canvas.getByRole("checkbox"));
      await expect(args.onChoose).toBeCalledWith(false, args.label);
      await waitFor(async () => {
        await expect(args.onChoose).toBeCalledWith(true, args.label);
      });
      await expect(args.onChoose).toHaveBeenCalledTimes(2);
      await expect(await canvas.findByRole("checkbox", { checked: false })).toBeInTheDocument();
    });
  },
} satisfies Story;

export const DefaultChecked = {
  args: {
    label: "最初からチェック済み",
    value: "val",
    defaultChosen: true,
    onChoose: fn(),
  },
  play: async (context) => {
    const { canvasElement, step, args } = context;
    const canvas = within(canvasElement);

    await step("初期状態", async () => {
      await expect(canvas.getByText(args.label)).toBeInTheDocument();
      await expect(canvas.getByRole("checkbox", { checked: true })).toBeInTheDocument();
      await expect(args.onChoose).not.toHaveBeenCalled();
    });

    await step("1回目のクリック", async () => {
      await userEvent.click(canvas.getByRole("checkbox"));
      await waitFor(() => {
        expect(args.onChoose).toBeCalledWith(false, args.value);
      });
      await expect(args.onChoose).toHaveBeenCalledTimes(1);
      await expect(await canvas.findByRole("checkbox", { checked: false })).toBeInTheDocument();
    });
  },
} satisfies Story;
