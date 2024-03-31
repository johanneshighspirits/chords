import { PropsWithChildren } from 'react';
import styles from './PageContainer.module.css';
import clsx from 'clsx';

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export const PageContainer = ({ className, children }: ContainerProps) => {
  return (
    <section className={clsx(styles.PageContainer, className)}>
      {children}
    </section>
  );
};

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <article className={clsx(styles.Container, className)}>{children}</article>
  );
};
