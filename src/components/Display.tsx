'use client';

import { Duration } from '@/types';
import styles from './Display.module.css';
import { usePlayhead } from './providers/SongProvider';
import clsx from 'clsx';

export const Display = () => {
  const { position } = usePlayhead();
  return (
    <div className={styles.Display}>
      <FormattedDuration duration={position} />
    </div>
  );
};

export const FormattedPosition = ({
  position: { bar, beat },
  ...props
}: {
  position: Duration;
  className?: string;
}) => {
  return <Formatted duration={{ bar: bar + 1, beat: beat + 1 }} {...props} />;
};
export const FormattedDuration = (props: {
  duration: Duration;
  className?: string;
}) => {
  return <Formatted {...props} />;
};

export const Formatted = ({
  duration,
  className,
}: {
  duration: Duration;
  className?: string;
}) => {
  return (
    <span className={clsx(styles.Display, className)}>
      {duration.bar}.{duration.beat}.0
    </span>
  );
};