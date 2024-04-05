'use client';

import { Duration } from '@/types';
import styles from './Display.module.css';
import { usePlayhead } from './providers/SongProvider';
import clsx from 'clsx';
import { colorToCssVars } from '@/helpers/color';

export const Display = () => {
  const { masterPosition, currentPart } = usePlayhead();
  return (
    <div
      style={colorToCssVars(currentPart.color, 'title-bg')}
      className={styles.Display}>
      <FormattedDuration duration={masterPosition} />
      <span className={styles.PartTitle}>{currentPart.title}</span>
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
