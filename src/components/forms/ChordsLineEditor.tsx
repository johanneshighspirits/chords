'use client';

import styles from './ChordsLineEditor.module.css';
import { Chord } from '@/types';
import { useChords, useSong } from '../providers/SongProvider';

export const ChordsLineEditor = ({
  chords,
  partId,
}: {
  chords: Chord[];
  partId: string;
}) => {
  const { duplicateChords, removeChords } = useChords();
  const handleDelete = () => {
    const chordIds = chords.map((chord) => chord.uid);
    removeChords(chordIds, partId);
  };
  const handleRepeat = () => {
    duplicateChords(partId, chords, chords[chords.length - 1].uid);
  };

  return (
    <div className={styles.editor}>
      <button className="blank" onClick={handleRepeat}>
        +
      </button>
      <button className="blank" onClick={handleDelete}>
        x
      </button>
    </div>
  );
};
