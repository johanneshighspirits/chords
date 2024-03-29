'use client';

import { parseChord } from '@/helpers/chord';
import { ChordDetails } from '@/types';
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useChords } from './providers/SongProvider';

export const AddChord = () => {
  const [value, setValue] = useState('');
  const { currentPartUID, addChord } = useChords();
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ref.current && currentPartUID) {
      ref.current.focus();
    }
  }, [currentPartUID]);

  const addChordDetails = (chordDetails: ChordDetails | null) => {
    if (chordDetails !== null) {
      addChord(chordDetails);
    }
    setValue('');
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;
    if (inputValue.endsWith(' ')) {
      addChordDetails(parseChord(inputValue));
    } else {
      setValue(inputValue);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const chordDetails = parseChord(value);
    if (chordDetails) {
      addChordDetails(chordDetails);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={currentPartUID === undefined}
        type="text"
        ref={ref}
        value={value}
        onChange={handleChange}></input>
    </form>
  );
};
