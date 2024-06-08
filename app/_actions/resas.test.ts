import { getPopulationCompositions, getPrefectures } from "./resas";
import { ErrorType } from "./resas.types";
import * as r from "@totto2727/result";
import { expect } from "@storybook/test";

const serverErrorFetchImpl = async () => new Response("", { status: 500 });
const unexpectedResponseBodyFetchImpl = async () => new Response("unexpected!", { status: 200 });

describe("getPrefectures", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("都道府県情報を取得できる", async () => {
    const prefectures = r.unwrap(await getPrefectures());
    await expect(prefectures).toHaveLength(47);
  });

  test("通信失敗時は ApiError となる", async () => {
    vi.spyOn(global, "fetch").mockImplementation(serverErrorFetchImpl);
    const result = await getPrefectures();
    await expect(r.isFailure(result) ? result.cause : undefined).toEqual(ErrorType.ApiError);
  });

  test("想定外のレスポンスボディなら JSONParseError となる", async () => {
    vi.spyOn(global, "fetch").mockImplementation(unexpectedResponseBodyFetchImpl);
    const result = await getPrefectures();
    await expect(r.isFailure(result) ? result.cause : undefined).toEqual(ErrorType.JSONParseError);
  });
});

describe("getPopulationCompositions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("人口構成情報を取得できる", async () => {
    const compositions = r.unwrap(await getPopulationCompositions([26, 47]));
    await expect(compositions).toHaveLength(2);
  });

  test("通信失敗時は ApiError となる", async () => {
    vi.spyOn(global, "fetch").mockImplementation(serverErrorFetchImpl);
    const result = await getPopulationCompositions([1]);
    await expect(r.isFailure(result) ? result.cause : undefined).toEqual(ErrorType.ApiError);
  });

  test("想定外のレスポンスボディなら JSONParseError となる", async () => {
    const result = await getPopulationCompositions([-1]);
    await expect(r.isFailure(result) ? result.cause : undefined).toEqual(ErrorType.JSONParseError);
  });
});
