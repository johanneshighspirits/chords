'use client';

import { ChordsView } from './ChordsView';
import { useSong, useSongParts } from './providers/SongProvider';
import { Part } from '@/types';
import styles from './parts.module.css';
import { CSSProperties } from 'react';
import clsx from 'clsx';

export const PartsView = () => {
  const { currentPartId, parts } = useSongParts();
  return (
    <section className={styles.parts}>
      {parts.map((part) => {
        return (
          <PartView
            key={part.id}
            isActive={currentPartId === part.id}
            part={part}
          />
        );
      })}
    </section>
  );
};

export const PartView = ({
  isActive,
  part,
}: {
  isActive: boolean;
  part: Part;
}) => {
  const { dispatch } = useSong();
  const { chords } = part;
  const { h, s, l } = part.color;

  const handleClick = () => {
    dispatch({ type: 'setActivePart', partId: part.id });
  };
  return (
    <article
      className={clsx(styles.part, isActive && styles.isActive)}
      onClick={handleClick}
      style={
        {
          '--part-color': `hsl(${h} ${s}% ${l}%)`,
        } as CSSProperties
      }>
      <h3>{part.title}</h3>
      <ChordsView chords={chords} />
    </article>
  );
};
