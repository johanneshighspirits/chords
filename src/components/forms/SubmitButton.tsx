'use client';

import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';
import styles from './Button.module.css';

export const SubmitButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={[styles.button, styles.submit].join(' ')}>
      {pending && <span className={styles.icon}>⏳</span>}
      {children}
    </button>
  );
};
