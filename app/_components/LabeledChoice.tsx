type Plops = {
  /** 表示ラベル */
  label: string;
  /** {@link onChoose} に渡される値。 もし Falsy なら {@link label} で代用する */
  value?: string;
  /** 選択状態の初期値 */
  defaultChosen?: boolean;
  /**
   * 選択状態が変化した時のコールバック
   * @param isChosen 選択状態か否か
   * @param value 選択肢の{@link value}、なければ{@link label}
   */
  onChoose?: (isChosen: boolean, value: string) => void;
};

/**
 * チェックボックスとラベルのペア
 */
export default function LabeledChoice({ label, value, defaultChosen, onChoose }: Plops) {
  return (
    <label>
      <input
        type="checkbox"
        defaultChecked={defaultChosen}
        onChange={(ev) => {
          onChoose?.(ev.target.checked, value ? value : label);
        }}
      ></input>
      <span>{label}</span>
    </label>
  );
}
