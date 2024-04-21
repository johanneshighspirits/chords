'use client';

import { PropsWithChildren, useRef } from 'react';
import styles from './Playhead.module.css';
import { Duration } from '@/types';
import { useMasterPosition } from './providers/SongProvider';
import clsx from 'clsx';
import { getBarId, getBeatId } from './TimingBar';

export type PlayheadProps = PropsWithChildren<{
  partId: string;
  className?: string;
}>;

export const Playhead = ({ partId, className, children }: PlayheadProps) => {
  const { currentPart, masterPosition } = useMasterPosition();
  const ref = useRef<HTMLDivElement | null>(null);
  const { left, top } = calculatePlayheadPosition(masterPosition, ref.current);

  return (
    <div className={className} ref={ref}>
      {partId === currentPart.uid ? (
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
  position: Duration,
  container: HTMLDivElement | null
) => {
  if (typeof document !== 'undefined' && container) {
    const beatId = getBeatId(position);
    const beatElement: HTMLDivElement | null = container.querySelector(
      `[data-beat-id="${beatId}"]`
    );
    if (beatElement) {
      const { top: containerTop, left: containerLeft } =
        container.getBoundingClientRect();
      const { top, left } = beatElement.getBoundingClientRect();

      return {
        top: top - containerTop,
        left: left - containerLeft,
      };
    }
    // const barId = getBarId(position);
    // const barElement: HTMLDivElement | null = container.querySelector(
    //   `div[data-bar-id="${barId}"]`
    // );
    // if (barElement) {
    //   const { top: containerTop, left: containerLeft } =
    //     container.getBoundingClientRect();
    //   const { top, left } = barElement.getBoundingClientRect();

    //   return {
    //     top: top - containerTop,
    //     left: left - containerLeft,
    //   };
    // }
  }
  return { top: 0, left: 0 };
};
