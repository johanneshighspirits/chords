import { PropsWithChildren } from 'react';
import styles from './Debug.module.css';

export const Debug = ({
  toJson,
  children,
}: PropsWithChildren<{ toJson?: any }>) => {
  return (
    <pre className={styles.pre}>
      {toJson ? JSON.stringify(toJson, null, 2) : children}
    </pre>
  );
};
