'use client';

import clsx from 'clsx';
import styles from './addPart.module.css';
import { useSongParts } from './providers/SongProvider';
import { Part } from '@/helpers/part';

export const AddPart = ({ className }: { className?: string }) => {
  const { addPart, parts } = useSongParts();
  const handleClick = () => {
    const part = Part.new([], parts.length - 1);
    addPart(part);
  };
  return (
    <button onClick={handleClick} className={clsx(className, styles.button)}>
      Add part (+)
    </button>
  );
};
