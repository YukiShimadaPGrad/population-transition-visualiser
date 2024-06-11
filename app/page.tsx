"use client";

import styles from "./page.module.scss";
import PrefecturesSelector from "@/app/_features/PrefecturesSelector";
import SingleSelectableChoices from "@/app/_components/SingleSelectableChoices";
import PopulationCompositionChart from "@/app/_features/PopulationCompositionChart";
import { CompositionType, Prefecture } from "@/app/_actions/resas.types";
import { useState } from "react";

export default function Home() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [compositionType, setCompositionType] = useState<CompositionType>(CompositionType.All);
  return (
    <>
      <header className={styles.header}>
        <h1>人口推移見えーるくん</h1>
        <p>各都道府県の人口推移を可視化するアプリ</p>
      </header>
      <main className={styles.main}>
        <section className={`${styles.section} ${styles.prefSelectorContainer}`}>
          <PrefecturesSelector onChoose={(prefectures) => setPrefectures([...prefectures])} />
        </section>
        <section className={styles.section}>
          <SingleSelectableChoices
            legend="人口構成種別を選択"
            group="Composition Type"
            // options.label が全て CompositionType なので as を使用
            onChoose={(label: string) => setCompositionType(label as CompositionType)}
            options={[
              { label: CompositionType.All, defaultChosen: true },
              { label: CompositionType.Younger },
              { label: CompositionType.Worker },
              { label: CompositionType.Elder },
            ]}
          />
        </section>
        <section className={styles.section}>
          <h2 className={styles.chartHeader}>人口推移グラフ</h2>
          <div className={styles.chart}>
            <PopulationCompositionChart
              prefectures={prefectures}
              compositionType={compositionType}
            />
          </div>
        </section>
      </main>
    </>
  );
}
