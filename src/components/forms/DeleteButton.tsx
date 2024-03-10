'use client';

import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import styles from './Button.module.css';
import { usePathname } from 'next/navigation';
import { deleteSong } from '@/db/actions';

export const DeleteSongButton = ({
  title,
  songId,
  children,
}: PropsWithChildren<{ title: string; songId: string }>) => {
  const { pending } = useFormStatus();
  const pathname = usePathname();

  const handleClick = async (e: any) => {
    const shouldDelete = confirm(`Do you want to delete ${title}`);
    if (shouldDelete) {
      await deleteSong(songId, pathname);
    }
  };

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={handleClick}
      className={styles.delete}>
      {pending && <span className={styles.icon}>⏳</span>}
      {children}
    </button>
  );
};
