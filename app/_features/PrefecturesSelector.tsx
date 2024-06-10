"use client";

import MultiselectableChoices, { Option } from "@/app/_components/MultiselectableChoices";
import { useEffect, useState, useTransition } from "react";
import { getPrefectures } from "@/app/_actions/resas";
import { ErrorType, Prefecture } from "@/app/_actions/resas.types";
import * as r from "@totto2727/result";
import styles from "./PrefecturesSelector.module.scss";

type Props = {
  /**
   * 選択状態が変化した時のコールバック
   * @param prefectures 選択された全ての都道府県 先に選択されたものから順に並ぶ
   */
  onChoose?: (prefectures: readonly Prefecture[]) => void;
};

/**
 * 都道府県選択機能
 */
export default function PrefecturesSelector({ onChoose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<ErrorType | null>(null);
  const [prefectures, setPrefectures] = useState<Option[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const result = await getPrefectures();
      if (r.isSuccess(result)) {
        setPrefectures(
          result.value.map((v) => {
            return { label: v.prefName, value: `${v.prefCode}_${v.prefName}` };
          })
        );
      } else {
        setError(result.cause);
      }
    });
  }, []);
  return (
    <div>
      {isPending ? (
        <p className={styles.loading}>読み込み中…</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <MultiselectableChoices
          legend={"都道府県を選択"}
          options={prefectures}
          onChoose={(prefectures) =>
            onChoose?.(
              prefectures.map((v) => {
                const split = v.split("_");
                return { prefCode: parseInt(split[0]), prefName: split[1] };
              })
            )
          }
        />
      )}
    </div>
  );
}
