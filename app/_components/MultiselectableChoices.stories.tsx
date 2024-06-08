import type { Meta, StoryObj } from "@storybook/react";
import MultiselectableChoices from "./MultiselectableChoices";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

const meta = {
  title: "Components/MultiselectableChoices",
  component: MultiselectableChoices,
} satisfies Meta<typeof MultiselectableChoices>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    legend: "複数選択UIタイトル",
    options: [
      { label: "炭水化物" },
      { label: "脂質", defaultChosen: 3 },
      { label: "タンパク質", defaultChosen: NaN },
      { label: "ビタミン", defaultChosen: -Infinity },
      { label: "ミネラル", value: "mineral" },
      { label: "タンパク質", defaultChosen: Infinity },
      { label: "五大栄養素", value: "mineral" },
    ],
    onChoose: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("初期状態", async () => {
      await expect(canvas.getByText(args.legend)).toBeInTheDocument();
      await expect(args.onChoose).toHaveBeenCalledTimes(0);
      await expect(canvas.getAllByRole("checkbox", { checked: true })).toHaveLength(2);
      await expect(canvas.getAllByRole("checkbox", { checked: false })).toHaveLength(3);
    });

    await step("炭水化物を追加", async () => {
      await userEvent.click(canvas.getByLabelText("炭水化物"));
      await waitFor(() => expect(args.onChoose).toHaveBeenCalledTimes(1));
      await expect(args.onChoose).toBeCalledWith(["ビタミン", "脂質", "炭水化物"]);
      await expect(await canvas.findAllByRole("checkbox", { checked: true })).toHaveLength(3);
      await expect(await canvas.findAllByRole("checkbox", { checked: false })).toHaveLength(2);
    });

    await step("脂質を削除", async () => {
      await userEvent.click(canvas.getByLabelText("脂質"));
      await waitFor(() => expect(args.onChoose).toHaveBeenCalledTimes(2));
      await expect(args.onChoose).toBeCalledWith(["ビタミン", "炭水化物"]);
      await expect(await canvas.findAllByRole("checkbox", { checked: true })).toHaveLength(2);
      await expect(await canvas.findAllByRole("checkbox", { checked: false })).toHaveLength(3);
    });

    await step("ミネラル(valueあり)を追加", async () => {
      await userEvent.click(canvas.getByLabelText("ミネラル"));
      await waitFor(() => expect(args.onChoose).toHaveBeenCalledTimes(3));
      await expect(args.onChoose).toBeCalledWith(["ビタミン", "炭水化物", "mineral"]);
      await expect(await canvas.findAllByRole("checkbox", { checked: true })).toHaveLength(3);
      await expect(await canvas.findAllByRole("checkbox", { checked: false })).toHaveLength(2);
    });

    await step("ミネラル(valueあり)を削除", async () => {
      await userEvent.click(canvas.getByLabelText("ミネラル"));
      await waitFor(() => expect(args.onChoose).toHaveBeenCalledTimes(4));
      await expect(args.onChoose).toBeCalledWith(["ビタミン", "炭水化物"]);
      await expect(await canvas.findAllByRole("checkbox", { checked: true })).toHaveLength(2);
      await expect(await canvas.findAllByRole("checkbox", { checked: false })).toHaveLength(3);
    });
  },
} satisfies Story;
