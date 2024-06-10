import LabeledSingleChoice from "./LabeledSingleChoice";
import styles from "./SingleSelectableChoices.module.scss";

/** 選択肢 */
type Option = {
  /** 表示ラベルおよび {@link Props.onChoose} に渡される識別子 */
  label: string;
  /** 初期の選択状態 */
  defaultChosen?: boolean;
};

type Props = {
  /** 選択肢をひとまとめに表すラベル */
  legend: string;
  /** 単一選択選択肢グループ */
  group: string;
  /** 表示する全ての選択肢 */
  options: Option[];
  /**
   * 選択状態が変化した時のコールバック
   * @param label 現在選択されたラベル
   */
  onChoose?: (label: string) => void;
};

/**
 * 単一選択可能な選択肢提供UI
 *
 * {@link options}のラベルに重複があった場合は最初の物を残し削除される
 *
 * {@link options}で初期選択状態が指定されていない場合は最初の要素が、
 * 複数を初期選択として指定された場合はその中で最初の要素を初期選択とする
 *
 * 選択状態が変化した時は、{@link onChoose}で選択ラベルが通知される
 */
export default function SingleSelectableChoices({ legend, group, options, onChoose }: Props) {
  // 重複するlabelをもつOptionを削除
  options = options.filter(
    ({ label }, index, self) => self.findIndex((rhs) => label === rhs.label) === index
  );

  const defaultSelectedIndex = getDefaultSelectedIndex(options);

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.container}>
        {options.map(({ label }, index) => (
          <LabeledSingleChoice
            key={label}
            label={label}
            group={group}
            defaultChosen={defaultSelectedIndex == index}
            onChoose={(_, label) => {
              onChoose?.(label);
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}

function getDefaultSelectedIndex(options: readonly Option[]): number {
  for (let i = 0; i < options.length; i++) {
    if (options[i].defaultChosen) return i;
  }
  return 0;
}
