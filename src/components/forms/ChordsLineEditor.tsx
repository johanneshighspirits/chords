'use client';

import styles from './ChordsLineEditor.module.css';
import { Chord } from '@/types';
import { useSong } from '../providers/SongProvider';

export const ChordsLineEditor = ({
  chords,
  partId,
}: {
  chords: Chord[];
  partId: string;
}) => {
  const { dispatch } = useSong();
  const handleDelete = () => {
    dispatch({
      type: 'removeChords',
      chordIds: chords.map((chord) => chord.uid),
      partId,
    });
  };
  const handleRepeat = () => {
    dispatch({
      type: 'addChords',
      chords,
      partId,
      afterChordId: chords[chords.length - 1].uid,
    });
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
