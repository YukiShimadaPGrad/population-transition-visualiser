"use server";

import { CompositionType, ErrorType, PopulationComposition, Prefecture } from "./resas.types";
import * as r from "@totto2727/result";
import * as z from "zod";

/**
 * 都道府県と番号の一覧を取得する
 */
export async function getPrefectures(): Promise<r.Result<Prefecture[], ErrorType>> {
  "use server";
  const res = await RESASFetch(ApiKind.Prefectures, prefecturesSchema);
  return r.isSuccess(res) ? r.succeed(res.value.result) : r.fail(res.cause);
}

/**
 * 指定した全都道府県の人口構成情報を取得する
 *
 * @param prefCodes 都道府県一覧取得 Action である {@link getPrefectures} で得た都道府県番号
 */
export async function getPopulationCompositions(
  prefCodes: number[]
): Promise<r.Result<PopulationComposition[], ErrorType>> {
  "use server";
  const results = await Promise.all(
    prefCodes.map((prefCode) =>
      RESASFetch(ApiKind.PopulationComposition, populationCompositionSchema, [
        `prefCode=${prefCode}`,
        "cityCode=-",
      ])
    )
  );
  for (const result of results) {
    if (r.isFailure(result)) {
      return r.fail(result.cause);
    }
  }
  return r.succeed(
    results.map((result) => {
      // failed result は全て弾いたので安全に unwrap できる
      return convertPopulationComposition(r.unwrap(result));
    })
  );
}

const ApiKind = {
  Prefectures: "api/v1/prefectures",
  PopulationComposition: "api/v1/population/composition/perYear",
} as const;

type ApiKind = (typeof ApiKind)[keyof typeof ApiKind];

const positiveIntSchema = z.number().positive().int();

const prefecturesSchema = z.object({
  message: z.string().nullable(),
  result: z.array(z.object({ prefCode: positiveIntSchema, prefName: z.string() })),
});

const compositionTypeSchema = z.union([
  z.literal(CompositionType.All),
  z.literal(CompositionType.Younger),
  z.literal(CompositionType.Worker),
  z.literal(CompositionType.Elder),
]);

const populationCompositionSchema = z.object({
  message: z.string().nullable(),
  result: z.object({
    boundaryYear: positiveIntSchema,
    data: z.array(
      z.object({
        label: compositionTypeSchema,
        data: z.array(z.object({ year: positiveIntSchema, value: positiveIntSchema })),
      })
    ),
  }),
});

const RESASApiUrlBase = "https://opendata.resas-portal.go.jp";

const NEXTRevalidateCacheSeconds = 60 * 60;

async function RESASFetch<T>(
  apiKind: ApiKind,
  schema: z.ZodSchema<T>,
  params?: string[]
): Promise<r.Result<z.infer<z.ZodSchema<T>>, ErrorType>> {
  "use server";
  const url = `${RESASApiUrlBase}/${apiKind}?${params?.join("&")}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "X-API-KEY": `${process.env.RESAS_API_KEY}`,
    },
    next: { revalidate: NEXTRevalidateCacheSeconds },
  });
  if (!response.ok) {
    console.error(`${ErrorType.ApiError}\n%o`, response); // サーバに対するエラー出力
    return r.fail(ErrorType.ApiError);
  }
  try {
    return r.succeed(schema.parse(await response.json()));
  } catch (e) {
    console.error(`${ErrorType.JSONParseError}\n%o`, e); // サーバに対するエラー出力
    return r.fail(ErrorType.JSONParseError);
  }
}

function convertPopulationComposition(
  parsed: z.infer<typeof populationCompositionSchema>
): PopulationComposition {
  const convertedBase = {
    boundaryYear: parsed.result.boundaryYear,
    data: {
      [CompositionType.All]: [{ year: 0, value: 0 }],
      [CompositionType.Younger]: [{ year: 0, value: 0 }],
      [CompositionType.Worker]: [{ year: 0, value: 0 }],
      [CompositionType.Elder]: [{ year: 0, value: 0 }],
    },
  } satisfies PopulationComposition;
  for (const composition of parsed.result.data) {
    convertedBase.data[composition.label] = composition.data;
  }
  return convertedBase;
}
