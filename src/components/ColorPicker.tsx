import { Color } from '@/types';
import styles from './ColorPicker.module.css';
import { colorToHex, hexToColor } from '@/helpers/color';
import { ChangeEventHandler } from 'react';

export type ColorPickerProps = { color: Color; onEdit: (color: Color) => void };

export const ColorPicker = ({ color, onEdit }: ColorPickerProps) => {
  const hex = colorToHex(color);
  const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    onEdit(hexToColor(e.currentTarget.value));
  };

  return (
    <label className={styles.ColorPicker}>
      EDIT COLOR
      <input type="color" defaultValue={hex} onChange={handleChange}></input>
    </label>
  );
};
