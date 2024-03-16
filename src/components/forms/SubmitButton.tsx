'use client';

import { PropsWithChildren, ReactNode, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import styles from './Button.module.css';

export const SubmitButton = ({
  pendingComponent,
  children,
}: PropsWithChildren<{ pendingComponent?: (data: FormData) => ReactNode }>) => {
  const { pending, data } = useFormStatus();
  const ref = useRef<HTMLButtonElement | null>(null);
  const isFormValid = !!ref.current?.form?.checkValidity();

  return (
    <>
      <button
        ref={ref}
        type="submit"
        disabled={isFormValid || pending}
        className={[styles.button, styles.submit].join(' ')}>
        {pending && <span className={styles.icon}>⏳</span>}
        {children}
      </button>
      {data && pendingComponent?.(data)}
    </>
  );
};
