'use client';

import { PropsWithChildren, useRef } from 'react';
import styles from './Playhead.module.css';
import { Duration } from '@/types';
import { usePlayhead } from './providers/SongProvider';
import clsx from 'clsx';

export type PlayheadProps = PropsWithChildren<{
  partId: string;
  className?: string;
}>;

export const Playhead = ({ partId, className, children }: PlayheadProps) => {
  const { currentPartUID, position } = usePlayhead();
  const ref = useRef<HTMLDivElement | null>(null);

  const { left, top } = calculatePlayheadPosition(
    partId,
    position,
    ref.current
  );

  return (
    <div className={className} ref={ref}>
      {partId === currentPartUID ? (
        <div
          style={{
            left,
            top,
          }}
          className={clsx('print-hidden', styles.Playhead)}></div>
      ) : null}
      {children}
    </div>
  );
};

const calculatePlayheadPosition = (
  partId: string,
  position: Duration,
  container: HTMLDivElement | null
) => {
  if (typeof document !== 'undefined') {
    const barId = `part_${partId}_${position.bar}.${position.beat}`;
    const barElement: HTMLDivElement | null = document.querySelector(
      `div[data-bar-id="${barId}"]`
    );
    if (barElement && container) {
      const { top: containerTop, left: containerLeft } =
        container.getBoundingClientRect();
      const { top, left, height } = barElement.getBoundingClientRect();

      return {
        top: top - containerTop,
        left: left - containerLeft,
      };
    }
  }
  return { top: 0, left: 0 };
};
