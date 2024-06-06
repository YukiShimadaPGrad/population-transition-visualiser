type Plops = {
  /** 表示ラベルおよび {@link onChoose} に渡される識別子*/
  label: string;
  /** この値が同じ {@link LabeledSingleChoice} コンポーネントからひとつだけを選べるようになる */
  group: string;
  /** 選択状態の初期値 */
  defaultChosen?: boolean;
  /**
   * 選択状態が変化した時のコールバック
   * @param isChosen 選択状態か否か
   * @param label 選択肢の表示名
   */
  onChoose?: (isChosen: boolean, label: string) => void;
};

/**
 * ラジオボタンとラベルのペア
 */
export default function LabeledSingleChoice({ label, group, defaultChosen, onChoose }: Plops) {
  return (
    <label>
      <input
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
