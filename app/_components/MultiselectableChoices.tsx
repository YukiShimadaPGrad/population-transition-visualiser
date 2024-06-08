import LabeledChoice from "./LabeledChoice";
import { useState } from "react";

/** 選択肢 */
type Option = {
  /** 表示ラベル */
  label: string;
  /** {@link onChoose} に渡される値。 もし Falsy なら {@link label} で代用する */
  value?: string;
  /** 初期の選択状態 falsy値なら未選択 そうでなければ小さな値から順に選択されていることにする */
  defaultChosen?: number;
};

type Props = {
  /** 選択肢をひとまとめに表すラベル */
  legend: string;
  /** 表示する全ての選択肢 */
  options: Option[];
  /**
   * 選択状態が変化した時のコールバック
   * @param values 選択された全ての{@link value} 先に選択されたものから順に並ぶ
   */
  onChoose?: (values: readonly string[]) => void;
};

/**
 * 複数選択可能な選択肢提供UI
 *
 * {@link options}のvalue、なければラベルに重複があった場合は最初の物を残し削除される
 *
 * 選択状態が変化した時は、{@link onChoose}で選択ラベルとその順が通知される
 */
export default function MultiselectableChoices({ legend, options, onChoose }: Props) {
  // 重複する識別子をもつOptionを削除
  options = options.filter(
    ({ label, value }, index, self) =>
      self.findIndex((rhs) => getID(label, value) === getID(rhs.label, rhs.value)) === index
  );

  const [selections, setSelections] = useState<readonly string[]>(getSelections(options));

  return (
    <fieldset>
      <legend>{legend}</legend>
      {options.map(({ label, value, defaultChosen }) => (
        <LabeledChoice
          key={getID(label, value)}
          label={label}
          value={value}
          defaultChosen={Boolean(defaultChosen)}
          onChoose={(isChosen, id) => {
            const newSelections = updateSelections(isChosen, id, selections);
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
  value?: string;
  defaultChosen: number;
};

// 初期選択済みvalue配列を作成する
function getSelections(options: Option[]): string[] {
  return options
    .filter((option): option is NotUndefinedOption => {
      return Boolean(option.defaultChosen);
    })
    .sort((a, b) => a.defaultChosen - b.defaultChosen)
    .map(({ label, value }) => getID(label, value));
}

// isChosen が ture なら selections に追加、そうでなければ selections の該当識別子削除を行う
function updateSelections(isChosen: boolean, id: string, selections: readonly string[]): string[] {
  return isChosen ? [...selections, id] : selections.filter((selection) => selection !== id);
}

// valueか、それがない場合はラベルを返すことで識別子を得る
function getID(label: string, value: string | undefined): string {
  return value ? value : label;
}
