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
    expect(await screen.findByText("沖縄県")).toBeInTheDocument();
    expect(await screen.findByText("予測値との境界")).toBeInTheDocument();
    expect((await screen.findAllByText(/^\d+(?:.\d+)?千$/))[0]).toBeInTheDocument();
    expect((await screen.findAllByText(/^\d+(?:.\d+)?百万$/))[0]).toBeInTheDocument();
    expect(
      await screen.findByText("RESAS（地域経済分析システム）を加工して作成")
    ).toBeInTheDocument();
  });

  test("空でも問題なく動作する", async () => {
    render(<PopulationCompositionChart compositionType={CompositionType.All} prefectures={[]} />);
    expect(await screen.findByText("No data")).toBeInTheDocument();
    expect(
      screen.queryByText("RESAS（地域経済分析システム）を加工して作成")
    ).not.toBeInTheDocument();
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
    prefCode: 46,
    prefName: "鹿児島県",
  },
  {
    prefCode: 47,
    prefName: "沖縄県",
  },
] satisfies Prefecture[];
