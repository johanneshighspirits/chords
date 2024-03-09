'use client';

import { useSong } from './providers/SongProvider';
import styles from './remove-button.module.css';
import clsx from 'clsx';

export const RemoveChord = ({
  id,
  partId,
  className,
}: {
  id: string;
  partId: string;
  className?: string;
}) => {
  const { dispatch } = useSong();

  const handleClick = () => {
    dispatch({ type: 'removeChord', id, partId });
  };

  return (
    <button
      className={clsx('blank', styles.button, styles.inset, className)}
      onClick={handleClick}>
      X
    </button>
  );
};
