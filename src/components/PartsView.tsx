'use client';

import { ChordsView } from './ChordsView';
import { useSong, useSongParts } from './providers/SongProvider';
import { Part } from '@/types';
import styles from './parts.module.css';
import { CSSProperties } from 'react';
import clsx from 'clsx';
import { Editable } from './Editable';
import { AddPart } from './AddPart';
import { getChordLines, getChordPattern } from '@/helpers/part';

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
      <AddPart />
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
  const { chordLines } = part;
  const { h, s, l } = part.color;

  const handleClick = () => {
    dispatch({ type: 'setActivePart', partId: part.id });
  };

  const handleEditTitle = (title: string) => {
    dispatch({ type: 'setPartTitle', title, partId: part.id });
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
      <h3>
        <Editable onEdit={handleEditTitle}>{part.title}</Editable>
      </h3>
      {chordLines?.map((line, i) => {
        return (
          <ChordsView
            key={line.pattern + i}
            chords={line.chords}
            repeatCount={line.repeatCount}
            isDuplicate={line.isDuplicate}
            partId={part.id}
          />
        );
      })}
    </article>
  );
};
