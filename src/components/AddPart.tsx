'use client';

import clsx from 'clsx';
import styles from './addPart.module.css';
import { useSong } from './providers/SongProvider';
import { insertPart } from '@/db/actions';
import { Part } from '@/helpers/part';
import { useState } from 'react';

export const AddPart = () => {
  const { uid: songId, dispatch } = useSong();
  const [disabled, setDisabled] = useState(false);
  const handleClick = () => {
    setDisabled(true);
    const part = Part.new([]);
    dispatch({ type: 'addPart' });
    insertPart(songId, part).then(() => {
      setDisabled(false);
    });
  };
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={clsx(styles.button)}>
      Add part (+)
    </button>
  );
};
