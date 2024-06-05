import LabeledChoice from "./LabeledChoice";
import { useState } from "react";

/** 選択肢 */
type Option = {
  /** 表示ラベルおよび {@link Plops.onChoose} に渡される識別子 */
  label: string;
  /** 初期の選択状態 falsy値なら未選択 そうでなければ小さな値から順に選択されていることにする */
  defaultChosen?: number;
};

type Plops = {
  /** 選択肢をひとまとめに表すラベル */
  legend: string;
  /** 表示する全ての選択肢 */
  options: Option[];
  /**
   * 選択状態が変化した時のコールバック
   * @param labels 選択された全てのラベル 先に選択されたものから順に並ぶ
   */
  onChoose?: (labels: readonly string[]) => void;
};

/**
 * 複数選択可能な選択肢提供UI
 *
 * {@link options}のラベルに重複があった場合は最初の物を残し削除される
 *
 * 選択状態が変化した時は、{@link onChoose}で選択ラベルとその順が通知される
 */
export default function MultiselectableChoices({ legend, options, onChoose }: Plops) {
  // 重複するlabelをもつOptionを削除
  options = options.filter(
    ({ label }, index, self) => self.findIndex((rhs) => label === rhs.label) === index
  );

  const [selections, setSelections] = useState<readonly string[]>(getSelections(options));

  return (
    <fieldset aria-multiselectable>
      <legend>{legend}</legend>
      {options.map(({ label, defaultChosen }) => (
        <LabeledChoice
          key={label}
          label={label}
          defaultChosen={Boolean(defaultChosen)}
          onChoose={(isChosen, label) => {
            const newSelections = updateSelections(isChosen, label, selections);
            setSelections(() => newSelections);
            onChoose?.(newSelections);
          }}
        />
      ))}
    </fieldset>
  );
}

// defaultChosen が undefined でないユーザー定義型ガード用の型
// Typescript 5.5 の型推論強化がリリースされれば不要なコード
type NotUndefinedOption = {
  label: string;
  defaultChosen: number;
};

// 初期選択済みラベル配列を作成する
function getSelections(options: Option[]): string[] {
  return options
    .filter((option): option is NotUndefinedOption => {
      return Boolean(option.defaultChosen);
    })
    .sort((a, b) => a.defaultChosen - b.defaultChosen)
    .map(({ label }) => label);
}

// isChosen が ture なら selections に追加、そうでなければ selections の該当 label 削除を行う
function updateSelections(
  isChosen: boolean,
  label: string,
  selections: readonly string[]
): string[] {
  return isChosen ? [...selections, label] : selections.filter((selection) => selection !== label);
}
