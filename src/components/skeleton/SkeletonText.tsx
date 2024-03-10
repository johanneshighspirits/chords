import { PropsWithChildren } from 'react';
import styles from './Skeleton.module.css';
import clsx from 'clsx';

const randomText = (minLength = 10, maxLength = 100) => {
  const range = Math.abs(maxLength - minLength);
  return Array.from({
    length: minLength + Math.round(Math.random() * range),
  })
    .map((_, i) => String.fromCharCode(65 + Math.random() * 30))
    .join(Math.random() > 0.9 ? ' ' : '');
};

export const SkeletonContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};

export const SkeletonText = ({
  min = 10,
  max = 30,
}: {
  min?: number;
  max?: number;
}) => {
  return <span className={styles.text}>{randomText(min, max)}</span>;
};
