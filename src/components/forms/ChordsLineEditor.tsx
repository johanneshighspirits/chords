'use client';

import styles from './ChordsLineEditor.module.css';
import { Chord, isChord } from '@/types';
import { useChords } from '../providers/SongProvider';
import { BreakType } from '@/helpers/break';

export const ChordsLineEditor = ({
  chords,
  partId,
}: {
  chords: (Chord | BreakType)[];
  partId: string;
}) => {
  const { duplicateChords, removeChords } = useChords();
  const handleDelete = () => {
    const chordIds = chords.map((chord) => chord.uid);
    removeChords(chordIds, partId);
  };
  const handleRepeat = () => {
    duplicateChords(
      partId,
      chords.filter(isChord),
      chords[chords.length - 1].uid
    );
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
