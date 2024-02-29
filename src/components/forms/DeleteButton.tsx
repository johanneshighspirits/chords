'use client';

import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import styles from './Button.module.css';
import { deleteSong } from '@/actions/song';
import { usePathname } from 'next/navigation';

export const DeleteButton = ({
  title,
  slug,
  children,
}: PropsWithChildren<{ title: string; slug: string }>) => {
  const { pending } = useFormStatus();
  const pathname = usePathname();

  const handleClick = async (e: any) => {
    const shouldDelete = confirm(`Do you want to delete ${title}`);
    if (shouldDelete) {
      await deleteSong(slug, pathname);
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
