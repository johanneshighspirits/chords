'use client';

import { useEffect, useState } from 'react';
import styles from './Playhead.module.css';
import { usePlayhead } from './providers/PlayheadProvider';

export type PlayheadProps = { partId: string };

export const Playhead = ({ partId }: PlayheadProps) => {
  const { currentPartId, position } = usePlayhead();
  const { left, top, height } = {
    left: `${(position.bar % 4) * 25}%`,
    top: `calc(${Math.floor(position.bar / 4)} * 1px)`,
    height: '130px',
  };

  return partId === currentPartId ? (
    <div style={{ left, top, height }} className={styles.Playhead}></div>
  ) : null;
};
