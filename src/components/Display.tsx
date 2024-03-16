'use client';

import { Duration } from '@/types';
import styles from './Display.module.css';
import { usePlayhead } from './providers/SongProvider';

export const Display = () => {
  const { position } = usePlayhead();
  return (
    <div className={styles.Display}>
      <FormattedDuration duration={position} />
    </div>
  );
};

export const FormattedDuration = ({ duration }: { duration: Duration }) => {
  return (
    <span>
      {duration.bar + 1}.{duration.beat + 1}.0
    </span>
  );
};
