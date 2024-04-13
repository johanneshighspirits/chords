import clsx from 'clsx';
import styles from './PlayButton.module.css';
import { Chord } from '@/types';
import { useAudio } from './providers/AudioProvider';
import { useEffect, useRef, useState } from 'react';
import { randomNr } from '@/helpers/common';

export const PlayButton = ({
  chord,
  className,
}: {
  chord: Chord;
  className?: string;
}) => {
  const { playChord } = useAudio();

  return (
    <button
      onClick={() => playChord(chord)}
      className={clsx('blank', styles.PlayButton, className)}>
      <PlayAnimation chordId={chord.uid} />
      ▶︎
    </button>
  );
};

export const PlayAnimation = ({
  chordId,
  nrOfBars = 3,
}: {
  chordId: string;
  nrOfBars?: number;
}) => {
  const { playingChords } = useAudio();
  const isPlaying = playingChords.has(chordId);
  return (
    <div
      className={clsx(styles.PlayAnimation, { [styles.IsPlaying]: isPlaying })}>
      {isPlaying &&
        Array.from({ length: nrOfBars }, (_, i) => <Frequency key={i} />)}
    </div>
  );
};

const Frequency = () => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const start = Date.now();
    const animate = () => {
      const ms = randomNr(20, 150);
      return setTimeout(() => {
        clearTimeout(timer.current);
        if (ref.current) {
          const now = Date.now();
          if (now - start > 1200) {
            clearTimeout(timer.current);
            ref.current.style.transform = `scaleY(0)`;
          } else {
            const scale = randomNr(0.1, 1);
            ref.current.style.transform = `scaleY(${scale})`;
            timer.current = animate();
          }
        }
      }, ms);
    };
    timer.current = animate();
    return () => clearTimeout(timer.current);
  }, []);

  return <span ref={ref} className={styles.FreqBar}></span>;
};
