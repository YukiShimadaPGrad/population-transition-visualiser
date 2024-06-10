import { render, screen } from "@testing-library/react";
import { Children, cloneElement, ReactSVGElement } from "react";
import Home from "@/app/page";
import userEvent from "@testing-library/user-event";

describe("メインページ", () => {
  vi.mock("recharts", async (importOriginal) => {
    const origin = (await importOriginal()) as Record<string, unknown>;
    return {
      ...origin,
      ResponsiveContainer: (props: { children: ReactSVGElement }) => (
        <div>
          {Children.map(props.children, (child) =>
            cloneElement(child, { width: 100, height: 100 })
          )}
        </div>
      ),
    };
  });

  test("初期状態の確認", () => {
    render(<Home />);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("radio", { checked: true })).toBeInTheDocument();
  });

  test("正常動作の確認", async () => {
    render(<Home />);
    await userEvent.click(await screen.findByLabelText("北海道"));
    await userEvent.click(screen.getByLabelText("生産年齢人口"));
    expect(await screen.findAllByText("北海道")).toHaveLength(2);
  });
});
