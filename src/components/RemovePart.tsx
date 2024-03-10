'use client';

import { useSong } from './providers/SongProvider';
import styles from './remove-button.module.css';
import clsx from 'clsx';

export const RemovePart = ({
  uid,
  className,
}: {
  uid: string;
  className?: string;
}) => {
  const { dispatch } = useSong();

  const handleClick = () => {
    dispatch({ type: 'removePart', uid });
  };

  return (
    <button
      className={clsx('blank', styles.button, className)}
      onClick={handleClick}>
      X
    </button>
  );
};
