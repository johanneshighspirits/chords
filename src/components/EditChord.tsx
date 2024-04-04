'use client';

import { formatChord, parseChord } from '@/helpers/chord';
import { useChords } from './providers/SongProvider';
import clsx from 'clsx';
import { Dialog } from './Dialog';
import { useState } from 'react';
import { Chord } from '@/types';
import styles from './forms/Form.module.css';

export const EditChord = ({
  chord,
  className,
}: {
  chord: Chord;
  className?: string;
}) => {
  const { editChord } = useChords();
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(formatChord(chord));

  return (
    <>
      <button
        className={clsx('blank', className)}
        onClick={() => setIsEditMode(true)}>
        ✎
      </button>
      <Dialog
        open={isEditMode}
        onClose={(e) => {
          if (e.target.returnValue === 'OK') {
            const newChord = parseChord(inputValue);
            if (newChord) {
              editChord(chord.uid, newChord, 'chordChange');
            }
          }
          setIsEditMode(false);
          setInputValue('');
        }}>
        <form method="dialog" className={styles.Form}>
          <input
            type="text"
            value={inputValue}
            style={{ textAlign: 'center', fontSize: 'larger' }}
            onChange={(e) => setInputValue(e.currentTarget.value)}
            name="new-chord-controlled"></input>
          <button value="cancel">Cancel</button>
          <button type="submit" value="OK">
            Save
          </button>
        </form>
      </Dialog>
    </>
  );
};
