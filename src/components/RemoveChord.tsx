'use client';

import { useChords } from './providers/SongProvider';
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
  const { removeChords } = useChords();

  const handleClick = () => {
    removeChords([uid], partId);
  };

  return (
    <button className={clsx('blank', className)} onClick={handleClick}>
      X
    </button>
  );
};
