'use client';

import { CSSProperties } from 'react';
import { useSong, useSongParts } from './providers/SongProvider';
import partsStyles from './parts.module.css';
import styles from './arrangement.module.css';
import clsx from 'clsx';
import { Editable } from './Editable';
import { Part } from '@/types';
import { updatePart } from '@/db/actions';

export const ArrangementView = ({ className }: { className?: string }) => {
  const { parts } = useSongParts();
  return (
    <aside className={clsx(styles.arrangement, className)}>
      {parts.map((part) => {
        return <ArrangementItem key={part.uid} part={part} />;
      })}
    </aside>
  );
};

const ArrangementItem = ({ part }: { part: Part }) => {
  const { dispatch } = useSong();
  const {
    color: { h, s, l, a },
    title,
  } = part;

  const handleEditTitle = (title: string) => {
    if (title !== part.title) {
      updatePart({ ...part, title });
      dispatch({ type: 'setPartTitle', title, partId: part.uid });
    }
  };
  return (
    <li
      key={part.uid}
      className={clsx(partsStyles.part, styles.ArrangementItem)}
      style={
        {
          '--part-color': `hsl(${h} ${s}% ${l}% / ${a})`,
        } as CSSProperties
      }>
      <Editable onEdit={handleEditTitle}>{title}</Editable>
      <button className={clsx(styles.MoveButton, styles.MoveButtonUp)}>
        ⬆
      </button>
      <button className={clsx(styles.MoveButton, styles.MoveButtonDown)}>
        ⬇
      </button>
    </li>
  );
};
