'use client';

import styles from './ChordsLineEditor.module.css';
import { Chord } from '@/types';
import { useChords, useSong } from '../providers/SongProvider';
import { deleteChord, insertChord, updateChordTiming } from '@/db/actions';
import { AddChord } from '../AddChord';

export const ChordsLineEditor = ({
  chords,
  partId,
}: {
  chords: Chord[];
  partId: string;
}) => {
  const { dispatch } = useSong();
  const { duplicateChords, removeChords } = useChords();
  const handleDelete = () => {
    const chordIds = chords.map((chord) => chord.uid);
    dispatch({
      type: 'removeChords',
      chordIds,
      partId,
    });
    deleteChord(chordIds);
  };
  const handleRepeat = () => {
    const result = duplicateChords(
      partId,
      chords,
      chords[chords.length - 1].uid
    );
    if (result) {
      insertChord(partId, result.newChords);
      updateChordTiming(result.modifiedChords);
    }
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
