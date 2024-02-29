import { PropsWithChildren } from 'react';
import styles from './PageContainer.module.css';

export const PageContainer = ({ children }: PropsWithChildren) => {
  return <section className={styles.PageContainer}>{children}</section>;
};
