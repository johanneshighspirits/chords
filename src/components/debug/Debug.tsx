import { PropsWithChildren } from 'react';
import styles from './Debug.module.css';

export const Debug = ({ children }: PropsWithChildren) => {
  return <pre className={styles.pre}>{children}</pre>;
};
