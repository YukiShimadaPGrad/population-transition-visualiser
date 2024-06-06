import type { Meta, StoryObj } from "@storybook/react";
import SingleSelectableChoices from "./SingleSelectableChoices";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

const meta = {
  title: "Components/SingleSelectableChoices",
  component: SingleSelectableChoices,
} satisfies Meta<typeof SingleSelectableChoices>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    legend: "複数選択UIタイトル",
    group: "group",
    options: [
      { label: "炭水化物" },
      { label: "脂質" },
      { label: "タンパク質" },
      { label: "ビタミン", defaultChosen: true },
      { label: "ミネラル", defaultChosen: true },
      { label: "タンパク質" },
    ],
    onChoose: fn(),
  },
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step("初期状態", async () => {
      await expect(canvas.getByText(args.legend)).toBeInTheDocument();
      await expect(args.onChoose).toHaveBeenCalledTimes(0);
      await expect(canvas.getAllByRole("radio", { checked: true })).toHaveLength(1);
      await expect(canvas.getAllByRole("radio", { checked: false })).toHaveLength(4);
    });

    await step("炭水化物を選択", async () => {
      await userEvent.click(canvas.getByLabelText("炭水化物"));
      await waitFor(() => expect(args.onChoose).toHaveBeenCalledTimes(1));
      await expect(args.onChoose).toBeCalledWith("炭水化物");
      await expect(await canvas.findAllByRole("radio", { checked: true })).toHaveLength(1);
      await expect(await canvas.findAllByRole("radio", { checked: false })).toHaveLength(4);
    });
  },
} satisfies Story;

export const NotDefaultChosen = {
  args: {
    legend: "選択状態を指定していないので最初の要素が選択されているはず",
    group: "group",
    options: [{ label: "炭水化物" }, { label: "脂質" }, { label: "タンパク質" }],
    onChoose: fn(),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("初期状態", async () => {
      await expect(
        canvas.getByRole("radio", { checked: true, name: "炭水化物" })
      ).toBeInTheDocument();
      await expect(
        canvas.queryByRole("radio", { checked: true, name: /脂質|タンパク質/ })
      ).not.toBeInTheDocument();
    });
  },
} satisfies Story;
