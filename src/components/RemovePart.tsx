'use client';

import { useSongParts } from './providers/SongProvider';
import styles from './remove-button.module.css';
import clsx from 'clsx';

export const RemovePart = ({
  uid,
  className,
}: {
  uid: string;
  className?: string;
}) => {
  const { removePart } = useSongParts();

  const handleClick = () => {
    removePart(uid);
  };

  return (
    <button
      className={clsx('blank', styles.button, className)}
      onClick={handleClick}>
      X
    </button>
  );
};
