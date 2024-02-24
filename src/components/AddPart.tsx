'use client';

import clsx from 'clsx';
import styles from './addPart.module.css';
import { useSong } from './providers/SongProvider';

export const AddPart = () => {
  const { dispatch } = useSong();
  const handleClick = () => {
    dispatch({ type: 'addPart' });
  };
  return (
    <button onClick={handleClick} className={clsx(styles.button)}>
      Add part (+)
    </button>
  );
};
