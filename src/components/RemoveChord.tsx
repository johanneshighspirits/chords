'use client';

import { deleteChord } from '@/db/actions';
import { useSong } from './providers/SongProvider';
import styles from './remove-button.module.css';
import clsx from 'clsx';

export const RemoveChord = ({
  uid,
  partId,
  className,
}: {
  uid: string;
  partId: string;
  className?: string;
}) => {
  const { dispatch } = useSong();

  const handleClick = () => {
    dispatch({ type: 'removeChord', uid, partId });
    deleteChord(uid);
  };

  return (
    <button
      className={clsx('blank', styles.button, styles.inset, className)}
      onClick={handleClick}>
      X
    </button>
  );
};
