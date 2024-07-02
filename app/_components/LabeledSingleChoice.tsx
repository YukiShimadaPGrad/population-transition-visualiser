import styles from "./LabeledSingleChoice.module.scss";

type Props<T extends string> = {
  /** 表示ラベルおよび {@link onChoose} に渡される識別子*/
  label: T;
  /** この値が同じ {@link LabeledSingleChoice} コンポーネントからひとつだけを選べるようになる */
  group: string;
  /** 選択状態の初期値 */
  defaultChosen?: boolean;
  /**
   * 選択状態が変化した時のコールバック
   * @param isChosen 選択状態か否か
   * @param label 選択肢の表示名
   */
  onChoose?: (isChosen: boolean, label: T) => void;
};

/**
 * ラジオボタンとラベルのペア
 */
export default function LabeledSingleChoice<T extends string>({
  label,
  group,
  defaultChosen,
  onChoose,
}: Props<T>) {
  return (
    <label className={styles.label}>
      <input
        className={styles.button}
        type="radio"
        name={group}
        value={label}
        defaultChecked={defaultChosen}
        onChange={(ev) => {
          onChoose?.(ev.target.checked, label);
        }}
      ></input>
      <span>{label}</span>
    </label>
  );
}
