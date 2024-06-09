import PrefecturesSelector from "./PrefecturesSelector";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorType, Prefecture } from "@/app/_actions/resas.types";
import * as resas from "@/app/_actions/resas";
import * as r from "@totto2727/result";

describe("PrefectureSelector", () => {
  test("初期状態の確認", () => {
    render(<PrefecturesSelector />);
    expect(screen.getByText("都道府県を選択")).toBeInTheDocument();
  });

  test("都道府県一覧取得成功時の挙動確認", async () => {
    const apiMock = vi.spyOn(resas, "getPrefectures");
    apiMock.mockResolvedValue(r.succeed(dataset));
    const fnMock = vi.fn();
    render(<PrefecturesSelector onChoose={fnMock} />);
    await userEvent.click(await screen.findByLabelText("青森県"));
    expect(fnMock).toBeCalledWith([2]);
    await userEvent.click(screen.getByLabelText("北海道"));
    expect(fnMock).toBeCalledWith([2, 1]);
    await userEvent.click(screen.getByLabelText("青森県"));
    expect(fnMock).toBeCalledWith([1]);
    apiMock.mockRestore();
  });

  test("エラー時にはその表示がある", async () => {
    const mock = vi.spyOn(resas, "getPrefectures");
    mock.mockResolvedValue(r.fail(ErrorType.ApiError));
    render(<PrefecturesSelector />);
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
