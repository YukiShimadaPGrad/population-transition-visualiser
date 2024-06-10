"use client";

import {
  CompositionType,
  ErrorType,
  PopulationComposition,
  Prefecture,
} from "@/app/_actions/resas.types";
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState, useTransition } from "react";
import { getPopulationCompositions } from "@/app/_actions/resas";
import * as r from "@totto2727/result";

type Props = {
  prefectures: Prefecture[];
  compositionType: CompositionType;
};

/**
 * 指定した都道府県コードと人口構成タイプから人口推移グラフを作成する機能
 */
export default function PopulationCompositionChart({ prefectures, compositionType }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ErrorType | null>(null);
  const [chartData, setChartData] = useState<ChartStruct>(makeDefaultChartData());

  const lineColors = makeColors(prefectures.length);

  useEffect(() => {
    startTransition(async () => {
      const result = await getPopulationCompositions(prefectures.map(({ prefCode }) => prefCode));
      if (r.isSuccess(result)) {
        setChartData(
          result.value.length
            ? toChartStruct(
                result.value,
                prefectures.map(({ prefName }) => prefName)
              )
            : makeDefaultChartData()
        );
      } else {
        setError(result.cause);
      }
    });
  }, [prefectures]);
  return (
    <>
      {error ? (
        <p>{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.data[compositionType]}>
            <CartesianGrid strokeDasharray="3 3" />

            {isPending ? (
              <text x="50%" y="50%" width={200} textAnchor="middle">
                読み込み中…
              </text>
            ) : (
              <></>
            )}

            <XAxis
              dataKey="year"
              scale="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              label={<Label value="年" position="insideBottomRight" dx={10} dy={12} />}
            />
            <YAxis
              type="number"
              tickFormatter={yAxisFormatter}
              label={<Label value="人口" position="insideTopRight" dx={-4} dy={20} />}
            />
            <ReferenceLine
              x={chartData.boundaryYear}
              stroke="red"
              strokeDasharray="3 3"
              label="予測値との境界"
            />
            {prefectures.length ? (
              prefectures.map((v, i) => (
                <Line key={v.prefName} dataKey={v.prefName} stroke={lineColors[i]} />
              ))
            ) : (
              <Line key={noDataLabel} dataKey={noDataLabel} stroke="#000000" />
            )}
            <Legend />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
}

type ChartStruct = {
  boundaryYear: number;
  data: {
    [key in CompositionType]: PerYear[];
  };
};

type PerYear = {
  year: number;
  [key: string]: number;
};

const noDataLabel = "No data";

const perCompositionDefaultData = [
  { year: 1960, [noDataLabel]: 10000000 },
  { year: 2045, [noDataLabel]: 10000000 },
];

function makeDefaultChartData(empty = false): ChartStruct {
  return {
    boundaryYear: 0,
    data: {
      [CompositionType.All]: empty ? [] : perCompositionDefaultData,
      [CompositionType.Younger]: empty ? [] : perCompositionDefaultData,
      [CompositionType.Worker]: empty ? [] : perCompositionDefaultData,
      [CompositionType.Elder]: empty ? [] : perCompositionDefaultData,
    },
  };
}

function toChartStruct(
  compositions: PopulationComposition[],
  prefectureNames: string[]
): ChartStruct {
  const result = makeDefaultChartData(true);
  // composition は空でないように制御しているため、万が一空ならむしろエラーになって欲しい
  result.boundaryYear = compositions[0].boundaryYear;
  // PopulationComposition.data のキーは CompositionType しか許容しないため for in を利用
  for (const _compositionKey in compositions[0].data) {
    // PopulationComposition.data のキーは CompositionType しか許容しないため as を利用
    const compositionKey = _compositionKey as CompositionType;
    for (let i_year = 0; i_year < compositions[0].data[compositionKey].length; i_year++) {
      const perYear: PerYear = { year: compositions[0].data[compositionKey][i_year].year };
      for (let i_pref = 0; i_pref < prefectureNames.length; i_pref++) {
        perYear[prefectureNames[i_pref]] = compositions[i_pref].data[compositionKey][i_year].value;
      }
      result.data[compositionKey].push(perYear);
    }
  }
  return result;
}

function yAxisFormatter(number: number): string {
  if (number > 1000000) {
    return (number / 1000000).toString() + "百万";
  } else if (number > 1000) {
    return (number / 1000).toString() + "千";
  } else {
    return number.toString();
  }
}

function makeColors(columnSize: number): string[] {
  const exclusionColorRangeFrom = 45; // 見えにくい色を回避
  const exclusionColorRangeLength = 100;
  const colors = Array<string>(columnSize);
  const maxColorRange = 360 - exclusionColorRangeLength;
  const halfBaseColor = Math.floor(maxColorRange / 2);
  for (let i = 0; i < columnSize; i++) {
    let division = Math.floor(maxColorRange / columnSize) * Math.floor(i / 2);
    if (i % 2 !== 0) {
      division += halfBaseColor;
    }
    if (division > exclusionColorRangeFrom) {
      division += exclusionColorRangeLength;
    }
    colors[i] = `hsl(${division}, 100%, 50%)`;
  }
  return colors;
}
