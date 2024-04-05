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
import { useAudio } from './providers/AudioProvider';

export const AddChord = () => {
  const [value, setValue] = useState('');
  const { addChord } = useChords();
  const { playChord } = useAudio();
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const chord = parseChord(value);
    if (chord) {
      playChord(chord);
    }
  }, [value, playChord]);

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
        type="text"
        ref={ref}
        value={value}
        onChange={handleChange}></input>
    </form>
  );
};
