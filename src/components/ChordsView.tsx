import { Chord } from '@/types';
import styles from './chords.module.css';
import { RemoveChord } from './RemoveChord';
import clsx from 'clsx';

type ChordsViewProps = {
  chords: Chord[];
  partId: string;
  isDuplicate?: boolean;
};

export const ChordsView = ({
  partId,
  chords,
  isDuplicate,
}: ChordsViewProps) => {
  return (
    <ul className={clsx(styles.chords, isDuplicate && styles.duplicate)}>
      {chords.map((chord) => (
        <ChordView chord={chord} key={chord.id} partId={partId} />
      ))}
    </ul>
  );
};

type ChordViewProps = {
  chord: Chord;
  partId: string;
};

const ChordView = ({ partId, chord }: ChordViewProps) => {
  return (
    <li className={styles.chord}>
      <RemoveChord id={chord.id} partId={partId} />
      <span className={styles.display}>{chord.display}</span>
    </li>
  );
};
