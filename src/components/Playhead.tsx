'use client';

import styles from './Playhead.module.css';
import { usePlayhead } from './providers/SongProvider';

export type PlayheadProps = { partId: string };

export const Playhead = ({ partId }: PlayheadProps) => {
  const { currentPartUID, position } = usePlayhead();
  const { left, top, height } = {
    left: `${(position.bar % 4) * 25}%`,
    top: `calc(${Math.floor(position.bar / 4)} * 1px)`,
    height: '110px',
  };

  return partId === currentPartUID ? (
    <div
      style={{
        left,
        top,
        height,
      }}
      className={styles.Playhead}></div>
  ) : null;
};
