import { Chord } from '@/types';
import styles from './chords.module.css';

type ChordsViewProps = {
  chords: Chord[];
};
export const ChordsView = ({ chords }: ChordsViewProps) => {
  return (
    <ul className={styles.chords}>
      {chords.map((chord) => (
        <ChordView chord={chord} key={chord.id} />
      ))}
    </ul>
  );
};
type ChordViewProps = {
  chord: Chord;
};
const ChordView = ({ chord }: ChordViewProps) => {
  return <li className={styles.chord}>{chord.display}</li>;
};
