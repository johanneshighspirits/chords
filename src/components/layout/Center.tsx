import { PropsWithChildren } from 'react';
import styles from './Center.module.css';

export type CenterProps = PropsWithChildren;

export const Center = ({ children }: CenterProps) => {
  return <div className={styles.Center}>{children}</div>;
};
