import { Color } from '@/types';
import styles from './ColorPicker.module.css';
import { colorToHex, hexToColor } from '@/helpers/color';
import { ChangeEventHandler } from 'react';
import clsx from 'clsx';

export type ColorPickerProps = {
  color: Color;
  className?: string;
  onEdit: (color: Color) => void;
};

export const ColorPicker = ({ className, color, onEdit }: ColorPickerProps) => {
  const hex = colorToHex(color);
  const handleChange: ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    onEdit(hexToColor(e.currentTarget.value));
  };

  return (
    <label
      className={clsx(styles.ColorPicker, className)}
      onClick={(e) => e.stopPropagation()}>
      EDIT COLOR
      <input type="color" defaultValue={hex} onChange={handleChange}></input>
    </label>
  );
};
