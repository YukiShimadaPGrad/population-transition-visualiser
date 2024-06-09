/** 都道府県識別情報 */
export type Prefecture = {
  /** 都道府県の識別番号 */
  prefCode: number;
  /** 都道府県の表示名 */
  prefName: string;
};

/** 人口構成情報 */
export type PopulationComposition = {
  /** 実績値と推計値の区切り年 */
  boundaryYear: number;
  data: {
    [index in CompositionType]: {
      /** {@link value} の時刻(年) */
      year: number;
      /** 人口 */
      value: number;
    }[];
  };
};

/** RESAS に関連する Server Actions が返すエラーの種類 */
export const ErrorType = {
  ApiError: "API error.",
  JSONParseError: "JSON parse error.",
} as const;

/** RESAS に関連する Server Actions が返すエラーの種類 */
export type ErrorType = (typeof ErrorType)[keyof typeof ErrorType];

/** 人口構成データの構成種類 */
export const CompositionType = {
  All: "総人口",
  Younger: "年少人口",
  Worker: "生産年齢人口",
  Elder: "老年人口",
} as const;

/** 人口構成データの構成種類 */
type CompositionType = (typeof CompositionType)[keyof typeof CompositionType];
