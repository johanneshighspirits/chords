'use client';

import { useSong } from './providers/SongProvider';
import styles from './removeChord.module.css';
import clsx from 'clsx';

export const RemoveChord = ({ id, partId }: { id: string; partId: string }) => {
  const { dispatch } = useSong();

  const handleClick = () => {
    dispatch({ type: 'removeChord', id, partId });
  };

  return (
    <button className={clsx('blank', styles.button)} onClick={handleClick}>
      X
    </button>
  );
};
