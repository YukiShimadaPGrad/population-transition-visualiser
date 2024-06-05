type Plops = {
  /** 表示ラベルおよび {@link onChoose} に渡される識別子*/
  label: string;
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
 * チェックボックスとラベルのペア
 */
export default function LabeledChoice({ label, defaultChosen, onChoose }: Plops) {
  return (
    <label>
      <input
        type="checkbox"
        defaultChecked={defaultChosen}
        onChange={(ev) => {
          onChoose?.(ev.target.checked, label);
        }}
      ></input>
      <span>{label}</span>
    </label>
  );
}
