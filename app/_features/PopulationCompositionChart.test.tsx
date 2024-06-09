import PopulationCompositionChart from "./PopulationCompositionChart";
import { render, screen } from "@testing-library/react";
import { CompositionType, ErrorType, Prefecture } from "@/app/_actions/resas.types";
import * as resas from "@/app/_actions/resas";
import * as r from "@totto2727/result";
import { Children, cloneElement, ReactSVGElement } from "react";

describe("PrefectureSelector", () => {
  vi.mock("recharts", async (importOriginal) => {
    const originalModule = (await importOriginal()) as Record<string, unknown>;
    return {
      ...originalModule,
      ResponsiveContainer: (props: { children: ReactSVGElement }) => (
        <div>
          {Children.map(props.children, (child) =>
            cloneElement(child, { width: 100, height: 100 })
          )}
        </div>
      ),
    };
  });

  test("エラーなく動くか確認", async () => {
    render(
      <PopulationCompositionChart compositionType={CompositionType.All} prefectures={dataset} />
    );
    expect(await screen.findByText("青森県")).toBeInTheDocument();
    expect(await screen.findByText("予測値との境界")).toBeInTheDocument();
  });

  test("空でも問題なく動作する", async () => {
    render(<PopulationCompositionChart compositionType={CompositionType.All} prefectures={[]} />);
    expect(await screen.findByText("No data")).toBeInTheDocument();
  });

  test("エラー時にはその表示がある", async () => {
    const mock = vi.spyOn(resas, "getPopulationCompositions");
    mock.mockResolvedValue(r.fail(ErrorType.ApiError));
    render(<PopulationCompositionChart compositionType={CompositionType.All} prefectures={[]} />);
    expect(await screen.findByText(ErrorType.ApiError)).toBeInTheDocument();
    mock.mockRestore();
  });
});

const dataset = [
  {
    prefCode: 1,
    prefName: "北海道",
  },
  {
    prefCode: 2,
    prefName: "青森県",
  },
] satisfies Prefecture[];
