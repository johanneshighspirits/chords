'use client';

import { parseChord } from '@/helpers/chord';
import { Chord } from '@/types';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useSong } from './providers/SongProvider';

export const AddChord = () => {
  const [value, setValue] = useState('');
  const { dispatch } = useSong();

  const addChord = (chord: Chord | null) => {
    if (chord !== null) {
      dispatch({ type: 'addChord', chord });
    }
    setValue('');
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputValue = e.target.value;
    if (inputValue.endsWith(' ')) {
      addChord(parseChord(inputValue));
    } else {
      setValue(inputValue);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const chord = parseChord(value);
    if (chord) {
      addChord(chord);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={value} onChange={handleChange}></input>
    </form>
  );
};
