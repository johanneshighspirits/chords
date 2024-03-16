'use client';

import { ChordsView } from './ChordsView';
import { useSong, useSongParts } from './providers/SongProvider';
import { Part } from '@/types';
import styles from './parts.module.css';
import { CSSProperties } from 'react';
import clsx from 'clsx';
import { Editable } from './Editable';
import { AddPart } from './AddPart';
import { RemovePart } from './RemovePart';
import { Playhead } from './Playhead';
import { updatePart } from '@/db/actions';

export const PartsView = () => {
  const { currentPartId, parts } = useSongParts();
  return (
    <section className={styles.parts}>
      {parts.map((part) => {
        return (
          <PartView
            key={part.uid}
            isActive={currentPartId === part.uid}
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
  const { chordLines = [] } = part;
  const { h, s, l } = part.color;

  const handleClick = () => {
    dispatch({ type: 'setActivePart', partId: part.uid });
  };

  const handleEditTitle = (title: string) => {
    if (title !== part.title) {
      updatePart({ ...part, title });
      dispatch({ type: 'setPartTitle', title, partId: part.uid });
    }
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
      <div className={styles.header}>
        <h3>
          <Editable onEdit={handleEditTitle}>{part.title}</Editable>
        </h3>
        <RemovePart uid={part.uid}></RemovePart>
      </div>
      {/* <Debug>{part.pattern}</Debug> */}
      {chordLines.length > 0 ? (
        <Playhead partId={part.uid} className={styles.chordLinesContainer}>
          {chordLines.map((line, i) => {
            return (
              <ChordsView
                key={line.pattern + i}
                lineIndex={i}
                chords={line.chords}
                repeatCount={line.repeatCount}
                isDuplicate={line.isDuplicate}
                partId={part.uid}
              />
            );
          })}
        </Playhead>
      ) : null}
    </article>
  );
};
