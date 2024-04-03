import clsx from 'clsx';
import styles from './PlayButton.module.css';
import { Chord } from '@/types';
import { useAudio } from './providers/AudioProvider';

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
      ▶︎
    </button>
  );
};
